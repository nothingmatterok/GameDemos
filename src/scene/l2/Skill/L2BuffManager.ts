class L2BuffManager{

    private buffPool: L2Buff[];
    private buffs: L2Buff[];

    public initial(){
        this.buffPool = [];
        this.buffs = [];
        // 增加对各个时点的侦听，判断相同时机类型进行遍历触发
        MessageManager.Ins.addEventListener(MessageType.L2BuffTriggerTime, this.buffTrigger, this);
    }

    public newBuff(cfg: L2BuffCfg, caster: L2Char): L2Buff{
        let buff: L2Buff = this.buffPool.length > 0 ? this.buffPool.pop() : new L2Buff();
        buff.initial(cfg, caster);
        this.buffs.push(buff);
        return buff;
    }

    public attachBuff2Char(buff: L2Buff, char: L2Char): void{
        buff.attach2Char(char);
        buff.showBuffName();
    }

    public changeBuffDuration(buff: L2Buff, changeNum: number): void{
        // 0表示持续时间无限长，因此不对0的buff做任何时间上的处理
        if (buff.duration == 0) return;
        buff.duration += changeNum;
        if(buff.duration <= 0){
            buff.removeFromTarget();
            Util.removeObjFromArray(this.buffs, buff);
            buff.release();
            this.buffPool.push(buff);
        }
    }

    private buffTrigger(msg: Message): void{
        let timeType : L2TriggerTimeType = msg.messageContent[0];
        for (let buff of this.buffs){
            if (buff.enable && buff.config.buffType == L2BuffType.Passive){
                if (buff.config.skillTriggerTime == timeType && buff.config.skillTriggerDudgeFunc(buff, msg.messageContent)){
                    (SceneManager.Ins.curScene as L2MainScene).skillManager.pushSkill(
                        L2Config.SkillCfg[buff.config.triggerSkillCfgId], buff.target);
                }
            }
        }
    }

    public release():void{
        this.buffPool = null;
        for(let buff of this.buffs){
            buff.release();
        }
        this.buffs = null;
    }
}