class L1BattleSceneUI extends eui.Component{
    private backButton: eui.Button;
    private battleStartButton: eui.Button;

    constructor() {
        super();
        this.width = GameRoot.GameStage.stageWidth;
        this.height = GameRoot.GameStage.stageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToL1MainScene, this);
        this.battleStartButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.battleStart, this);
    }

    private backToL1MainScene(){
        SceneManager.Ins.setScene(new L1MainScene());
    }

    private battleStart(){
        this.battleStartButton.visible = false;
        (SceneManager.Ins.curScene as L1NormalBattleScene).battleStart();
    }

}