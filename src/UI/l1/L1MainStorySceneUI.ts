class L1MainStorySceneUI extends eui.Component{
    private backButton: eui.Button;

    constructor() {
        super();
        this.width = GameRoot.GameStage.stageWidth;
        this.height = GameRoot.GameStage.stageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToL1MainScene, this);
    }

    private backToL1MainScene(){
        SceneManager.Ins.setScene(new L1MainScene());
    }

}