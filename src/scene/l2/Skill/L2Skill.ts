class L2Skill{
    public effectRange: number = 1;
    public castRange: number = 2;
    public name: string;
    public castFunc:(caster: L2Char, tw: egret.Tween)=> void;
    public constructor(
        name:string, effectRange:number, 
        castRange: number, 
        castFunc: (caster:L2Char, tw: egret.Tween)=>void
    ){
        this.name = name;
        this.effectRange = effectRange;
        this.castRange = castRange;
        this.castFunc = castFunc;
    }

    public static harm(caster:L2Char, target: L2Char, ratio: number=1){
        target.hpChange(-(caster.attr.atk - target.attr.def) * ratio);
    }
}

class L2Config{
    public static SKILLCFG:{ [key: string]: L2Skill } = {
        "NormalATK": new L2Skill(
            "普通攻击", 1, 5, (caster: L2Char, tw: egret.Tween)=>{
                let scene = SceneManager.Ins.curScene as L2MainScene;
                let target = scene.skillManager.targets[0];
                tw.to({x:target.x, y: target.y, scaleX:1.5, scaleY:1.5}, 250).call(()=>{
                    console.log(`${caster.debugNAndP()} atk ${target.debugNAndP()}`);
                    L2Skill.harm(caster, target);
                }).to({x:caster.Cell.x, y: caster.Cell.y, scaleX:1, scaleY:1}, 250);
            }
        ),

    }
}
