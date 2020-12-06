/**
 * 自愈技能
 */
class DemoHealSkill extends IL1Skill {
    protected skillTargetFind(): Array<L1Char> {
        return [this.char];
    }

    private harmConfig = new L1HarmConfig(
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
            L1Harm.harm(this.char, this.targets, this.harmConfig)
        }
    }

}

class NormalAttakRangeSkill extends IL1Skill {
    protected skillTargetFind(): Array<L1Char> {
        return [this.char.normalAttakTarget];
    }

    private _bullet: L1CreationConfig = new L1CreationConfig(
        5, L1CrtnFlyType.CHAR, L1CrTnAffectContType.ONECE,
        L1CrTnAffectTargetSetType.PRESET, L1CrtnAffectTargetCamp.OTHER,
        800, 1, 10, (targets: L1Char[], caster: L1Char) => {
            L1Harm.harm(caster, targets)
        }, 1, ColorDef.DarkOrange
    )

    protected skillConfig(): void {
        let tl = this.timeLine = {};
        this.cdMs = 2000;
        tl[0] = () => { // 开始播放攻击动画
            this.char.startAnim([[0, 0], [10, 0], [-5, 0], [0, 0]], [75, 100, 50]);
            this.char.addAngerNumber(15);
            this.newCreation(
                this._bullet, this.char,
                this.targets[0], this.char.pos, this.targets[0].pos
            );
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