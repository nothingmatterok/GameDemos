class L1BuffConfig{
    public constructor(
        public id: string,
        public descr: string = "测试效果描述",
        public duration: number = 1000,
        public period: number = 500,
        public buffType: L1BuffType = L1BuffType.ATTRCHANGE,
        public status: L1BuffStatus = L1BuffStatus.NORMAL,
        public name : string = "",
        public attrAddAbs: {[key: string]: number} = {},
        public attrAddRatio: {[key: string]: number} = {},
        public affectFunc: (target: L1Char, caster: L1Char)=>void = ()=>{},
        public isAffectDudge: (target: L1Char, caster: L1Char) => boolean = ()=>{
            return true;
        },
        public canBeClear: boolean = true,
        public isGood: boolean = true,
        public condCd: number = 1000, // 作用效果冷却时间
    ){
    }
}

enum L1BuffType{
    AFFECTPERIOD,
    AFFECTCOND,
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