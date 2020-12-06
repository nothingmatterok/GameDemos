class L1Buff{
    public config: L1BuffConfig;

    // 运行时状态
    private _periodFrame: number;
    private _durationFrame: number;
    private _target : L1Char;
    public caster: L1Char;

    public constructor(){}

    public initial(config: L1BuffConfig, target: L1Char, caster: L1Char){
        this.config = config;
        let frameMs = GameRoot.GameStage.frameRate / 1000; // 每毫秒多少帧
        this._periodFrame = this.config.period * frameMs;
        this._durationFrame = this.config.duration * frameMs;
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
    public update(){
        if(
            this.config.buffType == L1BuffType.AFFECT && 
            this._activateFrame % this._periodFrame == 0 && 
            this.config.isAffect(this._target, this.caster)
        ){
            this.config.affectFunc(this._target, this.caster);
        }
        this._activateFrame += 1;
    }

    public isLifeEnd(){
        return this._activateFrame > this._durationFrame;
    }

}