class L1MainStoryScene extends IScene {

    private _resLoad: ResAsyncLoader = new ResAsyncLoader();;

    public initial() {
        LayerManager.Ins.uiLayer.addChild(new L1MainStorySceneUI());
        this.initialGameLayer();
    }

    private initialGameLayer() {
        for (let i = 1; i <= 8; i++) {
            let char = new L1Char(i % 2 * 2 - 1, i);
            char.addToScene();
        }
    }

    public async loadResource() {
        await this._resLoad.loadGroup("portrait", 0, LayerManager.Ins.loadingUI);
    }

    public releaseResource() {
        this._resLoad.releaseResource();
    }
}