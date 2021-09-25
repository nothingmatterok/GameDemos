class L2Buff{

    public config: L2BuffCfg;
    // 运行时状态
    public duration: number; // 持续回合，每次自己自动触发时进行一次结算
    public caster: L2Char;
    public target: L2Char;
    // 子Buff，当该Buff被移除时，需要同步移除所有的子Buff
    public children: L2Buff[];

    public initial(cfg: L2BuffCfg, caster: L2Char){
        this.config = cfg;
        this.caster = caster;
        this.duration = cfg.duration;
        this.children = [];
    }

    public attach2Char(char: L2Char){
        this.target = char;
        if(this.config.buffType == L2BuffType.AttrChange){
            char.refreshBuffAttr();
        }
    }

    /**
     * 给角色附加BUFF或BUFF生效的时候调用
     */
    public showBuffName(){
        if(this.config.name == "") return;//普攻或者一些不需要展示的，直接不用管
        let color = ColorDef.White;
        let size = 30;
        ToastInfoManager.newToast(
            this.config.name, color,
            this.target.y - 15, this.target.x - GameRoot.GameStage.stageWidth / 2 + this.target.width / 2,
            -50, 0, 2000, size, true, egret.Ease.quadOut
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
    }

    public release(){
        this.children = null;
        this.target = null;
        this.caster = null;
    }

}