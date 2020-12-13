class L1SkillManager{
    
    private _skillCastingList: MySet<L1Skill>;
    private _allSkillList: MySet<L1Skill>;

    public static get Ins(): L1SkillManager{
        return (SceneManager.Ins.curScene as L1NormalBattleScene).skillManager;
    }

    public constructor(){
        this._skillCastingList = new MySet<L1Skill>();
        this._allSkillList = new MySet<L1Skill>(); // 主要进行CD管理
    }

    public update(){
        // 判断已经完成播放的技能置入到非播放技能列表
        let castEndSkills = [];
        for(let skill of this._skillCastingList.data){
            // 如果技能需要执行就先执行一遍
            skill.castingUpdate();
            if(skill.isEnd()){
                skill.endCast();
                castEndSkills.push(skill);
            }
        }
        for(let skill of castEndSkills){
            this._skillCastingList.remove(skill);
        }

        // 所有技能CD-1帧
        for(let skill of this._allSkillList.data){
            skill.CDRUN = skill.CDRUN - 1;
        }
    }

    public castSkill(skill: L1Skill){
        skill.castPrepare();
        skill.findTarget();
        this._skillCastingList.add(skill);
    }

    public castSkillBreak(skill: L1Skill){
        skill.endCast();
        this._skillCastingList.remove(skill);
    }

    public newSkill(config: L1SkillConfig, caster: L1Char): L1Skill{
        let skill = new L1Skill();
        skill.initial(caster, config);
        this._allSkillList.add(skill);
        return skill;
    }

}