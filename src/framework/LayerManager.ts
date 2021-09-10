class LayerManager {

	// 游戏层，显示游戏对象等
	public gameLayer: egret.DisplayObjectContainer;
	// UI层，显示UI
	public uiLayer: eui.UILayer;
	// loading层，只显示loading界面
	public loadingUI: LoadingUI;

	private static _instance: LayerManager;
	public static get Ins(): LayerManager {
		if (this._instance == null) {
			this._instance = new LayerManager();
		}
		return this._instance;
	}

	private constructor() { }

	public initial() {
		this.loadingUI = new LoadingUI();
		this.loadingUI.initial();
		this.uiLayer = new eui.UILayer();
		this.gameLayer = new egret.DisplayObjectContainer();
		
		// add layer to stage
		GameRoot.GameStage.addChild(this.gameLayer);
		GameRoot.GameStage.addChild(this.uiLayer);
		GameRoot.GameStage.addChild(this.loadingUI);
	}


	public showLoadingUILayer(): void {
		this.loadingUI.clear();
		this.loadingUI.visible = true;
		this.loadingUI.touchEnabled = true;
	}

	public hideLoadingUILayer(): void {
		this.loadingUI.visible = false;
		this.loadingUI.touchEnabled = false;
	}

	public clear(): void {
		this.gameLayer.removeChildren();
		this.uiLayer.removeChildren();
	}
}
