class L1Char {
    private charPort: L1CharPortr;
    public name: string;
    public camp: L1Camp;
    public charId: number;
    public oppos: L1Char[];
    public coops: L1Char[];
    public get x(): number {
        return this.charPort.x;
    }
    public get y(): number {
        return this.charPort.y;
    }

    public set x(value: number) {
        this.charPort.x = value;
    }
    public set y(value: number) {
        this.charPort.y = value;
    }

    // TODO: 通过读取数据初始化角色属性
    public maxHp: number = 1000;
    public maxAnger: number = 100;
    public defend: number = 10;
    public atk: number = 300;
    public range: number = 100;
    public normalAtkRate: number = 60; // 60 / 攻击间隔(s)
    public skillCD: number = 1.4; // TODO: 等待技能系统实现
    public alive: boolean = true;
    public moveSpeed: number = 80; // 每s多少米


    // 运行时状态
    private _normalAttakTarget: L1Char;
    private _destPos: [number, number] = [0, 0];
    private _curHp: number = 1000;
    private _curAnger: number = 0;

    public set curHp(value: number) {
        if (value <= 0) {
            // TODO: 执行死亡
            this._curHp = 0;
            this.alive = false;
            this.charPort.drawHpCircle(0);
            this.x = 10000;
            this.y = 10000;
            this.removeFromScene();
        } else {
            this._curHp = value;
            this.charPort.drawHpCircle(value / this.maxHp);
        }
    }

    public get curHp(): number { return this._curHp; }

    constructor(camp: L1Camp, charId: number) {
        this.camp = camp;
        this.charId = charId;
        this.charPort = new L1CharPortr(camp, charId);
        // 临时生成到合适的位置
        this.x = GameRoot.GameStage.stageWidth * (1 / 2) + camp * 200;
        this.y = GameRoot.GameStage.stageHeight * (1 / 10) + (charId + charId % 2) * 60;

    }

    public initial(oppos: L1Char[], coops: L1Char[]) {
        this.oppos = oppos;
        this.coops = coops;

        //TODO:临时测试
        this.maxHp = 1000 + (this.charId % 3) * 1000;
        this.curHp = this.maxHp;
    }

    private frameAdd: number = 0;
    public update() {
        if (!this.alive) return;
        this.frameAdd += 1;
        // 如果目标不存在或死亡，找一个新的目标
        if (this._normalAttakTarget == null || (!this._normalAttakTarget.alive)) {
            this._normalAttakTarget = this.findNormalATKTarget(this.oppos);
            // console.log(`${this.charId}find new target${this._normalAttakTarget.charId}`);
        }
        // 找一个合适的位置
        let destPos = this.findATKLocation();
        // 取整数
        this._destPos = [Math.ceil(destPos[0]), Math.ceil(destPos[1])]
        // 如果位置没有变化，进入攻击状态
        if (this.isSamePos([this.x, this.y], this._destPos)) {
            // TODO:CD管理
            // CD到了&&有目标&&目标在范围内
            if (this.frameAdd >= 30 && this._normalAttakTarget != null && this.targetInRange()) {
                this.frameAdd = 0;
                this._normalAttakTarget.curHp -= this.atk;
                this.charPort.attakAnim();
                // console.log(`${this.charId} attak ${this.charId}`);
            }
        } else {
            // 如果位置变化了，进入移动状态（）
            this.movingTo(this._destPos);
            // console.log(`${this.charId} to ${this._destPos}`);
        }

    }

    private isSamePos(pos1: [number, number], pos2: [number, number], delta: number = 6): boolean {
        return (Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1])) <= delta;
    }

    private movingTo(desPos: [number, number]) {
        let rad = this.getRad([this.x, this.y], desPos);
        // 每帧多少s * 每秒多少米
        const frameTime = 1 / GameRoot.GameStage.frameRate;
        let frameSpeed = frameTime * this.moveSpeed;
        this.x = Math.ceil(this.x + frameSpeed * Math.sin(rad));
        this.y = Math.ceil(this.y + frameSpeed * Math.cos(rad));
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

    private disFromPos(other: [number, number]) {
        return Util.pointDistance([other[0], other[1]], [this.x, this.y]);
    }


    private targetInRange(): boolean {
        return Math.abs(this.disFrom(this._normalAttakTarget) - this.range) < 10;
    }

    /**
     * 寻找一个合适的普通攻击位置
     */
    private findATKLocation(): [number, number] {
        // 如果没有目标，或目标在射程范围内，且坐标合法,返回自己的坐标
        if ((this._normalAttakTarget == null || this.targetInRange()) && this.isPosLegal(this.x, this.y)) {
            return [this.x, this.y];
        }
        
        // 如果有目标，且攻击不到或当前位置不合法，找一个最恰当的位置（不会和其他冲撞）
        // 判定规则如下：
        // 1.从当前点和目标连一条直线，判断刚好等于射程的点是不是可以，如果合法就返回
        // 2.如果不可以，以射程为半径，画一个圆，每30度查看一个点是否可以，如果合法就返回
        // 3.如果没有就看射程往内（角色之间最小距离）范围区域是否可以，如果合法就返回
        // 4.如果没有就直接往连线的反方向外一点点判断，直到位置合法
        let targetX = this._normalAttakTarget.x;
        let targetY = this._normalAttakTarget.y;
        let x: number = 0;
        let y: number = 0;
        let targetRad = this.getRad([targetX, targetY], [this.x, this.y]);
        // 30度的弧度增量
        const rad30Add = 30 * angle2RadParam;
        // 判断第一条，距离刚好
        [x, y] = this.getLinePosByRad([targetX, targetY], targetRad, this.range);
        if (this.isPosLegal(x, y)) return [x, y];
        //判断第二条，以30度累加判断11次找合法点
        let targetRadAdd = targetRad;
        for (let i = 1; i < 12; i++) {
            targetRadAdd = targetRadAdd + rad30Add;
            [x, y] = this.getLinePosByRad([targetX, targetY], targetRadAdd, this.range);
            if (this.isPosLegal(x, y)) return [x, y];
        }
        // 判断第三条，向角色靠拢
        let disToCenter = this.range - L1CHARMINDIS / 4;
        while (disToCenter > L1CHARMINDIS) {
            [x, y] = this.getLinePosByRad([targetX, targetY], targetRad, disToCenter);
            if (this.isPosLegal(x, y)) return [x, y];
            disToCenter -= L1CHARMINDIS / 4;
        }
        // 判断最后一条，从距离射程开始往反方向判断，直到距离大于当前位置，则设置为当前位置
        disToCenter = this.range + L1CHARMINDIS / 4;
        let maxDis = this.disFrom(this._normalAttakTarget);
        while (disToCenter < maxDis) {
            [x, y] = this.getLinePosByRad([targetX, targetY], targetRad, disToCenter);
            if (this.isPosLegal(x, y)) return [x, y];
            disToCenter += L1CHARMINDIS / 4;
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
     * 返回center到end的射线与竖直向下线往逆时针方向的弧度值 
     * @param center 
     * @param end 
     */
    private getRad(center: [number, number], end: [number, number]): number {
        let longS = Util.pointDistance(center, end);
        let yDis = end[1] - center[1];
        let xDis = end[0] - center[0];
        let sinAngle = xDis / longS;
        let cosAngle = yDis / longS;
        let rad = Math.acos(yDis / longS)
        if (sinAngle > 0) return rad;
        // 如果sin小于0，说明acos要反向一下
        return -rad;
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
        let minX = L1CHARMINDIS / 2;
        let minY = L1CHARMINDIS / 2;
        let maxX = GameRoot.GameStage.stageWidth - L1CHARMINDIS / 2;
        let maxY = GameRoot.GameStage.stageHeight - L1CHARMINDIS / 2;
        if (x < minX || y < minY || x > maxX || y > maxY) return false;

        // 如果与与其他任意角色距离小于最小角色间距离
        for (let chars of [this.oppos, this.coops]) {
            for (let char of chars) {
                if (char.alive && char != this && Util.pointDistance([x, y], [char.x, char.y]) < L1CHARMINDIS) {
                    return false;
                }
            }

        }

        // 否则是个合规的点
        return true;
    }

    public addToScene() {
        LayerManager.Ins.gameLayer.addChild(this.charPort);
    }

    public removeFromScene() {
        LayerManager.Ins.gameLayer.removeChild(this.charPort);
    }

} 