class L2BuffCfg{

    private params: {[key:string]: any};

    /**
     * 每次到角色行动后duration-1，目前游戏中只采用这一种类型的计数
     */
    public get duration(): number{return this.params["duration"]};
    public get name(): string {return this.params["name"]};
    public get buffType(): L2BuffType {return this.params["buffType"]};
    public get attrNumAdd(): number[] {return this.params["attrNumAdd"]};
    public get attrPercAdd(): number[] {return this.params["attrPercAdd"]};
    public get triggerSkill(): L2SkillCfg {return this.params["triggerSkill"]};
    public get skillTriggerTime(): L2TriggerTimeType {return this.params["skillTriggerTime"]};
    public get skillTriggerDudgeFunc(): (buff: L2Buff)=>boolean {return this.params["skillTriggerDudgeFunc"]};
    public get triggerFunc(): (buff:L2Buff)=>void {return this.params["triggerFunc"]};
    public get funcTriggerType(): L2TriggerTimeType {return this.params["funcTriggerType"]};
    public get funcTriggerDudgeFunc(): (buff: L2Buff)=>boolean {return this.params["funcTriggerDudgeFunc"]};
    public get status(): L2BuffStatus {return this.params["status"]};
    public get isShowInPanel(): boolean {return this.params["isShowInPanel"]};

    public constructor(params: {[key:string]: any}){
        this.params = params;
    }
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
    Normal,
    Dizz,
    Slient,
}