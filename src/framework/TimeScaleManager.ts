// 废弃
class TimeScaleManager {
    private static _instance: TimeScaleManager;
    private _timeScale: number = 1;
    public set TimeScale(value:number){
        this._frameCount = 0;
        if(value > 1){
            this._timeScale = 1;
            return;
        }
        this._timeScale = value;
        let frameSkip30 = Math.ceil(30 - this._timeScale * 30);
        this.set30PlayArray(frameSkip30);
        console.log(this._isFrame30Play);
        
    }
    
	private constructor(){
        this._isFrame30Play = [];
        for(let i=0; i<30;i++){
            this._isFrame30Play[i] = true;
        }
    }

	public static get Ins():TimeScaleManager{
		if(TimeScaleManager._instance){
			return TimeScaleManager._instance;
		}
		TimeScaleManager._instance = new TimeScaleManager();
		return TimeScaleManager._instance;
    }

    public initial(){

    }

    private set30PlayArray(skipNum: number){
        let playNum = 30 - skipNum;
        let booleanReverse = false;
        if (playNum < skipNum){
            booleanReverse = true;
            playNum = skipNum;
            skipNum = 30 - playNum;
        }
        // 每一个playPerid插一个skip
        let playPeriod = playNum / skipNum;
        let playPeriodAdd = playPeriod;
        let playCount = 0;
        for(let i =0; i<30; i++){
            if (playNum > 0){
                if(playCount < playPeriodAdd){
                    this._isFrame30Play[i] = true;
                    playCount += 1;
                    playNum -= 1;
                }else{
                    this._isFrame30Play[i] = false;
                    playPeriodAdd += playPeriod;
                }
            } else{
                this._isFrame30Play[i] = false;
            }
        }
        if(booleanReverse) this.playBoolReverse();
    }

    private playBoolReverse(){
        for(let i=0;i<30;i++){
            this._isFrame30Play[i] = !this._isFrame30Play[i];
        }
    }

    private _frameCount = 0;
    private _isFrame30Play: boolean[];
    /**
     * 根据timescale分配本帧是否要对其他收到timescale影响的内容需要update
     * 原则上来说：
     *  受到timescale控制的update放在这个判断之前
     *  其他的放到这个update之后
     * （这里管理比较粗糙，30帧进行管理，里面插入1～30空帧
     */
    public update(): boolean{
        if(this._timeScale < 0.034){
            // 如果timescale让30帧都播放不了1帧，直接返回后面不用更新了
            return false;
        }
        if(this._timeScale > 0.966){
            // 如果30帧都插不了一帧空帧，那么直接帧帧都跟新
            return true;
        }
        this._frameCount = this._frameCount + 1;
        if (this._frameCount >= 30) this._frameCount = 0;
        return this._isFrame30Play[this._frameCount];
    }

}
    