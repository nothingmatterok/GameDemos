class L2SkillCfg {
    public constructor(private params: { [key: string]: any }) {}

    public get effectRange(): number { return this.params["effectRange"] };
    public get castRange(): number { return this.params["castRange"] };
    public get name(): string { return this.params["name"] };
    public get castFunc(): (caster: L2Char, tw: egret.Tween) => void { return this.params["castFunc"] };
    public get isNormalAtk(): boolean { return this.params["isNormalAtk"] };
    public get description(): string { return this.params["description"] };
    public get coolDown(): number {return this.params["coolDown"] };
    
    public get energyUse(): number {return this.params["energyUse"] };
    public get timeBack(): number {return this.params["timeBack"] };
}

