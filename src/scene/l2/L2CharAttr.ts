class L2CharAttr{
    public atk: number = 100;
    public def: number = 20;
    public maxHp: number = 1000; // 伤害 = (atk - def) * ratio * 我方增伤 * 敌方易伤
    public startTime: number = 50; // 仅影响开局所处的时点
    public actionSpeed: number = 0; // 速度影响一次出手以后所处的时点，计算方式 默认时点 * （0.5 + 0.5 * 100 / （speed + 100））
    public moveRange: number = 5; // 移动范围
    public atkRange: number = 2; // 攻击范围
    public harmIncrease: number = 0; // 伤害增加
    public harmDecrease: number = 0; // 伤害降低
    public injureIncrease: number = 0; // 受伤增加
    public injureDecrease: number = 0; // 受伤降低
}