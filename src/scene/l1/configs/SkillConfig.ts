
function GetCHARCFGS():{[key:number]: L1CharConfig}{

var L1HARMCFGS: { [key: string]: L1HarmConfig } = {
    // 模版
    "TEMPLATE" : new L1HarmConfig(
        (caster: L1Char, target: L1Char) => {return [true, 0]}
    ), 
    // 测试治疗伤害
    "HEAL01" : new L1HarmConfig(
        (caster, target) => {
            let isCrit = L1Harm.isRandTrue(caster.critPoint);
            let healNum = caster.maxHp * 0.2; // 治疗最大血量的20%
            if (isCrit) healNum *= caster.critTime;
            return [isCrit, -healNum];
        }
    ),

}

let L1BUFFCFGS: { [key: string]: L1BuffConfig } = {
    "TEMPLATE": new L1BuffConfig(
        "TEMPLATE", "模版", 1000, 1000, L1BuffType.ATTRCHANGE, L1BuffStatus.NORMAL, "",
        {}, {},
        (target: L1Char, caster: L1Char) => { },
        (target: L1Char, caster: L1Char) => { return true }
    ),
    "BUFF01" : new L1BuffConfig(
        "BUFF01", "攻击+10", 3000, 1000, L1BuffType.ATTRCHANGE, L1BuffStatus.NORMAL,
        "攻击 +10", {"ATK": 10}
    ),
    "BUFF02" : new L1BuffConfig(
        "BUFF02", "每1s对自身造成10点伤害，持续10s",10000, 1000, L1BuffType.AFFECTPERIOD, L1BuffStatus.NORMAL,
        "持续掉血", null, null, (target: L1Char, caster: L1Char)=>{
            L1Harm.harm(caster, [target], new L1HarmConfig(()=>{return [false, 10]}))
            L1BuffManager.Ins.newBuff(L1BUFFCFGS.BUFF01, target, caster);
        }
    ),
}

let L1CRTNCFGS: { [key: string]: L1CreationConfig } = {
    "TEMPLATE": new L1CreationConfig(
        100, L1CrtnFlyType.FIX, L1CrTnAffectContType.ONECE,
        L1CrTnAffectTargetSetType.PRESET, L1CrtnAffectTargetCamp.OTHER,
        400, 1000, 200,
        (targets: L1Char[], caster: L1Char) => { },
        0.9, ColorDef.DarkOrange
    ),

    // 普攻远程子弹
    "NORMBULLET01" : new L1CreationConfig(
        5, L1CrtnFlyType.CHAR, L1CrTnAffectContType.ONECE,
        L1CrTnAffectTargetSetType.PRESET, L1CrtnAffectTargetCamp.OTHER,
        800, 1, 10, (targets: L1Char[], caster: L1Char) => {
            L1Harm.harm(caster, targets)
        }, 1, ColorDef.DarkOrange
    ),

}

let L1SKCFGS: { [key: string]: L1SkillConfig } = {
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

return  {
    1 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 100),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色1",
        "1_portrait_png"
    ),
    2 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 120, 10, 10, 1.2, 0),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NROMATK,
        [],
        "测试角色2",
        "2_portrait_png"
    ),
    3 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色3",
        "3_portrait_png"
    ),
    4 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色4",
        "4_portrait_png"
    ),
    5 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色5",
        "5_portrait_png"
    ),
    6 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色6",
        "6_portrait_png"
    ),
    7 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色7",
        "7_portrait_png"
    ),
    8 : new L1CharConfig(
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色8",
        "8_portrait_png"
    ),    
}
}
function GetL1LevelCFGS():{[key:number]:number[]}{
return {
    0 : [1,1],
    1 : [1, 1, 1],
    2 : [1, 1, 2, 2]
}
}

var L1CHARCFGS = GetCHARCFGS();
var L1LevelCFGS = GetL1LevelCFGS();