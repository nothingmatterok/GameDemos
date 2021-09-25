class L2SkillManager {
    private waitingSkillList: [L2SkillCfg, L2Char][] = [];
    public currentSkillTargets: any[];
    private isInSkillProcess: boolean = false;

    public get IsInSkillProcess():boolean{
        return this.isInSkillProcess;
    }

    public pushSkill(skill: L2SkillCfg, caster: L2Char){
        this.waitingSkillList.push([skill, caster]);
        // 如果没有在技能处理过程中，进行技能处理
        if (!this.isInSkillProcess) {
            // 如果不为空，从里面找到头部的技能释放
            let nextCastSkill = this.waitingSkillList.shift();
            this.castSkill(nextCastSkill[0], nextCastSkill[1]);
        }
    }

    private castSkill(skill: L2SkillCfg, caster: L2Char): void {
        this.isInSkillProcess = true;
        let tw = egret.Tween.get(caster);
        skill.castFunc(caster, tw)
        tw.call(() => {
            // 技能结束后，如果触发的释放技能对列为空，这一轮技能代表释放结束
            if (this.waitingSkillList.length == 0) {
                this.isInSkillProcess = false;
            } else {
                // 如果不为空，从里面找到头部的技能释放
                let nextCastSkill = this.waitingSkillList.shift();
                this.castSkill(nextCastSkill[0], nextCastSkill[1]);
            }
        });
    }

    public release(){
        this.currentSkillTargets = null;
        this.waitingSkillList = null
    }
}