const L1SKCFGS: { [key: string]: L1SkillConfig } = {
    // 模版
    "TEMPLATE": new L1SkillConfig(
        "",
        1000,
        { 0: () => { } },
        (skill: L1Skill) => { return null },
        "模版"
    ),
    // 近距离普通攻击
    "NROMATK": new L1SkillConfig(
        "",
        1000,
        {
            0: (skill: L1Skill) => { // 开始播放攻击动画
                skill.caster.startAnim([[0, 0], [10, 0], [-5, 0], [0, 0]], [75, 100, 50]);
                skill.caster.addAngerNumber(15);
            },
            75: (skill: L1Skill) => {
                L1Harm.harm(skill.caster, skill.targets);
            },
            225: () => { },

        },
        (skill: L1Skill) => {
            return [skill.caster.normalAttakTarget];
        },
        "普通攻击"
    ),
    // 远距离普通攻击 
    "NORMRANGATK": new L1SkillConfig(
        "",
        1000,
        {
            0: (skill: L1Skill) => { // 开始播放攻击动画
                skill.caster.startAnim([[0, 0], [10, 0], [-5, 0], [0, 0]], [75, 100, 50]);
                skill.caster.addAngerNumber(15);
                skill.newCreation(
                    L1CRTNCFGS.NORMBULLET01, skill.caster,
                    skill.targets[0], skill.caster.pos, skill.targets[0].pos
                );
                skill.newBuff(L1BUFFCFGS["BUFF01"], skill.caster, skill.caster);
            },
            225: () => { }
        },
        (skill: L1Skill) => {
            return [skill.caster.normalAttakTarget];

        },
        "远程普通攻击"
    ),

    // 测试治疗技能
    "HEALSKILL": new L1SkillConfig(
        "风灵颂",
        10000,
        {
            0: (skill: L1Skill) => { // 第0ms开始执行
                skill.caster.startAnim([[0, 0], [0, 10], [0, -10], [0, 0]], [75, 150, 75]);
            },
            150: (skill: L1Skill) => { // 第75ms执行
                L1Harm.harm(skill.caster, skill.targets, L1HARMCFGS.HEAL01);
                skill.newBuff(L1BUFFCFGS["BUFF01"], skill.caster, skill.caster);
            }
        },
        (skill: L1Skill) => {
            return [skill.caster];
        },
        "这是一个治疗技能，回复自身最大血量的20%，但在随后的10s内每s失去10血量"
    ),

    // 测试治疗技能
    "TEST01": new L1SkillConfig(
        "测试大招",
        40000,
        {
            0: (skill: L1Skill) => {
                skill.caster.startAnim([[0, 0], [0, 20], [0, -20], [0, 0], [-20, 0], [20, 0], [0, 0]], 
                    [75, 150, 75, 75, 150, 75]);
            },
            150: (skill: L1Skill) => {
                L1Harm.harm(skill.caster, skill.targets, L1HARMCFGS.HEAL01)
            },
            600: (skill: L1Skill)=>{
                skill.caster.startAnim([[0, 0], [0, 20], [0, 0]], 
                    [2000, 2000]);
            },
            5000 : (skill: L1Skill)=>{}
        },
        (skill: L1Skill) => {
            return [skill.caster];
        },
        "这是一个特别沙雕的技能，首先让角色进入癫痫，然后给自己治疗20%血量，之后像喝醉了一样，进入5s的贤者时间"
    ),

    // 测试治疗技能
    "TEST02": new L1SkillConfig(
        "测试小技能",
        20000,
        {
            0: (skill: L1Skill) => { // 第0ms开始执行
                skill.caster.startAnim([[0, 0], [0, 10], [0, -10], [0, 0]], [75, 150, 75]);
            },
            150: (skill: L1Skill) => { // 第75ms执行
                
            }
        },
        (skill: L1Skill) => {
            return [skill.caster];
        },
        "这是一个无法描述的技能，因为他没有任何效果，只会让你的英雄傻站着不动"
    ),

}


