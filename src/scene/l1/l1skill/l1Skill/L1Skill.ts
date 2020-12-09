class L1Skill {
    public config: L1SkillConfig;

    // 辅助组件
    private _creationManager: L1CreationManager;
    private _buffManager: L1BuffManager;

    // 运行时需要转化为帧时间的内容
    private _frameCD: number; // 多少帧
    private timeLine: { [key: number]: (skill: L1Skill)=>void}; // key为帧
    private _endFrame: number; // 结束帧

    // 运行时
    public caster: L1Char;
    public targets: Array<L1Char>;

    /**
     * 
     * @param cd ms
     * @param char 
     */
    public constructor() {
        this._creationManager = (SceneManager.Ins.curScene as L1NormalBattleScene).creationManager;
        this._buffManager = (SceneManager.Ins.curScene as L1NormalBattleScene).buffManager;
    }

    public initial(caster: L1Char, config: L1SkillConfig) {
        this.caster = caster;
        this.config = config;
        let frameRateMs = GameRoot.GameStage.frameRate / 1000;
        this._frameCD = Math.ceil(this.config.cdMs * frameRateMs);
        // 将timeline中的事件转化为帧事件
        let tl = this.config.timeLine;
        let tltmp: { [key: number]: (skill: L1Skill)=>void} = {};
        for (let key in tl) {
            tltmp[Math.ceil(parseInt(key) * frameRateMs)] = tl[key];
        }
        this._endFrame = 0;
        for (let key in tltmp) {
            let endframe = parseInt(key);
            if (endframe > this._endFrame) this._endFrame = endframe;
        }
        this._endFrame += 1;
        this.timeLine = tltmp;
        this._runCd = 0;
    }

    public release() {
    }

    // 技能开始释放后自己的帧计数
    private _castframeCount: number = 0;

    // 运行状态下的实际冷却
    private _runCd: number;
    public get CDRUN(): number {
        return this._runCd;
    }

    public set CDRUN(v: number) {
        if (v <= 0) v = 0;
        this._runCd = v;
    }

    public isCoolDown(): boolean {
        return this.CDRUN == 0;
    }

    public findTarget() {
        this.targets = this.config.skillTargetFind(this);
    }

    public castPrepare() {
        this._castframeCount = 0;
        this.CDRUN = this._frameCD;
        this.showSkillName();
        this.caster.inSkillCasting = true;
    }

    private showSkillName() {
        if (this.config.name == "") return;//普攻或者一些不需要展示的，直接不用管
        let color = ColorDef.DodgerBlue;
        let size = 40;
        ToastInfoManager.newToast(
            this.config.name, color,
            this.caster.y - 60, this.caster.x - GameRoot.GameStage.stageWidth / 2,
            -50, 0, 2500, size, true, egret.Ease.quadOut
        );
    }

    public isCD() {
        return this.CDRUN == 0;
    }

    public isEnd() {
        return this._castframeCount > this._endFrame;
    }

    public castingUpdate() {
        if (this._castframeCount in this.timeLine) {
            this.timeLine[this._castframeCount](this);
        }
        this._castframeCount += 1;
    }

    public endCast() {
        this.caster.inSkillCasting = false;
        this.caster.endSkillCast();
    }

    public newCreation(
        config: L1CreationConfig, caster: L1Char,
        targetChar: L1Char = null, startPos: [number, number],
        posDest: [number, number] = null, directRad: number = null
    ) {
        this._creationManager.newCreation(config, caster, targetChar, startPos, posDest, directRad);
    }

    public newBuff(config: L1BuffConfig, target: L1Char, caster: L1Char) {
        this._buffManager.newBuff(config, target, caster);
    }

}




