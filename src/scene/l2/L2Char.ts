class L2Char extends eui.Group {

    private static hpBoardWidth: number = 3; // 周围一圈血条宽度

    public timeBarPort: L2TimeBarPort;
    private hpMask: egret.Shape;
    private bgWidth: number;
    public imgName: string;

    // 角色原始属性
    private rawAttr: L2CharAttr;

    // 运行时状态
    private nowTime: number = 0;
    public timePrior: number = 100; // 时间权重，正常为100，0最大
    public camp: L2Camp;
    private hp: number;
    public alive: boolean;
    private cell: L2Cell;
    public buffs: MySet<L2Buff>;
    public status: MySet<L2BuffStatus>;

    // 运行时属性
    public attr: L2CharAttr;

    public name: string;

    public get HP(): number {
        return this.hp;
    }

    public get Cell(): L2Cell {
        return this.cell;
    }

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
    public placeToCell():void{
        if(this.cell==null) return;
        this.x = this.cell.x;
        this.y = this.cell.y;
    }

    public hpChange(hpChangeNum: number): number {
        // 更新血量
        let newHp = hpChangeNum + this.hp;
        if (newHp > 0) {
            this.hp = newHp;
        } else {
            this.hp = 0;
        }
        this.drawHpCircle(this.hp / this.attr.maxHp);
        this.harmFloat(-hpChangeNum, false);
        if (this.hp != 0 && hpChangeNum < 0){
            egret.Tween.get(this).to({rotation:-15}, 60).to({rotation:15}, 120).to({rotation:0}, 60);
        }
        // 执行死亡
        if (this.hp == 0) {
            console.log(`${this.debugNAndP()} dead`);
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

    public constructor(width: number, imgName: string, camp: L2Camp) {
        super();
        this.camp = camp;
        this.bgWidth = width;
        this.width = width;
        this.height = width;
        this.alive = true;
        this.rawAttr = new L2CharAttr();
        // attr的属性等于raw的属性 + buff加成后得到TODO:复制raw的属性到attr中
        this.attr = new L2CharAttr();
        this.hp = 0;
        this.imgName = imgName;

        // 构建血条底色，绿色表示我方，红色表示敌方
        let hpBg = new egret.Shape();
        let bgColor = camp == L2Camp.Player ? ColorDef.LimeGreen : ColorDef.DarkRed;
        Util.drawSquar(hpBg, width, bgColor);
        this.addChild(hpBg);
        this.hpMask = new egret.Shape();
        hpBg.mask = this.hpMask;
        this.addChild(this.hpMask);
        this.drawHpCircle(1);

        // 构建头像
        let imgWidth = width - L2Char.hpBoardWidth * 2;
        let img = new eui.Image(imgName);
        img.width = imgWidth * 1.6;
        img.height = img.width;
        let offset = (img.width - imgWidth) / 2;
        img.mask = new egret.Rectangle(offset, offset, imgWidth, imgWidth);
        this.addChild(img);
        img.x = - offset + L2Char.hpBoardWidth;
        img.y = img.x;

        // 构建时间轴上的头像，在MainUI中intial完毕后统一加入到轴上
        this.timeBarPort = new L2TimeBarPort(imgName, this);

        this.buffs = new MySet<L2Buff>();

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

    public drawHpCircle(hpPercent: number) {
        this.hpMask.x = 0
        this.hpMask.y = 0;
        this.drawCircle(this.hpMask, hpPercent * 360, this.bgWidth);
        this.hpMask.x = this.bgWidth / 2;
        this.hpMask.y = this.bgWidth / 2;
    }

    public startAction(): void {
        console.log(`${this.debugNAndP()} action`);
        let tw = egret.Tween.get(this);
        let target = this.findMinDisOppose();
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.skillManager.currentSkillTargets = [target];
        if (this.isInAtkRange(target)) {
            scene.skillManager.pushSkill(L2Config.SKILLCFG["NormalATK"], this);
        } else {
            // 找到离目标最近的移动范围的cell，如果存在距离一致的，就找同时离我自己最近的格子
            let movableCells = this.allMovableCells();
            movableCells.sort((a, b) => { 
                let rs = a.disTo(target.cell) - b.disTo(target.cell);
                if(rs == 0){rs = a.disTo(this.cell) - b.disTo(this.cell)}
                return rs;
            });
            let targetCell = movableCells[0];
            scene.isCharMoveEnd = false;
            this.moveTo(targetCell, tw);
            // 移动结束后查看是否能够攻击到目标，可以就发起攻击
            tw.call(()=>{
                scene.isCharMoveEnd = true;
                if (this.isInAtkRange(target)){
                    scene.skillManager.pushSkill(L2Config.SKILLCFG["NormalATK"], this);
                }
            });
        }
    }

    public moveTo(desCell: L2Cell, tw:egret.Tween): void{
        console.log(`${this.debugNAndP()} move to ${desCell.rowX}, ${desCell.colY}`);
        this.Cell=desCell;
        tw.to({x:desCell.x, y:desCell.y}, 800);
    }

    public debugNAndP():string{
        return `${this.name} - ${this.cell.rowX},${this.cell.colY}`;
    }

    /**
     * 返回最近的敌对阵营单位，如果存在距离一致的单位，那么就返回血量最少的单位
     */
    public findMinDisOppose(): L2Char {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let selectChars = this.camp == L2Camp.Player ? scene.enemies : scene.players;
        selectChars = selectChars.filter((item)=>{return item.alive == true;})
        selectChars.sort((a, b) => {
            let result = this.disToChar(a) - this.disToChar(b);
            if (result != 0){return result}
            return a.hp - b.hp;
        });
        return selectChars[0];
    }

    public isInAtkRange(target: L2Char): boolean {
        return this.isCellInAtkRange(target.cell);
    }

    public refreshBuffStatus(){

    }

    public refreshBuffAttr(){

    }


    public isCellInAtkRange(cell: L2Cell): boolean {
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

    public harmFloat(harmNum: number, isCrit: boolean) {
        if (this.alive) {
            let harmText = "";
            let extraText = "miss";
            let size = 25;
            let color:number = 0;
            harmNum = Math.ceil(harmNum);
            if (harmNum != 0) {
                size = isCrit ? 30 : 25;
                let isHeal = harmNum < 0;
                extraText = isCrit ? "暴击 " : isHeal ? "治疗 " : "";
                color = isHeal ? ColorDef.LimeGreen : isCrit ?
                    ColorDef.DarkRed : ColorDef.Red;
                harmText = `${isHeal?"+":""}${-harmNum}`;
            }
            ToastInfoManager.newToast(
                `${extraText}${harmText}`, color,
                this.y + this.width/2, this.x - GameRoot.GameStage.stageWidth / 2 + this.width/2,
                -50, 0, 1000, size, false, egret.Ease.quadOut
            );
        }
    }

    public release(): void {
        this.timeBarPort.release();
        this.timeBarPort = null;
        this.hpMask = null;
        this.cell = null;
    }

}

enum L2Camp {
    Enemy = 1,
    Player = -1
}