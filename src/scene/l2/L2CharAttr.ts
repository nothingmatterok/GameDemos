class L2CharAttr{
    public atk: number;
    public def: number;
    public maxHp: number; // 伤害 = (atk - def) * ratio * 我方增伤 * 敌方易伤
    public startTime: number; // 仅影响开局所处的时点
    public actionSpeed: number; // 速度影响一次出手以后所处的时点，计算方式 默认时点 * （0.5 + 0.5 * 100 / （speed + 100））
    public moveRange: number; // 移动范围
    public atkRange: number; // 攻击范围
}