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

