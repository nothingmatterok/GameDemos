class LayerManager {

	public gameLayer: egret.DisplayObjectContainer;
	public uiLayer: eui.UILayer;
	public popUpLayer: eui.UILayer;
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
		this.loadingUI = LoadingUI.Ins;
		this.uiLayer = new eui.UILayer();
		this.gameLayer = new egret.DisplayObjectContainer();
		this.popUpLayer = new eui.UILayer();
		this.loadingUI.touchEnabled = false;
		this.uiLayer.touchEnabled = false;
		this.gameLayer.touchEnabled = false;
		this.popUpLayer.touchEnabled = false;

		// add layer to stage
		GameRoot.GameStage.addChild(this.gameLayer);
		GameRoot.GameStage.addChild(this.uiLayer);
		GameRoot.GameStage.addChild(this.popUpLayer);
		GameRoot.GameStage.addChild(this.loadingUI);
	}

	public showLoadingUILayer(): void {
		this.loadingUI.initial();
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
		this.popUpLayer.removeChildren();
	}
}
