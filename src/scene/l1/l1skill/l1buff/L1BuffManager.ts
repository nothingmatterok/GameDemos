class L1BuffManager{
    private _deadBuffs: L1Buff[];
    private _activateBuffs: MySet<L1Buff>;

    public constructor(){
        this._deadBuffs = [];
        this._activateBuffs = new MySet<L1Buff>();
    }

    public update(){
        // 判断buff消亡
        let buffDeadTemp:L1Buff[] = [];
        for(let buff of this._activateBuffs.data){
            if(buff.isLifeEnd()){
                buffDeadTemp.push(buff);
                buff.removeFromTarget();
            }
        }
        for(let buff of buffDeadTemp){
            this._activateBuffs.remove(buff);
            this._deadBuffs.push(buff);
        }
        for(let buff of this._activateBuffs.data){
            buff.update();
        }
    }

    public newBuff(config: L1BuffConfig, target: L1Char, caster: L1Char){
        let buff:L1Buff = null
        if(this._deadBuffs.length == 0){
            buff = new L1Buff();
        } else {
            buff = this._deadBuffs.pop();
        }
        this._activateBuffs.add(buff);
        buff.initial(config, target, caster);
    }

    public removeBuff(buff: L1Buff){
        buff.removeFromTarget();
        this._deadBuffs.push(buff);
        this._activateBuffs.remove(buff);
    }
}