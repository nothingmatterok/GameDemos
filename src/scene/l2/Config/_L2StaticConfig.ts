class L2Config {
    public static SkillCfg: { [key: number]: L2SkillCfg } = {
        0: new L2SkillCfg({
            "name": "普通攻击",
            "castFunc": (caster: L2Char, tw: egret.Tween) => {
                let scene = SceneManager.Ins.curScene as L2MainScene;
                let target: L2Char = caster.target;
                tw.to({
                    x: target.x, y: target.y, scaleX: 1.5, scaleY: 1.5
                }, 250).call(() => {
                    if (DEBUG) {
                        console.log(`${caster.debugNAndP()} atk ${target.debugNAndP()}`);
                    }
                    L2SkillManager.harm(caster, target);
                }).to({
                    x: caster.Cell.x, y: caster.Cell.y, scaleX: 1, scaleY: 1
                }, 250
                );
            },
            "isNormalAtk": true,
        }),
        1: new L2SkillCfg({
            "name": "测试技能-1",
            "description": "选择最近的友方单位增加20%的攻击力",
            "castFunc": (caster: L2Char, tw: egret.Tween) => {
                
            },
            "coolDown": 3,
            "energyUse": 2,
            "timeBack": 30,
            "castRange": 0,
            "effectRange": 1,
        }),

        5: new L2SkillCfg({
            // buff调用的被动技能
            "name": "buff调用技能5",
            "castFunc": (caster: L2Char, tw: egret.Tween) => {
                caster.hpChange(200);
            },

        }),

    };

    public static BuffCfg: { [key: number]: L2BuffCfg } = {
        0: new L2BuffCfg({
            "duration": 2,
            "name": "测试BUFF",
            "buffType": L2BuffType.Passive,
            "triggerSkillCfgId": 5,
            "skillTriggerTime": L2TriggerTimeType.BeforeAction,
            "skillTriggerDudgeFunc": (buff: L2Buff): boolean => {
                if ((SceneManager.Ins.curScene as L2MainScene).timeManager.curChar == buff.target) {
                    return true;
                }
                return false;
            }
        }),

        1: new L2BuffCfg({
            "duration": 2,
            
        }),
    };

    public static CharCfg: { [key: number]: L2CharCfg } = {
        0: new L2CharCfg({
            "name": "测试角色",
            "imgName": "7_portrait_png",
            "atk": 100,
            "def": 20,
            "maxHp": 1000,
            "startTime": 50,
            "actionSpeed": 0,
            "moveRange": 5,
            "atkRange": 2,
            "normalAtkSkillId": 0,
            "skill1Id": 1,
            "skill2Id": 1,
        }),
    }
}