class GameRoot {
    private static _instance: GameRoot;
    private _gameStage: egret.Stage;
    
	private constructor(){
		MessageManager.Ins.addEventListener(
            egret.Event.ENTER_FRAME, 
            this.update, 
            this
        );
    }
    
    public static get GameStage(): egret.Stage{
        return GameRoot.Ins._gameStage;
    }

	public static get Ins():GameRoot{
		if(GameRoot._instance){
			return GameRoot._instance;
		}
		GameRoot._instance = new GameRoot();
		return GameRoot._instance;
    }

    public init(stage: egret.Stage):void{
        this._gameStage = stage;
        // TODO: 增加各个System的初始化
        // SceneManager.Ins.initial();
        // LayerManager.Ins.initial();
    }
    
    private update(): void{
        // TODO: 各个系统的update
    }
}
