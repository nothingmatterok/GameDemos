/**
 * 这个类里存战斗开始前的数值，L1char中存增加了buff以后的数值
 */
class L1CharAttr{
    public static readonly ATTRNAMES = [
        L1ATTRNAME.MAXHP, L1ATTRNAME.ATK, L1ATTRNAME.DEF, 
        L1ATTRNAME.CRITP, L1ATTRNAME.DODGEP, L1ATTRNAME.CRITT
    ]; 
    public maxHp: number = 1000; // 最大血量
    public atk: number = 100; // 攻击
    public def: number = 100; // 防御
    public range: number = 400; // 普通攻击施法宽度，尽可能大于CHARMINDIS
    public critPoint: number = 10; // 暴击率 = p /100
    public dodgePoint: number = 10; // 闪避率 = p /100
    public critTime: number = 1.2; // 暴击倍率

    // 每秒多少m
    public moveSpeed: number = 160;
    // 每秒多少度
    public rotationSpeed: number = 180;
    // --------- 其他参数 -----------
    public static readonly MAXANGER = 100; // 最大怒气值
    public static readonly CHARMINDIS = 60; // 两角色间最小距离
    public static readonly MAXDODGEP = 80; // 最高系统闪避 80%
}