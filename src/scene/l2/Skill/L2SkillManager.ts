class L2SkillManager {
    private waitingSkillList: [L2SkillCfg, L2Char, {[key:string]:any}][] = [];
    private isInSkillProcess: boolean = false;

    public get IsInSkillProcess(): boolean {
        return this.isInSkillProcess;
    }

    public pushSkill(skillCfg: L2SkillCfg, caster: L2Char, params:{[key:string]:any}=null) {
        this.waitingSkillList.push([skillCfg, caster, params]);
        // 如果没有在技能处理过程中，进行技能处理
        if (!this.isInSkillProcess) {
            // 如果不为空，从里面找到头部的技能释放
            let nextCastSkill = this.waitingSkillList.shift();
            this.castSkill(nextCastSkill[0], nextCastSkill[1], nextCastSkill[2]);
        }
    }

    private castSkill(skillCfg: L2SkillCfg, caster: L2Char, params: {[key:string]:any}): void {
        this.isInSkillProcess = true;
        let tw = egret.Tween.get(caster);
        if(DEBUG){console.log(`${caster.debugNAndP()} cast ${skillCfg.name}`)}
        skillCfg.castFunc(caster, tw, params)
        tw.call(() => {
            // TODO:处理技能释放完毕的CD，及时间轴推后处理
            // 技能结束后，如果触发的释放技能对列为空，这一轮技能代表释放结束
            if (this.waitingSkillList.length == 0) {
                this.isInSkillProcess = false;
            } else {
                // 如果不为空，从里面找到头部的技能释放
                let nextCastSkill = this.waitingSkillList.shift();
                this.castSkill(nextCastSkill[0], nextCastSkill[1], nextCastSkill[2]);
            }
        });
    }

    public release() {
        this.waitingSkillList = null
    }

    public static harm(caster: L2Char, target: L2Char, ratio: number = 1) {
        target.hpChange(-(caster.attr.atk - target.attr.def) * ratio * (
            1 + caster.attr.harmIncrease - caster.attr.harmDecrease
            + target.attr.injureIncrease - target.attr.injureDecrease
        ));
    }
}