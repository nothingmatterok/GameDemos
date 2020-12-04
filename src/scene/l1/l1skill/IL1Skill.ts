abstract class IL1Skill{
    public cdMs: number; // 多少毫秒
    private _frameCD: number; // 多少帧
    protected timeLine: {[key:number]:Function}; // key为毫秒
    protected abstract skillConfig(): void; // 以毫秒写技能事件
    protected abstract skillTargetFind(): Array<L1Char>;
    protected char: L1Char;
    protected targets: Array<L1Char>;

    /**
     * 
     * @param cd ms
     * @param char 
     */
    public Intial(cd:number, char: L1Char){
        this.cdMs = cd;
        this.char = char;
        this.skillConfig();
        let frameRateMs = GameRoot.GameStage.frameRate / 1000;
        this._frameCD = Math.ceil(cd * frameRateMs);
        // 将timeline中的事件转化为帧事件
        let tl = this.timeLine;
        let tltmp : {[key:number]:Function} = {};
        for(let key in tl){
            tltmp[Math.ceil(parseInt(key) * frameRateMs)] = tl[key];
        }
        this.timeLine = tltmp;
        
    }

    public release(){
    }

    // 技能开始释放后自己的帧计数
    private _castframeCount: number = 0;

    // 运行状态下的实际冷却
    private _runCd: number;
    public get CDRUN():number{
        return this._runCd;
    }

    public set CDRUN(v: number){
        if (v<0) v=0;
        this._runCd = v;
    }

    public findTarget(){
        this.targets = this.skillTargetFind();
    }

    public castPrepare(){
        this._castframeCount = 0;
        this.CDRUN = this._frameCD;
    }

    public isCD(){
        return this.CDRUN == 0;
    }

    public castingUpdate(){
        if(this._castframeCount in this.timeLine){
            this.timeLine[this._castframeCount]();
        }
        this._castframeCount += 1;
    }

    public castBreak(){
        this.char.skillCastBreak();
    }
    
}




