class L2BuffCfg{
    /**
     * 每次到角色行动后duration-1，目前游戏中只采用这一种类型的计数
     */
    public duration: number;
    public name: string;
    public buffType: L2BuffType;
    public attrNumAdd: number[];
    public attrPercAdd: number[];
    public triggerSkill: L2Skill;
    public triggerSkillType: L2TriggerType;
    public triggerSkillParams: any[];
    public triggerFunc: L2Skill;
    public triggerFuncType: L2TriggerType;
    public triggerFuncParams: any[];
    public status:L2BuffStatus;
    public isShowInPanel: boolean;
}

enum L2TriggerType{
    HpLowerThan,
    HpHigherThan,
    
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