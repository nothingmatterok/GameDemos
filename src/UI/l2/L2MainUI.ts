class L2MainUI extends eui.Component {

    private backButton: eui.Button;
    public timePointLabel: eui.Label;
    public roundLabel: eui.Label;
    public timeBarGroup: eui.Group;
    private energyBarGroup: eui.Group;
    public continueButton: eui.Button;
    private selectBarGroup: eui.Group;

    constructor() {
        super();
        this.width = GameRoot.StageWidth;
        this.height = GameRoot.StageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToMainScene, this);
        this.continueButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.continueButtonTap, this);
        this.timePointLabel.text = "0";
        this.timePointLabel.textColor = ColorDef.DarkOrange;
        this.roundLabel.text = "0";
        this.roundLabel.textColor = ColorDef.DarkOrange;
        
        // 初始化能量条管理器
        let energyBarManager = new L2EnergyBarManager(this.energyBarGroup);

        // 初始化时间轴上的头像
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let chars = scene.enemies.concat(scene.players);
        for(let char of chars){
            this.timeBarGroup.addChild(char.timeBarPort);
            char.setTime(char.attr.startTime);
        }

    }

    private backToMainScene(){
        SceneManager.Ins.setScene(new MainScene());
    }

    private continueButtonTap():void{
        this.continueButton.visible = false;
        (SceneManager.Ins.curScene as L2MainScene).isPause = false;
    }

    release() {
    }

}