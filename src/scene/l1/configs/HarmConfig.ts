const L1HARMCFGS: { [key: string]: L1HarmConfig } = {
    // 模版
    "TEMPLATE" : new L1HarmConfig(
        (caster: L1Char, target: L1Char) => {return [true, 0]}
    ), 
    // 测试治疗伤害
    "HEAL01" : new L1HarmConfig(
        (caster, target) => {
            let isCrit = L1Harm.isRandTrue(caster.critPoint);
            let healNum = caster.maxHp * 0.2; // 治疗最大血量的20%
            if (isCrit) healNum *= caster.critTime;
            return [isCrit, -healNum];
        }
    ),

}