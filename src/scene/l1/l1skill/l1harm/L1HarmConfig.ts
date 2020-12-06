class L1HarmConfig {
    // 伤害计算公式，返回是否暴击，与伤害
    public harmFunc: (caster: L1Char, target: L1Char) => [boolean, number];

    public constructor(harmFunc?: (caster: L1Char, target: L1Char) => [boolean, number]) {
        if (harmFunc) {
            this.harmFunc = harmFunc;
        } else {
            this.harmFunc = (caster: L1Char, target: L1Char) => {
                let isCrit = L1Harm.isRandTrue(caster.critPoint);
                let isDodge = L1Harm.isRandTrue(target.dodgePoint);
                let harm = 0;
                if (!isDodge) {
                    let ratio = isCrit ? caster.critTime : 1;
                    harm = caster.atk * caster.atk / (target.def + caster.atk) * ratio;
                }
                return [isCrit, harm];
            }
        }
    }
}