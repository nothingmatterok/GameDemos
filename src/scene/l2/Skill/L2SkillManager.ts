class L2SkillManager {
    private waitingSkillList: [L2Skill, L2Char][] = [];
    public currentSkillTargets: L2Char|L2Cell[];
    private isInSkillProcess: boolean = false;

    public get IsInSkillProcess():boolean{
        return this.isInSkillProcess;
    }

    public pushSkill(skill: L2Skill, caster: L2Char){
        this.waitingSkillList.push([skill, caster]);
        if (!this.isInSkillProcess) {
            // 如果不为空，从里面找到头部的技能释放
            let nextCastSkill = this.waitingSkillList.shift();
            this.castSkill(nextCastSkill[0], nextCastSkill[1]);
        }
    }

    private castSkill(skill: L2Skill, caster: L2Char): void {
        this.isInSkillProcess = false;
        let tw = egret.Tween.get(caster);
        skill.castFunc(caster, tw)
        tw.call(() => {
            // 技能结束后，如果触发的释放技能对列为空，这一轮技能代表释放结束
            if (this.waitingSkillList.length == 0) {
                this.isInSkillProcess = true;
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