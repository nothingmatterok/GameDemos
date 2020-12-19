const L1BUFFCFGS: { [key: string]: L1BuffConfig } = {
    "TEMPLATE": new L1BuffConfig(
        "TEMPLATE", 1000, 1000, L1BuffType.ATTRCHANGE, L1BuffStatus.NORMAL, "",
        {}, {},
        (target: L1Char, caster: L1Char) => { },
        (target: L1Char, caster: L1Char) => { return true }
    ),
    "BUFF01" : new L1BuffConfig(
        "BUFF01", 3000, 1000, L1BuffType.ATTRCHANGE, L1BuffStatus.NORMAL,
        "攻击 +10", {"ATK": 10}
    ),
    "BUFF02" : new L1BuffConfig(
        "BUFF02", 10000, 1000, L1BuffType.AFFECTPERIOD, L1BuffStatus.NORMAL,
        "持续掉血", null, null, (target: L1Char, caster: L1Char)=>{
            L1Harm.harm(caster, [target], new L1HarmConfig(()=>{return [false, 88]}))
            L1BuffManager.Ins.newBuff(L1BUFFCFGS.BUFF01, target, caster);
        }
    ),
}