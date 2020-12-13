const L1SKCFGS: { [key: string]: L1SkillConfig } = {
    // 模版
    "TEMPLATE": new L1SkillConfig(
        "",
        1000,
        { 0: () => { } },
        (skill: L1Skill) => { return null }
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

        }
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
            },
            225: () => { }
        },
        (skill: L1Skill) => {
            return [skill.caster.normalAttakTarget];

        }
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
                L1Harm.harm(skill.caster, skill.targets, L1HARMCFGS.HEAL01)
            }
        },
        (skill: L1Skill) => {
            return [skill.caster];
        }
    ),

    // 测试治疗技能
    "TEST01": new L1SkillConfig(
        "测试大招",
        40000,
        {
            0: (skill: L1Skill) => { // 第0ms开始执行
                skill.caster.startAnim([[0, 0], [0, 20], [0, -20], [0, 0], [-20, 0], [20, 0], [0, 0]], 
                    [75, 150, 75, 75, 150, 75]);
            },
            150: (skill: L1Skill) => { // 第75ms执行
                L1Harm.harm(skill.caster, skill.targets, L1HARMCFGS.HEAL01)
            },
            5000 : ()=>{}
        },
        (skill: L1Skill) => {
            return [skill.caster];
        }
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
        }
    ),

}


