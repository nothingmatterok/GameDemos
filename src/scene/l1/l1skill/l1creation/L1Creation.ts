class L1Creation {

    private _config: L1CreationConfig;

    // 组件
    private _contentGroup: eui.Group;
    private _circleShape: egret.Shape;

    // 运行时状态
    private _activateFrame: number; // 活跃了多少帧
    private _lifeDurationFrame: number; // 生命时间持续多少帧
    private _affectPeriodFrame: number;
    private _flySpeedFrame: number;

    private _caster: L1Char; // 归属单位
    private _directRad: number; // 飞行方向,与竖直向下的射线向右侧旋转的角度
    private _posDest: [number, number]; // 飞行目的地
    private _targetChar: L1Char; // 飞行动态目标

    public get x(): number {
        return this._contentGroup.x;
    }

    public get y(): number {
        return this._contentGroup.y;
    }


    public get pos(): [number, number] {
        return [this.x, this.y];
    }

    public set pos(v: [number, number]) {
        [this.x, this.y] = v;
    }

    public set x(v: number) {
        this._contentGroup.x = v;
    }

    public set y(v: number) {
        this._contentGroup.y = v;
    }

    public constructor() {
        this._contentGroup = new eui.Group();
        this._circleShape = new egret.Shape();
        this._contentGroup.addChild(this._circleShape);
    }

    public initial(
        config: L1CreationConfig, caster: L1Char,
        targetChar: L1Char = null, startPos: [number, number],
        posDest: [number, number] = null, directRad: number = null,
    ) {
        GameRoot.GameStage.addChild(this._contentGroup);
        this._caster = caster;
        this._config = config;
        this._targetChar = targetChar;
        this._posDest = posDest;
        this._directRad = directRad;
        // 初始化时间（ms -> frame)
        let frameMs = GameRoot.GameStage.frameRate / 1000; // 每毫秒多少帧
        this._lifeDurationFrame = Math.ceil(this._config.lifeTime * frameMs);
        this._affectPeriodFrame = Math.ceil(this._config.affectPeriod * frameMs);
        this._flySpeedFrame = this._config.flySpeed * frameMs;
        this._activateFrame = 0;
        this._toDestFrame = Number.MAX_VALUE;
        // 创造实体
        Util.drawAngleCircle(this._circleShape, 360, this._config.radius, 0, this._config.color, this._config.alpha);
        this._circleShape.x = this._circleShape.y = 0;
        // 定义默认位置
        [this.x, this.y] = startPos;

        // 定义飞行状态
        this._isFly = true;
        this._isAffected = false;
        if (this._config.flyType == L1CrtnFlyType.FIX) this._isFly = false;
    }

    private _isFly: boolean = true;
    private _isAffected: boolean = false;
    public update() {
        // 飞行
        if (this._isFly) {
            if (this._config.flyType == L1CrtnFlyType.CHAR) {
                this.flyTo(this._targetChar.pos);
            }
            if (this._config.flyType == L1CrtnFlyType.POSITION) {
                this.flyTo(this._posDest);
            }
            if (this._config.flyType == L1CrtnFlyType.DIRECT) {
                this.flyToRad(this._directRad);
            }
        }

        // 作用
        let isAffect = false; // 是否在这一帧发起作用
        if (this._config.affectContType == L1CrTnAffectContType.CONTINUE) {
            if (this._activateFrame % this._affectPeriodFrame == 0) {
                // 如果作用类型为持续作用，且刚好这一帧为间隔时间的倍数
                isAffect = true;
            }
        }

        if (this._config.affectContType == L1CrTnAffectContType.ONECE) {
            if (!this._isFly && (this._isAffected == false)) {
                // 如果作用类型为单次作用，且从来没有作用过，且停止了飞行
                isAffect = true;
            }
        }

        if (isAffect) {
            let targets = this.findAffectTarget();
            this._config.affectFunc(targets, this._caster);
            this._isAffected = true;
        }

        // 判定时间开始作用
        this._activateFrame += 1;
    }

    public findAffectTarget(): L1Char[] {
        let targets: L1Char[] = [];
        if (this._config.affectTargetSetType == L1CrTnAffectTargetSetType.PRESET) {
            targets.push(this._targetChar);
        } else if (this._config.affectTargetSetType == L1CrTnAffectTargetSetType.RANGE) {
            let charsSelect = this._caster.oppos;
            if (this._config.affectTargetCamp == L1CrtnAffectTargetCamp.SELF) {
                charsSelect = this._caster.coops;
            }
            for (let char of charsSelect) {
                if (Util.pointDistance(char.pos, this.pos) < this._config.radius) {
                    targets.push(char);
                }
            }
        }
        return targets;
    }

    private flyTo(dest: [number, number]) {
        if (this.closeTo(this.pos, dest)) {
            this.pos = dest;
            this._isFly = false;
            this._toDestFrame = this._activateFrame;
            return;
        }
        let rad = Util.getRad(this.pos, dest);
        this.flyToRad(rad);
    }

    private closeTo(pos1: [number, number], pos2: [number, number]) {
        return Util.pointDistance(pos1, pos2) < this._flySpeedFrame + 20;
    }

    /**
     * 
     * @param rad 竖直向下线往逆时针方向的弧度值
     */
    private flyToRad(rad: number) {
        this.x = Math.ceil(this.x + this._flySpeedFrame * Math.sin(rad));
        this.y = Math.ceil(this.y + this._flySpeedFrame * Math.cos(rad));
    }

    public lifeEnd() {
        GameRoot.GameStage.removeChild(this._contentGroup);
        this._config = null;
    }

    private _toDestFrame: number = Number.MAX_VALUE; // 到达目标的帧数，只有需要飞行到目标才需要设置
    public isLifeEnd() {
        let toDestFrame = this._toDestFrame;
        if (
            this._config.flyType == L1CrtnFlyType.FIX ||
            this._config.flyType == L1CrtnFlyType.DIRECT
        ) {
            toDestFrame = 0;
        }
        return this._activateFrame > this._lifeDurationFrame + toDestFrame + 1; // 1帧缓冲
    }
}