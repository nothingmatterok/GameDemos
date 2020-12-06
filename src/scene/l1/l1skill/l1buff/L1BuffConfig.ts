class L1BuffConfig{
    // 持续时间 ms buff飘字名称（攻击 + 10%）
    // 作用类型 作用型 间隔性 间隔范围 作用函数
    // 作用类型 属性增减型
    // 作用类型 状态型 眩晕 沉默 其他表示型BUFF
    // 生效判定&&作用判定函数
    public duration: number; // ms
    public period: number;
    public name: string;
    public buffType: L1BuffType;
    public status: L1BuffStatus;
    public attrAddAbs: {[key: string]: number};
    public attrAddRatio: {[key: string]: number};
    public affectFunc: (target: L1Char, caster: L1Char)=>void;
    public isAffect: (target: L1Char, caster: L1Char) => boolean;

    public constructor(
        duration: number = 1000,
        period: number = 500,
        buffType: L1BuffType = L1BuffType.ATTRCHANGE,
        status: L1BuffStatus = L1BuffStatus.NORMAL,
        name : string = "",
        attrAddAbs: {[key: string]: number} = {},
        attrAddRatio: {[key: string]: number} = {},
        affectFunc: (target: L1Char, caster: L1Char)=>void = ()=>{},
        isAffectDudge: (target: L1Char, caster: L1Char) => boolean = ()=>{
            return true;
        }
    ){
        this.duration = duration;
        this.period = period;
        this.buffType = buffType;
        this.status = status;
        this.name = name;
        this.attrAddAbs = attrAddAbs;
        this.attrAddRatio = attrAddRatio;
        this.affectFunc = affectFunc;
        this.isAffect = isAffectDudge;
    }
}

enum L1BuffType{
    AFFECT,
    ATTRCHANGE,
    STATUS
}

enum L1BuffStatus{
    NORMAL,
    DIZZ,
    SLIENT,
    L3,
    L4
}