class L2SkillCfg{
    private params: {[key:string]: any};
    public get effectRange(): number {return this.params["effectRange"]};
    public get castRange(): number {return this.params["castRange"]};
    public get name(): string {return this.params["name"]};
    public get castFunc():(caster: L2Char, tw: egret.Tween)=> void { return this.params["castFunc"]};
    public constructor(params: {[key:string]: any}){
        this.params = params;
    }

    public static harm(caster:L2Char, target: L2Char, ratio: number=1){
        target.hpChange(-(caster.attr.atk - target.attr.def) * ratio);
    }
}

