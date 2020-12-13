class L1CharConfig{
    public constructor(
        public attr : L1CharAttr, // 属性
        public skills: Array<L1SkillConfig>,  // 普攻外的技能列表
        public normalSkill: L1SkillConfig, // 普攻技能
        public passiveSkills: Array<L1BuffConfig>, // 被动技能（天赋） 无限时长 不可被驱散
        public name: string, // 名字
        public portImageName: string // 头像资源名 
    ){}
}