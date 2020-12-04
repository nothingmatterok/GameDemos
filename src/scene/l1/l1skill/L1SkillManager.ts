class L1SkillManager{
    
    private _skillCastingList: MySet<IL1Skill>;
    public allSkillList: MySet<IL1Skill>;

    public initial(){
        this._skillCastingList = new MySet<IL1Skill>();
        this.allSkillList = new MySet<IL1Skill>(); // 主要进行CD管理
    }

    public update(){
        for(let skill of this._skillCastingList.data){
            skill.castingUpdate();
        }
        for(let skill of this.allSkillList.data){
            skill.CDRUN = skill.CDRUN - 1;
        }
    }

    public castSkill(skill: IL1Skill){
        skill.castPrepare();
        skill.findTarget();
        this._skillCastingList.add(skill);
    }

    public castSkillBreak(skill: IL1Skill){
        skill.castBreak();
        this._skillCastingList.remove(skill);
    }

}