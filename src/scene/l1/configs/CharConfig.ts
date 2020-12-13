/// <reference path="SkillConfig.ts" />
const CHARCFGS:{[key:number]:[
    L1CharAttr, 
    Array<L1SkillConfig>,  // 普攻外的技能列表
    L1SkillConfig, // 普攻技能
    Array<L1BuffConfig>, // 被动技能（天赋） 无限时长 不可被驱散
    string, // 名字
    string // 头像资源名 
]} = {
    1 : [
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 100),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色1",
        "1_portrait_png"
    ],
    2 : [
        new L1CharAttr(1000, 200, 200, 120, 10, 10, 1.2, 0),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NROMATK,
        [],
        "测试角色2",
        "2_portrait_png"
    ],
    3 : [
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色3",
        "3_portrait_png"
    ],
    4 : [
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色4",
        "4_portrait_png"
    ],
    5 : [
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色5",
        "5_portrait_png"
    ],
    6 : [
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色6",
        "6_portrait_png"
    ],
    7 : [
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色7",
        "7_portrait_png"
    ],
    8 : [
        new L1CharAttr(1000, 200, 200, 400, 10, 10, 1.2, 200),
        [L1SKCFGS.HEALSKILL, L1SKCFGS.TEST01, L1SKCFGS.TEST02],
        L1SKCFGS.NORMRANGATK,
        [],
        "测试角色8",
        "8_portrait_png"
    ],    
}