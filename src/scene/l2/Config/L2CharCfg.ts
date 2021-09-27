class L2CharCfg{
    public constructor(private params: {[key:string]: any}){}

    public get name(): string {return this.params["name"]};
    public get imgName(): string {return this.params["imgName"]};

    // 属性
    public get atk(): number {return this.params["atk"]};
    public get normalAtkSkillId(): number {return this.params["normalAtkSkillId"]};
    public get def(): number {return this.params["def"]};
    public get maxHp(): number {return this.params["maxHp"]};
    public get startTime(): number {return this.params["startTime"]};
    public get actionSpeed(): number {return this.params["actionSpeed"]};
    public get moveRange(): number {return this.params["moveRange"]};
    public get atkRange(): number {return this.params["atkRange"]};
    public get harmIncrease(): number {return this.params["harmIncrease"]};
    public get harmDecrease(): number {return this.params["harmDecrease"]};
    public get injureIncrease(): number {return this.params["injureIncrease"]};
    public get injureDecrease(): number {return this.params["injureDecrease"]};
    public get skillIds(): number[] {return this.params["skillIds"]}
}