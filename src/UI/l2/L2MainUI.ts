class L2MainUI extends eui.Component {

    public backButton: eui.Button;
    public timePointLabel: eui.Label;
    public roundLabel: eui.Label;
    public timeBarGroup: eui.Group;
    public energyBarGroup: eui.Group;
    public selectBarGroup: eui.Group;
    public skillGroup: eui.Group;
    public skill1Button: eui.Button;
    public skill2Button: eui.Button;
    public showInfoImage: eui.Image;
    public waitButton: eui.Button;
    public battleInfo: L2BattleInfo;
    public commandButton: eui.Button;

    constructor() {
        super();
        this.width = GameRoot.StageWidth;
        this.height = GameRoot.StageHeight;
        this.battleInfo = new L2BattleInfo();
        this.addChild(this.battleInfo);
        this.battleInfo.width = GameRoot.StageWidth;
        this.battleInfo.height = GameRoot.StageHeight;
        this.battleInfo.visible = false;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToMainScene, this);
        this.timePointLabel.text = "0";
        this.timePointLabel.textColor = ColorDef.DarkOrange;
        this.roundLabel.text = "1";
        this.roundLabel.textColor = ColorDef.DarkOrange;


        // 初始化时间轴上的头像
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let chars = scene.enemies.concat(scene.players);
        for (let char of chars) {
            this.timeBarGroup.addChild(char.timeBarPort);
            char.setTime(char.attr.startTime);
        }

        this.showInfoImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showInfo, this);
        this.commandButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toCommandMod, this);
        this.waitButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.waitButtonTap, this);
    }

    public showInfo():void{
        this.battleInfo.initial();
    }

    public toCommandMod(): void{
        (SceneManager.Ins.curScene as L2MainScene).status.toCommandMod();
    }

    public waitButtonTap(): void{
        (SceneManager.Ins.curScene as L2MainScene).status.moveButtonTap();
    }

    private fires: egret.Shape[] = [];
    private static fireDis: number = 30;

    public removeFires(fireNum: number): void {
        for (let i = 0; i < fireNum; i++) {
            if (this.fires.length > 0) {
                let fire = this.fires.pop();
                this.energyBarGroup.removeChild(fire);
            }
        }
    }

    public addFires(fireNum: number): void {
        for (let i = 0; i < fireNum; i++) {
            let fire = new egret.Shape();
            Util.drawCircle(fire, 9, ColorDef.DarkOrange);
            this.fires.push(fire);
            this.energyBarGroup.addChild(fire);
            fire.x = L2MainUI.fireDis * (this.fires.length - 1);
        }
    }

    private backToMainScene() {
        (SceneManager.Ins.curScene as L2MainScene).status.back();
    }

    release() {
    }

}