/**
 * 自愈技能
 */
class DemoHealSkill extends IL1Skill {
    protected skillTargetFind(): Array<L1Char> {
        return [this.char];
    }

    private static readonly harmConfig = new L1HarmConfig(
        (caster: L1Char, target) => {
            let isCrit = L1Harm.isRandTrue(caster.critPoint);
            let healNum = caster.maxHp * 0.2; // 治疗最大血量的20%
            if (isCrit) healNum *= caster.critTime;
            return [isCrit, -healNum];
        }
    );

    protected skillConfig(): void {
        let tl = this.timeLine = {};
        this.name = "风灵颂";
        this.cdMs = 10000;
        tl[0] = () => { // 第0ms开始执行
            this.char.startAnim([[0, 0], [0, 10], [0, -10], [0, 0]], [75, 150, 75]);
        }
        tl[150] = () => { // 第75ms执行
            L1Harm.harm(this.char, this.targets, DemoHealSkill.harmConfig)
        }
    }

}

class NormalAttakRangeSkill extends IL1Skill {
    protected skillTargetFind(): Array<L1Char> {
        return [this.char.normalAttakTarget];
    }

    private static readonly BULLET: L1CreationConfig = new L1CreationConfig(
        5, L1CrtnFlyType.CHAR, L1CrTnAffectContType.ONECE,
        L1CrTnAffectTargetSetType.PRESET, L1CrtnAffectTargetCamp.OTHER,
        800, 1, 10, (targets: L1Char[], caster: L1Char) => {
            L1Harm.harm(caster, targets)
        }, 1, ColorDef.DarkOrange
    )

    private static readonly BUFF1: L1BuffConfig = new L1BuffConfig(
        1000, 1000, L1BuffType.ATTRCHANGE, L1BuffStatus.NORMAL,
        "攻击 +10", {"ATK": 10}
    );

    private static readonly BUFF2: L1BuffConfig = new L1BuffConfig(
        10000, 1000, L1BuffType.AFFECT, L1BuffStatus.NORMAL,
        "持续掉血", null, null, (target: L1Char, caster: L1Char)=>{
            L1Harm.harm(caster, [target], new L1HarmConfig(()=>{return [false, 88]}))
        }
    );

    protected skillConfig(): void {
        let tl = this.timeLine = {};
        this.cdMs = 2000;
        tl[0] = () => { // 开始播放攻击动画
            this.char.startAnim([[0, 0], [10, 0], [-5, 0], [0, 0]], [75, 100, 50]);
            this.char.addAngerNumber(15);
            this.newCreation(
                NormalAttakRangeSkill.BULLET, this.char,
                this.targets[0], this.char.pos, this.targets[0].pos
            );
            this.newBuff(NormalAttakRangeSkill.BUFF1, this.char, this.char);
            this.newBuff(NormalAttakRangeSkill.BUFF2, this.targets[0], this.char);
        }
    }
}

class NormalAttakCloseSkill extends IL1Skill {
    protected skillTargetFind(): Array<L1Char> {
        return [this.char.normalAttakTarget];
    }

    protected skillConfig(): void {
        let tl = this.timeLine = {};
        this.cdMs = 2000;
        tl[0] = () => { // 开始播放攻击动画
            this.char.startAnim([[0, 0], [10, 0], [-5, 0], [0, 0]], [75, 100, 50]);
            this.char.addAngerNumber(15);
        }
        tl[75] = ()=>{
            L1Harm.harm(this.char, this.targets);
        }
    }
}