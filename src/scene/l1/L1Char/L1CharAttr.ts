/**
 * 这个类里存战斗开始前的数值，L1char中存增加了buff以后的数值
 */
class L1CharAttr {
    public static readonly ATTRNAMES = [
        L1ATTRNAME.MAXHP, L1ATTRNAME.ATK, L1ATTRNAME.DEF,
        L1ATTRNAME.CRITP, L1ATTRNAME.DODGEP, L1ATTRNAME.CRITT
    ];

    public constructor(
        public maxHp: number, public atk: number,
        public def: number, public range: number, public critPoint: number,
        public dodgePoint: number, public critTime: number, public posNum: number
    ) { }

    // 每秒多少m
    public moveSpeed: number = 160;
    // 每秒多少度
    public rotationSpeed: number = 180;
    public angerAdds: number = 20; // 每秒增加的怒气
    // --------- 其他参数 -----------
    public static readonly MAXANGER = 100; // 最大怒气值
    public static readonly CHARMINDIS = 60; // 两角色间最小距离
    public static readonly MAXDODGEP = 80; // 最高系统闪避 80%
}