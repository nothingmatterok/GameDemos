class LoadingUI extends eui.UILayer implements RES.PromiseTaskReporter {

	private _progressLabel: eui.Label;

	public constructor() {
		super();
		this._progressLabel = new eui.Label();
		this._progressLabel.horizontalCenter = 0;
		this._progressLabel.verticalCenter = 0;
		this.addChild(this._progressLabel);
	}

	/**
	 * GameRoot启动后初始化
	 */
	public initial(): void {
		let bg = Util.createColorBG(GameRoot.GameStage.stageWidth, GameRoot.GameStage.stageHeight);
		this.addChildAt(bg, 0);
	}

	public clear(): void{
		this._progressLabel.text = "Loading...";
	}

	public onProgress(current: number, total: number): void {
		this._progressLabel.text = `Loading...${current}/${total}`;
	}

}
