class L2Config {
    public static SkillCfg: { [key: number]: L2SkillCfg } = {
        0: new L2SkillCfg({
            "name": "普通攻击",
            "castFunc": (caster: L2Char, tw: egret.Tween, cfg: L2SkillCfg, params:{[key:string]:any}) => {
                let target: L2Char = caster.targets[0];
                tw.to({
                    x: target.x, y: target.y, scaleX: 1.5, scaleY: 1.5
                }, 250).call(() => {
                    if (DEBUG) {
                        console.log(`${caster.debugNAndP()} 普通攻击 ${target.debugNAndP()}`);
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
            "description": "对距离5以内最近的友方单位增加100的生命",
            "castFunc": (caster: L2Char, tw: egret.Tween, skillCfg: L2SkillCfg) => {
                let target = caster.findMinDisAllies(skillCfg.castRange);
                target.hpChange(100);
            },
            "canCastDudgeFunc": (caster: L2Char, skillCfg: L2SkillCfg) => {
                let canCast: boolean = true;
                let target = caster.findMinDisAllies(skillCfg.castRange);
                let cantInfo: string = null;
                if (target == null) {
                    canCast = false;
                    cantInfo = "找不到合适的目标"
                }
                return [canCast, cantInfo];
            },
            "coolDown": 3,
            "energyUse": 2,
            "timeBack": 30,
            "castRange": 5,
            "targetSelectType": L2SkTgtSeltType.Auto,
        }),

        3: new L2SkillCfg({
            "name": "一个用来测试可以主动选择目标的技能",
            "description": "选择一个范围5以内的敌方单位，给予一个每回合100伤害的Buff，持续两回合 测试占位。。。。。。。。。",
            "castFunc": (caster: L2Char, tw: egret.Tween, skillCfg: L2SkillCfg, params:{[key:string]:any}) => {
                let target = params["targetChar"];
                let rawX = caster.x;
                tw.to({ x: rawX + 10 }, 100).to({ x: rawX - 10 }, 200).to({ x: rawX }, 100);
                egret.Tween.get(target).to({ alpha: 0.5 }, 100).to({ alpha: 1 }, 100);
                let scene = SceneManager.Ins.curScene as L2MainScene;
                let buff = scene.buffManager.newBuff(L2Config.BuffCfg[1], caster);
                scene.buffManager.attachBuff2Char(buff, target);
            },
            "castRange": 5,
            "targetSelectType" : L2SkTgtSeltType.OpposeChar,
            "effectRange": 0,
        }),

        5: new L2SkillCfg({
            // buff调用的被动技能，给自己加200生命
            "name": "buff调用技能5",
            "castFunc": (caster: L2Char, tw: egret.Tween) => {
                caster.hpChange(200);
                let rawX = caster.x;
                tw.to({ x: rawX + 10 }, 100).to({ x: rawX - 10 }, 200).to({ x: rawX }, 100);
            },

        }),

        6: new L2SkillCfg({
            // buff调用的被动技能，给目标（自己）造成100点伤害
            "name": "buff调用技能6",
            "castFunc": (caster: L2Char, tw: egret.Tween) => {
                let rawX = caster.x;
                tw.to({ x: rawX + 10 }, 100).to({ x: rawX - 10 }, 200).to({ x: rawX }, 100);
                caster.hpChange(-100);
            },

        }),

    };

    public static BuffCfg: { [key: number]: L2BuffCfg } = {
        0: new L2BuffCfg({
            "duration": 2,
            "name": "测试BUFF",
            "buffType": L2BuffType.Passive,
            "isDebuff": false,
            "triggerSkillCfgId": 5,
            "description": "自动行动结束前，治疗自身200生命，持续两回合",
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
            "name": "燃烧",
            "isDebuff": true,
            "description": "自动行动结束时，造成100伤害，持续两回合",
            "buffType": L2BuffType.Passive,
            "triggerSkillCfgId": 6,
            "skillTriggerTime": L2TriggerTimeType.AfterAction,
            "skillTriggerDudgeFunc": (buff: L2Buff): boolean => {
                if ((SceneManager.Ins.curScene as L2MainScene).timeManager.curChar == buff.target) {
                    return true;
                }
                return false;
            }

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
            "skillIds": [1, 3],
        }),
    }
}