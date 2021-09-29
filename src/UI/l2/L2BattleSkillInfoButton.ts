class L2BattleSkillInfoButton extends eui.Button{

    private description: string;

    public constructor(name: string, description: string){
        super();
        this.description = description;
        this.width = 100;
        this.height = 100;
        this.label = name;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    private UIEventInit(){
        (<eui.Label>this.labelDisplay).size = 16;
    }

    private onTap(){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let battleInfo = scene.mainUI.battleInfo;
        battleInfo.descrLabel.text = this.description;
        battleInfo.descrGroup.visible = true;
    }


}

