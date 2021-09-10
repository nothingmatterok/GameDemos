class L2MainUI extends eui.Component {

    private backButton: eui.Button;

    constructor() {
        super();
        this.width = GameRoot.StageWidth;
        this.height = GameRoot.StageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToMainScene, this);
    }

    private backToMainScene(){
        SceneManager.Ins.setScene(new MainScene());
    }

}