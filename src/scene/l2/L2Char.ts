class L2Char extends eui.Group {

    private static hpBoardWidth: number = 3; // 周围一圈血条宽度

    public config: L2CharCfg;
    public targets: any[]; // 可能是Char也可能是Cell

    // 展示组件
    public timeBarPort: L2TimeBarPort;
    private hpMask: egret.Shape;
    private bgWidth: number;
    // 角色原始属性，实际属性要根据Buff再计算一遍
    private rawAttr: L2CharAttr;

    // 运行时状态
    /**
     * 该角色的当前时间轴顺位
     */
    private nowTime: number = 0;
    /**
     * 时间权重，正常为100，越小代表当时间轴重叠时具有更优先的执行顺序
     */
    public timePrior: number = 100;
    public camp: L2Camp;
    private hp: number;
    public alive: boolean;
    private cell: L2Cell;
    public buffs: MySet<L2Buff>;
    private status: MySet<L2BuffStatus>;

    // 运行时属性
    public attr: L2CharAttr;

    public get HP(): number {
        return this.hp;
    }

    public get Cell(): L2Cell {
        return this.cell;
    }

    public onSelect() {
        if (!this.filters) {
            L2Filters.addYellowGlow(this);
        }
    }

    public unSelect() {
        this.filters = null;
    }

    /**
     * 设置角色的cell，但并不会跟新角色位置，需要额外再调用placeToCell
     */
    public set Cell(cell: L2Cell) {
        let beforeCell: L2Cell = null;
        if (this.cell != null) {
            beforeCell = this.cell;
        }
        this.cell = cell;
        if (beforeCell != null) {
            beforeCell.char = null;
        }
        if (cell == null) {
            return;
        }
        cell.char = this;
    }

    /**
     * 设置cell和实际放到位置上分开，方便逻辑和表现分离
     */
    public placeToCell(): void {
        if (this.cell == null) return;
        this.x = this.cell.x;
        this.y = this.cell.y;
    }

    public hpChange(hpChangeNum: number): number {
        if (!this.alive) return;
        // 更新血量
        hpChangeNum = Math.ceil(hpChangeNum);
        let newHp = hpChangeNum + this.hp;
        newHp = Util.clamp(newHp, 0, this.attr.maxHp);
        this.harmFloat(this.hp - newHp);
        this.hp = newHp;
        this.drawHpCircle(this.hp / this.attr.maxHp);
        if (this.hp != 0 && hpChangeNum < 0) {
            egret.Tween.get(this).to({ rotation: -15 }, 60).to({ rotation: 15 }, 120).to({ rotation: 0 }, 60);
        }
        // 执行死亡
        if (this.hp == 0) {
            if (DEBUG) console.log(`${this.debugNAndP()} dead`);
            this.alive = false;
            this.Cell = null;
            Util.safeRemoveFromParent(this.timeBarPort);
            Util.safeRemoveFromParent(this);
        }

        // 返回当前血量
        return this.hp;
    }


    public hpChangeTo(hp: number): void {
        let changeNum: number = hp - this.hp;
        this.hpChange(changeNum);
    }

    public get NowTime(): number { return this.nowTime; }

    public constructor(cfg: L2CharCfg, camp: L2Camp) {
        super();
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let headWidth = scene.board.realCellWidth;
        this.config = cfg;
        this.rawAttr = new L2CharAttr(cfg);
        this.attr = new L2CharAttr(cfg);
        this.camp = camp;
        this.alive = true;
        this.hp = 0;

        // 构造各种组件
        this.bgWidth = headWidth;
        this.width = headWidth;
        this.height = headWidth;
        // 构建血条底色，绿色表示我方，红色表示敌方
        let hpBg = new egret.Shape();
        let bgColor = camp == L2Camp.Player ? ColorDef.LimeGreen : ColorDef.DarkRed;
        Util.drawSquar(hpBg, headWidth, bgColor);
        this.addChild(hpBg);
        this.hpMask = new egret.Shape();
        hpBg.mask = this.hpMask;
        this.addChild(this.hpMask);
        this.drawHpCircle(1);
        // 构建头像
        let imgWidth = headWidth - L2Char.hpBoardWidth * 2;
        let img = new eui.Image(cfg.imgName);
        img.width = imgWidth * 1.6;
        img.height = img.width;
        let offset = (img.width - imgWidth) / 2;
        img.mask = new egret.Rectangle(offset, offset, imgWidth, imgWidth);
        this.addChild(img);
        img.x = - offset + L2Char.hpBoardWidth;
        img.y = img.x;
        // 构建时间轴上的头像，在MainUI中intial完毕后统一加入到轴上
        this.timeBarPort = new L2TimeBarPort(this);
        // 其他数值组件
        this.buffs = new MySet<L2Buff>();
        this.status = new MySet<L2BuffStatus>();
        // 事件
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    private onTap(): void {
        MessageManager.Ins.sendMessage(MessageType.L2CHARTAP, this);
    }

    public setTime(nowTime: number): void {
        this.nowTime = nowTime;
        this.timeBarPort.setTime(nowTime);
    }

    public highLight(): void {
        egret.Tween.get(this).to({ alpha: 0.2 }, 250).to({ alpha: 1 }, 250);
    }

    private drawCircle(shape: egret.Shape, endAngle: number, radius: number) {
        let startAngle = -90;
        endAngle -= 90;
        Util.drawAngleCircle(shape, endAngle, radius, startAngle);
    }

    private drawHpCircle(hpPercent: number) {
        this.hpMask.x = 0
        this.hpMask.y = 0;
        this.drawCircle(this.hpMask, hpPercent * 360, this.bgWidth);
        this.hpMask.x = this.bgWidth / 2;
        this.hpMask.y = this.bgWidth / 2;
    }

    public startAction(): void {
        if (DEBUG) console.log(`${this.debugNAndP()} start auto action`);
        let tw = egret.Tween.get(this);
        let target = this.findMinDisOppose();
        this.targets = [target];
        let scene = SceneManager.Ins.curScene as L2MainScene;
        if (this.isInAtkRange(target)) {
            this.normalAtk();
        } else {
            // 找到离目标最近的移动范围的cell，如果存在距离一致的，就找同时离我自己最近的格子
            let movableCells = this.allMovableCells();
            movableCells.sort((a, b) => {
                let rs = a.disTo(target.cell) - b.disTo(target.cell);
                if (rs == 0) { rs = a.disTo(this.cell) - b.disTo(this.cell) }
                return rs;
            });
            let targetCell = movableCells[0];
            scene.isCharMoveEnd = false;
            this.moveTo(targetCell, tw);
            // 移动结束后查看是否能够攻击到目标，可以就发起攻击
            tw.call(() => {
                scene.isCharMoveEnd = true;
                if (this.isInAtkRange(target)) {
                    this.normalAtk();
                }
            });
        }
    }

    public moveTo(desCell: L2Cell, tw: egret.Tween): void {
        if (DEBUG) console.log(`${this.debugNAndP()} move to ${desCell.rowX + 1}, ${desCell.colY + 1}`);
        this.Cell = desCell;
        tw.to({ x: desCell.x, y: desCell.y }, 800);
    }

    public debugNAndP(): string {
        return `${this.config.name} - ${this.cell.rowX + 1},${this.cell.colY + 1}`;
    }

    /**
     * 返回最近的敌对阵营单位，如果存在距离一致的单位，那么就返回血量最少的单位
     */
    private findMinDisOppose(): L2Char {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let selectChars = this.camp == L2Camp.Player ? scene.enemies : scene.players;
        selectChars = selectChars.filter((item) => { return item.alive == true; })
        selectChars.sort((a, b) => {
            let result = this.disToChar(a) - this.disToChar(b);
            if (result != 0) { return result }
            return a.hp - b.hp;
        });
        return selectChars[0];
    }

    private isInAtkRange(target: L2Char): boolean {
        return this.isCellInAtkRange(target.cell);
    }

    private normalAtk() {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.skillManager.pushSkill(
            L2Config.SkillCfg[this.config.normalAtkSkillId], this
        );
    }

    public isDizz(): boolean {
        return this.status.has(L2BuffStatus.Dizz);
    }

    public isSlient(): boolean {
        return this.status.has(L2BuffStatus.Slient);
    }

    public refreshBuffAttr() {
        // 计算生效buff
        let attrBuffTemp: L2Buff[] = [];
        for (let buff of this.buffs.data) {
            if (buff.enable && buff.config.buffType == L2BuffType.AttrChange) {
                attrBuffTemp.push(buff);
            }
        }

        // 统计增益比例及数值
        let attrAdd: { [key: string]: number } = {}
        let attrRatio: { [key: string]: number } = {}
        for (let attrName in L2AttrNames) {
            attrAdd[attrName] = 0;
            attrRatio[attrName] = 0;
        }
        for (let buff of attrBuffTemp) {
            for (let attrName in L2AttrNames) {
                if (attrName in buff.config.attrNumAdd) {
                    attrAdd[attrName] += buff.config.attrNumAdd[attrName];
                }
                if (attrName in buff.config.attrPercAdd) {
                    attrRatio[attrName] += buff.config.attrPercAdd[attrName];
                }
            }
        }

        // 计算增益后属性
        for (let attrName in L2AttrNames) {
            let newAttrNum = this.rawAttr[attrName] * (1 + attrRatio[attrName]) + attrAdd[attrName];
            // 如果最大生命增加了，则对其生命也做相同的增加处理；如果最大生命降低了同理，但最多保留1点血量
            if (attrName == L2AttrNames.maxHp) {
                let addHp = newAttrNum - this.attr.maxHp;
                if (addHp + this.hp <= 0) {
                    addHp = 1 - this.hp;
                }
                this.hpChange(addHp);
            }
            this.attr[attrName] = newAttrNum;
        }
    }

    public refreshBuffStatus() {
        // 计算状态
        this.buffs.removeAll();
        let statusTemp: L2BuffStatus[] = [];
        for (let buff of this.buffs.data) {
            if (buff.enable && buff.config.buffType == L2BuffType.Status) {
                statusTemp.push(buff.config.status);
            }
        }
        for (let status of statusTemp) {
            this.status.add(status);
        }

        // TODO: 跟新状态表示
        // if (this.isDizz()) {
        //     this._charPort.toDizz();
        // } else {
        //     this._charPort.outDizz();
        // }

        // if (this.isSlient()) {
        //     this._charPort.toSlient();
        // } else {
        //     this._charPort.outSlient();
        // }
    }


    private isCellInAtkRange(cell: L2Cell): boolean {
        let dis = cell.disTo(this.cell);
        if (dis <= this.attr.atkRange) return true;
        return false;
    }

    /**
     * 获取所有可以移动到的格子，排除所有有单位占用及不可行走的格子
     */
    public allMovableCells(): L2Cell[] {
        let cells: L2Cell[] = this.cell.rangeCells(this.attr.moveRange);
        let targetCells: L2Cell[] = [];
        for (let cell of cells) {
            if (cell == this.cell || cell.char != null) { // TODO: 未来判断各种不能行走的区域
                continue;
            }
            targetCells.push(cell);
        }
        return targetCells;
    }

    public disToChar(otherChar: L2Char): number {
        return this.disToCell(otherChar.cell);
    }

    public disToCell(otherCell: L2Cell): number {
        if (this.cell == null || otherCell == null) {
            return -1;
        }
        return this.cell.disTo(otherCell);
    }

    private harmFloat(harmNum: number) {
        if (this.alive) {
            let harmText = "";
            let size = 25;
            let color: number = 0;
            harmNum = Math.ceil(harmNum);
            let isHeal = harmNum <= 0;
            color = isHeal ? ColorDef.LimeGreen : ColorDef.Red;
            harmText = `${isHeal ? "+" : ""}${-harmNum}`;
            ToastInfoManager.newToast(
                harmText, color,
                this.y + this.width / 2, this.x - GameRoot.GameStage.stageWidth / 2 + this.width / 2,
                -50, 0, 2500, size, false, egret.Ease.quadOut
            );
        }
    }

    public endAction(): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        // 发送结束行动消息
        MessageManager.Ins.sendMessage(MessageType.L2BuffTriggerTime, [L2TriggerTimeType.AfterAction]);
        // 行动结束时所有buff持续时间-1
        for (let buff of this.buffs.data) {
            scene.buffManager.changeBuffDuration(buff, -1);
        }
    }

    public findMinDisAllies(range: number): L2Char {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let allies = this.camp == L2Camp.Player ? scene.players : scene.enemies;
        let minDis = 1000;
        let resultChar = null;
        for (let char of allies) {
            if (char != this && char.alive) {
                let dis = char.disToChar(this)
                if (dis < minDis && dis <= range) {
                    resultChar = char;
                    minDis = dis;
                }
            }
        }
        return resultChar;
    }

    public release(): void {
        this.timeBarPort.release();
        this.timeBarPort = null;
        this.hpMask = null;
        this.cell = null;
        this.status = null;
        this.config = null;
        this.buffs.removeAll();
        this.buffs = null;
    }

}

enum L2Camp {
    Enemy = 1,
    Player = -1
}