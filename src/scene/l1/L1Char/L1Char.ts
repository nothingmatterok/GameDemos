class L1Char {
    // 运行时属性，可能在运行时修改
    public maxHp: number;
    public def: number;
    public atk: number;
    public critPoint: number;
    public dodgePoint: number;
    public critTime: number;
    public alive: boolean;
    private _curHp: number;
    private _curAnger: number = 0;
    private _angerAddFrame: number = 0;
    public inSkillCasting: boolean = false;

    public addAngerNumber(v: number) {
        let curAnger = this._curAnger + v;
        if (curAnger > L1CharAttr.MAXANGER) {
            curAnger = L1CharAttr.MAXANGER;
        }
        this._curAnger = curAnger;
        if (this._charPort.initialed) {
            this._charPort.drawAngerCircle(curAnger / L1CharAttr.MAXANGER);
        }
    }

    // 运行时状态
    public normalAttakTarget: L1Char;
    private _destPos: [number, number] = [0, 0];
    public buffStatus: MySet<L1BuffStatus>;
    public buffs: MySet<L1Buff>;


    // 角色技能信息
    public charId: number;
    public name: string;
    public skills: L1Skill[];
    private normalAttackSkill: L1Skill;

    // 角色阵营信息
    public camp: L1Camp;
    public oppos: L1Char[];
    public coops: L1Char[];

    // 辅助成员信息
    private _charPort: L1CharPortr;
    public skillManager: L1SkillManager;


    public get x(): number {
        return this._charPort.x;
    }
    public get y(): number {
        return this._charPort.y;
    }

    public get pos(): [number, number] {
        return [this.x, this.y]
    }

    public set x(value: number) {
        this._charPort.x = value;
    }
    public set y(value: number) {
        this._charPort.y = value;
    }

    public set rotation(v: number) {
        this._charPort.rotationCircle.rotation = v;
    }

    public get rotation(): number {
        return this._charPort.rotationCircle.rotation;
    }

    public rawAttr: L1CharAttr;
    public get moveSpeed(): number {
        return this.rawAttr.moveSpeed;
    }
    public get rotationSpeed(): number {
        return this.rawAttr.rotationSpeed;
    }

    public set curHp(value: number) {
        if (!this.alive) {
            return;
        }
        if (value > this.maxHp) value = this.maxHp;
        if (value <= 0) {
            this._curHp = 0;
            this.alive = false;
            this._charPort.drawHpCircle(0);
            // TODO: 增加死亡动画，并在动画结束后移除
            this.removeFromScene();
        } else {
            this._curHp = value;
            if (this._charPort.initialed) {
                this._charPort.drawHpCircle(value / this.maxHp);
            }
        }
    }

    public get curHp(): number { return this._curHp; }

    constructor(camp: L1Camp, charId: number) {
        this.alive = true;
        this.camp = camp;
        this.skillManager = (SceneManager.Ins.curScene as L1NormalBattleScene).skillManager;
        this.charId = charId;
        let [attr, skillCfgs, normalSkillCfg, passiveCfgs, name, portImageName] =
            CHARCFGS[charId];
        this._charPort = new L1CharPortr(camp, portImageName, charId);
        this.name = name;
        this.rawAttr = attr;
        this.skills = skillCfgs.map((skillCfg) => { return L1SkillManager.Ins.newSkill(skillCfg, this) });
        this.maxHp = this.rawAttr.maxHp;
        this.curHp = this.maxHp;
        this._curAnger = 0;
        this.def = this.rawAttr.def;
        this.atk = this.rawAttr.atk;
        this.dodgePoint = this.rawAttr.dodgePoint;
        this.critPoint = this.rawAttr.critPoint;
        this.critTime = this.rawAttr.critTime;
        this._angerAddFrame = this.rawAttr.angerAdds / 60;
        this.normalAttackSkill = this.skillManager.newSkill(normalSkillCfg, this);

        // 构建其他运行时内容
        this.buffStatus = new MySet<number>();
        this.buffs = new MySet<L1Buff>();

    }

    public initial(oppos: L1Char[], coops: L1Char[]) {
        this.oppos = oppos;
        this.coops = coops;
        // 根据顺位计算初始位置
        let posIndex = coops.indexOf(this);
        let xOffsetSymbol = this.camp == L1Camp.Player ? -1 : 1;
        this.x = (Math.floor(posIndex / 2) * 130 + 130) * xOffsetSymbol + GameRoot.GameStage.stageWidth / 2;
        this.y = ((posIndex % 2) * 2 - 1) * (70 + Math.floor(posIndex / 2) * 100) + 500;
        // 转向
        if(this.camp == L1Camp.Enemy){
            this.rotation = 180;
        }
    }

    private _curSkillIndex = 0; // 主动技能释放顺位

    public update() {
        // 如果单位已经死亡，不再维护任何状态
        if (!this.alive) return;

        // 默认增加怒气
        this.addAngerNumber(this._angerAddFrame);

        // 如果眩晕则返回
        if (this.isDizz()) return;

        // 如果在技能释放过程中则返回
        if (this.inSkillCasting) return;

        // 寻找不目标，如果目标不存在或死亡，找一个新的目标
        if (this.normalAttakTarget == null || (!this.normalAttakTarget.alive)) {
            this.normalAttakTarget = this.findNormalATKTarget(this.oppos);
            // console.log(`${this.charId}find new target${this._normalAttakTarget.charId}`);
        }
        // 如果找完目标，目标依然为空，说明游戏结束了，直接返回
        if (this.normalAttakTarget == null) {
            return;
        }

        // 根据找到的目标，找一个合适的位置
        let destPos = this.findATKLocation();
        // 取整数方便计算
        this._destPos = [Math.ceil(destPos[0]), Math.ceil(destPos[1])]

        // 如果位置发生变化
        if (!this.isSamePos([this.x, this.y], this._destPos)) {
            this.movingTo(this._destPos);
            // 如果角度不对，还需要一边转动一边移动
            let destRotDeg = this.getRotationToPos(this._destPos);
            destRotDeg = this.getPropDestRotation(destRotDeg);
            this.rotTo(destRotDeg);
            return;
        }

        // 先进行转向目标
        let destRotDeg = this.getRotationToPos([this.normalAttakTarget.x, this.normalAttakTarget.y]);
        destRotDeg = this.getPropDestRotation(destRotDeg);
        this.rotTo(destRotDeg);
        if (!Util.isNumEqual(this.rotation, destRotDeg)) {
            // 如果还在转向就返回，如果已经完成转向进入下一步技能释放过程
            return;
        }

        // 判断需要释放的技能
        // 1.如果怒气满了，按照技能顺序判断是否存在cd OK的技能，进行释放
        // 按照顺序进行释放，如果有技能在CD，则这一轮跳过该技能，如果所有技能都在CD
        // 则在下一次技能回到该顺位时，进行到下一步
        if (this._curAnger == L1CharAttr.MAXANGER && !this.isSlient()) {
            let skillTrunId = this._curSkillIndex;
            while (true) {
                let skill = this.skills[skillTrunId]
                if (skill.isCoolDown()) {
                    this.skillManager.castSkill(skill);
                    this.addAngerNumber(-L1CharAttr.MAXANGER);
                    this._curSkillIndex = skillTrunId + 1;
                    if (this._curSkillIndex == this.skills.length) {
                        this._curSkillIndex = 0;
                    }
                    return;
                } else {
                    skillTrunId += 1;
                    if (skillTrunId == this.skills.length) {
                        skillTrunId = 0;
                    }
                    if (skillTrunId == this._curSkillIndex) {
                        break;
                    }
                }
            }
        }

        // 2.否则判断普通攻击是否cd好了，且目标在普攻范围内，进行释放
        if (this.targetInRange() && this.normalAttackSkill.isCoolDown()) {
            this.skillManager.castSkill(this.normalAttackSkill);
        }
    }

    private getRotationToPos(pos: [number, number]): number {
        let targetRad = Util.getRad([this.x, this.y], pos);
        // 与竖直向下的夹角的角度90度 = this.rotation的0度，这里做一个到自己的rotation的变换
        // 需要注意rotaion与getRad的+方向是相反的
        return Math.ceil(Util.degNormalize(90 - targetRad / angle2RadParam));
    }

    // 根据自己的角度，再对角度进行一个转换，得到距离最近的角度表示，防止 -179 -> 180这种情况
    private getPropDestRotation(deg: number): number {
        let minDis = Math.abs(deg - this.rotation);
        let dis360 = Math.abs(deg + 360 - this.rotation);
        let disSub360 = Math.abs(deg - 360 - this.rotation);
        if (dis360 < minDis) return deg + 360;
        if (disSub360 < minDis) return deg - 360;
        return deg;
    }

    private isSamePos(pos1: [number, number], pos2: [number, number], delta: number = 6): boolean {
        return (Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1])) <= delta;
    }

    private movingTo(desPos: [number, number]) {
        let rad = Util.getRad([this.x, this.y], desPos);
        // 每帧多少s * 每秒多少米
        const frameTime = 1 / GameRoot.GameStage.frameRate;
        let frameSpeed = frameTime * this.moveSpeed;
        this.x = Math.ceil(this.x + frameSpeed * Math.sin(rad));
        this.y = Math.ceil(this.y + frameSpeed * Math.cos(rad));
    }

    public startAnim(posList: Array<[number, number]>, durations: Array<number>) {
        this._charPort.startAnim(posList, durations);
    }

    private rotTo(deg: number) {
        if (Util.isNumEqual(deg, this.rotation)) {
            return;
        }

        // console.log(`${this.charId} from ${this.rotation} to ${deg}`);

        // 每帧多少度
        const frameTime = 1 / GameRoot.GameStage.frameRate;
        let frameRotSpeed = frameTime * this.rotationSpeed;
        if (Math.abs(this.rotation - deg) < frameRotSpeed) {
            this.rotation = deg;
            return;
        }
        if (this.rotation > deg) {
            this.rotation -= frameRotSpeed;
            return;
        }
        if (this.rotation < deg) {
            this.rotation += frameRotSpeed;
            return;
        }

    }

    /**
     * 寻找一个合适的普通攻击目标
     * @param enemies 
     */
    private findNormalATKTarget(enemies: L1Char[]): L1Char {
        let minDis = Number.MAX_VALUE;
        let curEnemy = null;
        for (let enemy of enemies) {
            if (enemy.alive) {
                let curDis = this.disFrom(enemy);
                if (curDis < minDis) {
                    curEnemy = enemy;
                    minDis = curDis;
                }
            }
        }
        return curEnemy;
    }

    private disFrom(other: L1Char) {
        return Util.pointDistance([other.x, other.y], [this.x, this.y]);
    }


    private targetInRange(): boolean {
        return this.rawAttr.range - this.disFrom(this.normalAttakTarget) > -10;
    }

    /**
     * 寻找一个合适的普通攻击位置
     */
    private findATKLocation(): [number, number] {
        // 如果没有目标，或目标在射程范围内，且坐标合法,返回自己的坐标
        if ((this.normalAttakTarget == null || this.targetInRange()) && this.isPosLegal(this.x, this.y)) {
            return [this.x, this.y];
        }

        // 如果有目标，且攻击不到或当前位置不合法，找一个最恰当的位置（不会和其他冲撞）
        // 判定规则如下：
        // 1.从当前点和目标连一条直线，判断刚好等于射程的点是不是可以，如果合法就返回
        // 2.如果不可以，以射程为半径，画一个圆，每30度查看一个点是否可以，如果合法就返回
        // 3.如果没有就看射程往内（角色之间最小距离）范围区域是否可以，如果合法就返回
        // 4.如果没有就直接往连线的反方向外一点点判断，直到位置合法
        let targetX = this.normalAttakTarget.x;
        let targetY = this.normalAttakTarget.y;
        let x: number = 0;
        let y: number = 0;
        let targetRad = Util.getRad([targetX, targetY], [this.x, this.y]);
        // 30度的弧度增量
        const rad30Add = 30 * angle2RadParam;
        // 判断第一条，距离刚好
        [x, y] = this.getLinePosByRad([targetX, targetY], targetRad, this.rawAttr.range);
        if (this.isPosLegal(x, y)) return [x, y];
        //判断第二条，以30度累加判断11次找合法点
        let targetRadAdd = targetRad;
        for (let i = 1; i < 12; i++) {
            targetRadAdd = targetRadAdd + rad30Add;
            [x, y] = this.getLinePosByRad([targetX, targetY], targetRadAdd, this.rawAttr.range);
            if (this.isPosLegal(x, y)) return [x, y];
        }
        // 判断第三条，向角色靠拢
        let disToCenter = this.rawAttr.range - L1CharAttr.CHARMINDIS / 4;
        while (disToCenter > L1CharAttr.CHARMINDIS) {
            [x, y] = this.getLinePosByRad([targetX, targetY], targetRad, disToCenter);
            if (this.isPosLegal(x, y)) return [x, y];
            disToCenter -= L1CharAttr.CHARMINDIS / 4;
        }
        // 判断最后一条，从距离射程开始往反方向判断，直到距离大于当前位置，则设置为当前位置
        disToCenter = this.rawAttr.range + L1CharAttr.CHARMINDIS / 4;
        let maxDis = this.disFrom(this.normalAttakTarget);
        while (disToCenter < maxDis) {
            [x, y] = this.getLinePosByRad([targetX, targetY], targetRad, disToCenter);
            if (this.isPosLegal(x, y)) return [x, y];
            disToCenter += L1CharAttr.CHARMINDIS / 4;
        }
        // 找不到合法点，返回自己的点
        return [this.x, this.y];
    }

    /**
     * 获取以center为中心，rad向外的射线，radius距离的点的位置
     * @param center 
     * @param rad 与竖直向上的线的夹角
     * @param radius 
     */
    private getLinePosByRad(center: [number, number], rad: number, radius: number): [number, number] {
        let x = center[0] + radius * Math.sin(rad);
        let y = center[1] + radius * Math.cos(rad);
        return [x, y];
    }

    /**
     * 位置是否合法
     * 1.是否在屏幕外
     * 2.是否与任何角色距离小于最小角色间距离
     * @param x 
     * @param y 
     */
    private isPosLegal(x: number, y: number): boolean {
        // 如果在屏幕外
        let minX = L1CharAttr.CHARMINDIS / 2;
        let minY = L1CharAttr.CHARMINDIS / 2;
        let maxX = GameRoot.GameStage.stageWidth - L1CharAttr.CHARMINDIS / 2;
        let maxY = GameRoot.GameStage.stageHeight - L1CharAttr.CHARMINDIS / 2;
        if (x < minX || y < minY || x > maxX || y > maxY) return false;

        // 如果与与其他任意角色距离小于最小角色间距离，且与其他人的目标位置小于最小角色距离
        for (let chars of [this.oppos, this.coops]) {
            for (let char of chars) {
                if (char.alive && char != this &&
                    Util.pointDistance([x, y], [char.x, char.y]) < L1CharAttr.CHARMINDIS &&
                    Util.pointDistance([x, y], char._destPos) < L1CharAttr.CHARMINDIS) {
                    return false;
                }
            }

        }

        // 否则是个合规的点
        return true;
    }

    public addToScene() {
        LayerManager.Ins.gameLayer.addChild(this._charPort);
    }

    public removeFromScene() {
        LayerManager.Ins.gameLayer.removeChild(this._charPort);
    }

    public endSkillCast() {
        egret.Tween.removeTweens(this._charPort.contentGroup);
    }

    public get DODGE(): number {
        return Math.min(L1CharAttr.MAXDODGEP, this.dodgePoint);
    }

    public isDizz(): boolean {
        return L1BuffStatus.DIZZ in this.buffStatus;
    }

    public isSlient(): boolean {
        return L1BuffStatus.SLIENT in this.buffStatus;
    }

    public refreshBuffAttr() {
        // 计算生效buff
        let attrBuffTemp: L1Buff[] = [];
        for (let buff of this.buffs.data) {
            let isAffect = buff.config.isAffect(this, buff.caster);
            if (buff.config.buffType == L1BuffType.ATTRCHANGE && isAffect) {
                attrBuffTemp.push(buff);
            }
        }

        // 统计增益比例及数值
        let attrAdd: { [key: string]: number } = {}
        let attrRatio: { [key: string]: number } = {}
        for (let attrName of L1CharAttr.ATTRNAMES) {
            attrAdd[attrName] = 0;
            attrRatio[attrName] = 0;
        }
        for (let buff of attrBuffTemp) {
            for (let attrName of L1CharAttr.ATTRNAMES) {
                if (attrName in buff.config.attrAddAbs) {
                    attrAdd[attrName] += buff.config.attrAddAbs[attrName];
                }
                if (attrName in buff.config.attrAddRatio) {
                    attrRatio[attrName] += buff.config.attrAddRatio[attrName];
                }
            }
        }

        // 计算增益后属性
        this.atk = this.rawAttr.atk * (1 + attrRatio[L1ATTRNAME.ATK]) + attrAdd[L1ATTRNAME.ATK];
        this.def = this.rawAttr.def * (1 + attrRatio[L1ATTRNAME.DEF]) + attrAdd[L1ATTRNAME.DEF];
        this.critPoint = this.rawAttr.critPoint * (1 + attrRatio[L1ATTRNAME.CRITP]) + attrAdd[L1ATTRNAME.CRITP];
        this.dodgePoint = this.rawAttr.dodgePoint * (1 + attrRatio[L1ATTRNAME.DODGEP]) + attrAdd[L1ATTRNAME.DODGEP];
        let maxHp = this.rawAttr.maxHp * (1 + attrRatio[L1ATTRNAME.MAXHP]) + attrAdd[L1ATTRNAME.MAXHP];
        if (maxHp > this.maxHp) {
            let addHp = maxHp - this.maxHp;
            this.curHp += addHp;
            this.maxHp = maxHp;
        }
        this.critTime = this.rawAttr.critTime * (1 + attrRatio[L1ATTRNAME.CRITT]) + attrAdd[L1ATTRNAME.CRITT];
    }

    public refreshBuffStatus() {
        // 计算状态
        this.buffStatus.removeAll();
        let statusTemp: L1BuffStatus[] = [];
        for (let buff of this.buffs.data) {
            let isAffect = buff.config.isAffect(this, buff.caster);
            if (buff.config.buffType == L1BuffType.STATUS && isAffect) {
                statusTemp.push(buff.config.status);
            }
        }
        for (let status of statusTemp) {
            this.buffStatus.add(status);
        }

        // 跟新状态表示
        if (this.isDizz()) {
            this._charPort.toDizz();
        } else {
            this._charPort.outDizz();
        }

        if (this.isSlient()) {
            this._charPort.toSlient();
        } else {
            this._charPort.outSlient();
        }
    }

}


