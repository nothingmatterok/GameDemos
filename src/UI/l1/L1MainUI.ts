class L1MainUI extends eui.Component {

    private backButton: eui.Button;
    private mainStoryButton: eui.Button;
    private roughlikeButton: eui.Button;

    constructor() {
        super();
        this.width = GameRoot.GameStage.stageWidth;
        this.height = GameRoot.GameStage.stageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToMainScene, this);
        this.mainStoryButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toL1BattleScene, this);
        this.roughlikeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toL1RoughlikeScene, this);
    }

    private backToMainScene(){
        SceneManager.Ins.setScene(new MainScene());
    }

    private toL1BattleScene(){
        UserData.l1Data.levelType = L1LevelType.MainStory;
        SceneManager.Ins.setScene(new L1NormalBattleScene());
    }

    private toL1RoughlikeScene(){
        // SceneManager.Ins.setScene(new L1RoughlikeScene());
        ToastInfoManager.newRedToast("敬请期待");
    }

}