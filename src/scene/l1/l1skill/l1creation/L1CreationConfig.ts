class L1CreationConfig {
    // 暂时只考虑最基础的情况，圆形，定点生成或飞行到目标
    // 目标分为固定坐标或动态角色， 动态角色则会随着角色移动
    // 作用类型分为持续作用或单次作用
    // 单次作用时机分为 生成时作用 与 到达目标后作用
    // 作用目标选择分为 固定目标 与 范围自动选取
    // 持续时间分为到达目标后持续与固定持续时间
    // 创生物作用范围直接通过半径判断

    public radius: number = 10; // 半径
    public flyType: L1CrtnFlyType = L1CrtnFlyType.FIX;
    public affectContType: L1CrTnAffectContType = L1CrTnAffectContType.ONECE;
    public affectTargetSetType: L1CrTnAffectTargetSetType = L1CrTnAffectTargetSetType.RANGE;
    public affectTargetCamp: L1CrtnAffectTargetCamp = L1CrtnAffectTargetCamp.OTHER;
    public flySpeed: number = 1000; // 飞行速度 xx m/ms
    public lifeTime: number = 1000; //生存时长 ms
    public affectPeriod: number = 1000; //作用间隔，毫秒
    public alpha: number = 0.4;
    public color: number;
    public affectFunc: (targets: L1Char[], caster: L1Char) => void; // 作用函数

    public constructor(
        radius: number = 10,
        flyType: L1CrtnFlyType = L1CrtnFlyType.FIX,
        affectContType: L1CrTnAffectContType = L1CrTnAffectContType.ONECE,
        affectTargetSetType: L1CrTnAffectTargetSetType = L1CrTnAffectTargetSetType.RANGE,
        affectTargetCamp: L1CrtnAffectTargetCamp = L1CrtnAffectTargetCamp.OTHER,
        flySpeed: number = 1000,
        lifeTime: number = 1000,
        affectPeriod: number = 1000, //作用间隔，毫秒
        affectFunc: (targets: L1Char[], caster: L1Char) => void = (
            targets: L1Char[], caster: L1Char) => {
            L1Harm.harm(caster, targets)
        }, // 作用函数
        alpha: number = 0.4,
        color: number = ColorDef.White
    ) {
        this.radius = radius;
        this.flySpeed = flySpeed;
        this.flyType = flyType;
        this.affectContType = affectContType;
        this.affectTargetSetType = affectTargetSetType;
        this.affectTargetCamp = affectTargetCamp;
        this.lifeTime = lifeTime;
        this.affectPeriod = affectPeriod;
        this.affectFunc = affectFunc;
        this.alpha = alpha;
        this.color = color;
    }

}

enum L1CrtnFlyType {
    FIX, // 原地， 固定持续时间
    POSITION, // 到达某个地点 到达目标后再计算持续时间
    DIRECT, // 往某个方向飞， 固定持续时间
    CHAR // 某个会动的目标， 到达目标后计算
}

enum L1CrTnAffectContType {
    CONTINUE, // 生存期间持续作用
    ONECE // 只进行单次作用
}

enum L1CrTnAffectTargetSetType {
    PRESET, // 提前设置好被作用的目标
    RANGE // 根据作用时机在那时根据radius选择目标
}

enum L1CrtnAffectTargetCamp {
    SELF, // 己方
    OTHER // 其他方
}
