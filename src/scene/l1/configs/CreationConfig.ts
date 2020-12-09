const L1CRTNCFGS: { [key: string]: L1CreationConfig } = {
    "TEMPLATE": new L1CreationConfig(
        100, L1CrtnFlyType.FIX, L1CrTnAffectContType.ONECE,
        L1CrTnAffectTargetSetType.PRESET, L1CrtnAffectTargetCamp.OTHER,
        400, 1000, 200,
        (targets: L1Char[], caster: L1Char) => { },
        0.9, ColorDef.DarkOrange
    ),

    // 普攻远程子弹
    "NORMBULLET01" : new L1CreationConfig(
        5, L1CrtnFlyType.CHAR, L1CrTnAffectContType.ONECE,
        L1CrTnAffectTargetSetType.PRESET, L1CrtnAffectTargetCamp.OTHER,
        800, 1, 10, (targets: L1Char[], caster: L1Char) => {
            L1Harm.harm(caster, targets)
        }, 1, ColorDef.DarkOrange
    ),

}