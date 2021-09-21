
class L2Config{
    public static SkillCfg:{ [key: string]: L2Skill } = {
        "NormalATK": new L2Skill(
            "普通攻击", 1, 5, (caster: L2Char, tw: egret.Tween)=>{
                let scene = SceneManager.Ins.curScene as L2MainScene;
                let target : L2Char = scene.skillManager.currentSkillTargets[0];
                tw.to({x:target.x, y: target.y, scaleX:1.5, scaleY:1.5}, 250).call(()=>{
                    console.log(`${caster.debugNAndP()} atk ${target.debugNAndP()}`);
                    L2Skill.harm(caster, target);
                }).to({x:caster.Cell.x, y: caster.Cell.y, scaleX:1, scaleY:1}, 250);
            }
        ),

    }

    public static BuffCfg:{[key:string]: L2BuffCfg} = {

    }
}