class L1SkillConfig{
    /**
     * 
     * @param name 
     * @param cdMs 
     * @param timeLine 以ms为key，存入技能函数需要在这一帧开始做什么
     * @param skillTargetFind 
     */
    public constructor(public name:string, public cdMs: number, 
        public timeLine: { [key: number]: (skill: L1Skill)=>void},
        public skillTargetFind: (skill: L1Skill)=>Array<L1Char>
    ){}
}