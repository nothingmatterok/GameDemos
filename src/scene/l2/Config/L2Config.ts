
class L2Config {
    public static SkillCfg: { [key: number]: L2SkillCfg } = {
        0: new L2SkillCfg({
            "name": "普通攻击",
            "effectRange": 1,
            "castRange": 5,
            "castFunc": (caster: L2Char, tw: egret.Tween) => {
                let scene = SceneManager.Ins.curScene as L2MainScene;
                let target: L2Char = scene.skillManager.currentSkillTargets[0];
                tw.to({ x: target.x, y: target.y, scaleX: 1.5, scaleY: 1.5 }, 250).call(() => {
                    console.log(`${caster.debugNAndP()} atk ${target.debugNAndP()}`);
                    L2SkillCfg.harm(caster, target);
                }).to({ x: caster.Cell.x, y: caster.Cell.y, scaleX: 1, scaleY: 1 }, 250);
            }
        }),

    }

    public static BuffCfg: { [key: number]: L2BuffCfg } = {
        0: new L2BuffCfg({
            "duration": 2,
            "name": "测试BUFF",
            "buffType": L2BuffType.Passive,
            "triggerFunc": (buff: L2Buff) => {
                buff.showBuffName();
                buff.target.hpChange(200);
            },
            "funcTriggerType": L2TriggerTimeType.BeforeAction,
            "funcTriggerDudgeFunc": (buff: L2Buff): boolean => {
                if ((SceneManager.Ins.curScene as L2MainScene).timeManager.curChar == buff.target) {
                    return true;
                }
                return false;
            }
        }),
    }
}