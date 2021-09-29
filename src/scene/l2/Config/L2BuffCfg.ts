class L2BuffCfg{
    public constructor(private params: {[key:string]: any}){}

    public get duration(): number{return this.params["duration"]};
    public get name(): string {return this.params["name"]};
    public get buffType(): L2BuffType {return this.params["buffType"]};
    public get attrNumAdd(): number[] {return this.params["attrNumAdd"]};
    public get attrPercAdd(): number[] {return this.params["attrPercAdd"]};
    public get enableDudgeFunc(): (buff: L2Buff)=>boolean {return this.params["isEnableDudgeFunc"]};
    public get skillTriggerTime(): L2TriggerTimeType {return this.params["skillTriggerTime"]};
    public get skillTriggerDudgeFunc(): (buff: L2Buff, triggerMsg: any[])=>boolean {return this.params["skillTriggerDudgeFunc"]};
    public get triggerSkillCfgId(): number {return this.params["triggerSkillCfgId"]};
    public get status(): L2BuffStatus {return this.params["status"]};
    public get isShowInPanel(): boolean {return this.params["isShowInPanel"]};
    public get isDebuff(): boolean{return this.params["isDebuff"]};
    public get description(): string{return this.params["description"]};
}

enum L2TriggerTimeType{
    HpChange,
    BuffAdd,
    BuffRemove,
    AfterNormalAttak,
    BeforeNormalAttak,
    AfterAction,
    BeforeAction
}

enum L2BuffType{
    /** 
     * 监听特定情况，触发一个技能 或 一个函数，
     * 函数类在trigger时即时生效，技能类会加入技能列表，顺序执行
     */
    Passive, 
    AttrChange,
    Status
}

enum L2BuffStatus{
    Dizz,
    Slient,
}