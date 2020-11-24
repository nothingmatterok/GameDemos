class LoadingUI extends eui.UILayer implements RES.PromiseTaskReporter {

	private static _instance: LoadingUI;
	private _progressLabel: eui.Label;

	public static get Ins():LoadingUI{
		if(LoadingUI._instance){
			return LoadingUI._instance;
		}
		LoadingUI._instance = new LoadingUI();
		return LoadingUI._instance;
    }

	private constructor() {
		super();
		this._progressLabel = new eui.Label();
		this._progressLabel.horizontalCenter = 0;
		this._progressLabel.verticalCenter = 0;
		this.addChild(this._progressLabel);
		this._progressLabel.text = "Loading...";
	}

	public initial(): void {
		let bg = Util.createColorBG(GameRoot.GameStage.stageWidth, GameRoot.GameStage.stageHeight);
		this.addChildAt(bg, 0);
		this._progressLabel.text = "Loading...";
	}

	public onProgress(current: number, total: number): void {
		this._progressLabel.text = `Loading...${current}/${total}`;
	}

}
