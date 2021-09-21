class L2Buff{

    public config: L2BuffCfg;
    // 运行时状态
    public duration: number; // 持续回合，每次自己自动触发时进行一次结算
    public caster: L2Char;
    public target: L2Char;
    // 子Buff，当该Buff被移除时，需要同步移除所有的子Buff
    public children: L2Buff[];

    public initial(cfg: L2BuffCfg, target: L2Char, caster: L2Char){
        this.config = cfg;
        this.target = target;
        this.caster = caster;
        this.duration = cfg.duration;
        this.children = [];
        this.addToTarget(target);
    }

    public addToTarget(target: L2Char){
        if(this.config.buffType == L2BuffType.AttrChange){
            target.refreshBuffAttr();
        }
    }

    private showBuffName(){
        if(this.config.name == "") return;//普攻或者一些不需要展示的，直接不用管
        let color = ColorDef.GhostWhite;
        let size = 25;
        ToastInfoManager.newToast(
            this.config.name, color,
            this.target.y - 60, this.target.x - GameRoot.GameStage.stageWidth / 2,
            -50, 0, 2500, size, false, egret.Ease.quadOut
        );
    }

    public removeFromTarget(){
        let target = this.target;
        target.buffs.remove(this);
        for(let buff of this.children){
            buff.removeFromTarget();
        }
        if (this.config.buffType == L2BuffType.Status){
            target.refreshBuffStatus();
        }
        if(this.config.buffType == L2BuffType.AttrChange){
            target.refreshBuffAttr();
        }
        if(this.config.buffType == L2BuffType.Passive){
            // TODO:针对被动类型，需要移除事件监听
        }
    }

    public updateDuration(){
        if(this.duration > 0){
            this.duration -= 1;
        }
        if (this.duration == 0){
            this.removeFromTarget();
        }
    }

    public release(){
        this.children = null;
        this.target = null;
        this.caster = null;
    }

}