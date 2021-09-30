class L2SkillCfg {
    public constructor(private params: { [key: string]: any }) {}

    public get effectRange(): number { return this.params["effectRange"] };
    public get castRange(): number { return this.params["castRange"] };
    public get name(): string { return this.params["name"] };
    public castFunc(caster: L2Char, tw: egret.Tween, params:{[key:string]:any}){this.params["castFunc"](caster, tw, this, params); };
    public get isNormalAtk(): boolean { return this.params["isNormalAtk"] };
    public get description(): string { return this.params["description"] };
    public get coolDown(): number {return this.params["coolDown"] };
    public get energyUse(): number {return this.params["energyUse"] };
    public get timeBack(): number {return this.params["timeBack"] };
    public get targetSelectType(): number {return this.params["targetSelectType"] };
    private get canCastDudgeFunc(): (caster: L2Char, skillCfg: L2SkillCfg)=>[boolean, string] {return this.params["canCastDudgeFunc"]};
    public canCast(caster: L2Char):[boolean, string]{
        if (!caster.alive) {
            if (DEBUG) {console.log(`${caster.debugNAndP} 准备释放${this.name} 时死亡`)}
            return [false, "释放者已死亡"];
        }
        return this.canCastDudgeFunc ? this.canCastDudgeFunc(caster, this) : [true, null];
    }
}

enum L2SkTgtSeltType{
    Cell,
    AlliesCharWithSelf,
    AlliesCharWithoutSelf,
    Auto,
    OpposeChar,
}

