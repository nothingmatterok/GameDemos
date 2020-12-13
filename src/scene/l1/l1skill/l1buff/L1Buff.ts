class L1Buff{
    public config: L1BuffConfig;

    // 运行时状态
    private _periodFrame: number;
    private _durationFrame: number;
    private _condPeriodFrame: number;
    private _target : L1Char;
    public caster: L1Char;

    public constructor(){}

    public initial(config: L1BuffConfig, target: L1Char, caster: L1Char){
        this.config = config;
        let frameMs = GameRoot.GameStage.frameRate / 1000; // 每毫秒多少帧
        this._periodFrame = Math.ceil(this.config.period * frameMs);
        this._durationFrame = Math.ceil(this.config.duration * frameMs);
        this._condPeriodFrame = Math.ceil(this.config.condCd * frameMs);
        this._preCondAffectFrame = -this._condPeriodFrame;
        this.addToTarget(target);
        this._activateFrame = 0;
        this.caster = caster;
    }

    private addToTarget(target: L1Char){
        this._target = target;
        target.buffs.add(this);
        if (this.config.buffType == L1BuffType.STATUS){
            target.refreshBuffStatus();
        }
        if(this.config.buffType == L1BuffType.ATTRCHANGE){
            target.refreshBuffAttr();
        }
        // 飘字
        this.showBuffName();
    }

    private showBuffName(){
        if(this.config.name == "") return;//普攻或者一些不需要展示的，直接不用管
        let color = ColorDef.GhostWhite;
        let size = 25;
        ToastInfoManager.newToast(
            this.config.name, color,
            this._target.y - 60, this._target.x - GameRoot.GameStage.stageWidth / 2,
            -50, 0, 2500, size, false, egret.Ease.quadOut
        );
    }

    public removeFromTarget(){
        let target = this._target;
        target.buffs.remove(this);
        if (this.config.buffType == L1BuffType.STATUS){
            target.refreshBuffStatus();
        }
        if(this.config.buffType == L1BuffType.ATTRCHANGE){
            target.refreshBuffAttr();
        } 
    }

    private _activateFrame: number = 0;
    private _preCondAffectFrame: number;
    public update(){
        // 循环作用类型
        if(
            this.config.buffType == L1BuffType.AFFECTPERIOD && 
            this._activateFrame % this._periodFrame == 0 && 
            this.config.isAffect(this._target, this.caster)
        ){
            this.config.affectFunc(this._target, this.caster);
        }
        // 条件作用类型
        if(
            this.config.buffType == L1BuffType.AFFECTCOND && 
            this._activateFrame - this._preCondAffectFrame >= this._condPeriodFrame &&
            this.config.isAffect(this._target, this.caster)
        ){
            this.config.affectFunc(this._target, this.caster);
            this._preCondAffectFrame = this._activateFrame;
        }

        this._activateFrame += 1;
    }

    public isLifeEnd(){
        if (this._durationFrame == 0) return false; // 如果是无限持续，返回false
        return this._activateFrame > this._durationFrame;
    }

}