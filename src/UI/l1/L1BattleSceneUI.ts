class L1BattleSceneUI extends eui.Component{
    private backButton: eui.Button;
    private battleStartButton: eui.Button;
    private portScroller: eui.Scroller;
    private portImageGroup: eui.Group;
    private _selectNum: number;// 已上场数量

    constructor() {
        super();
        this.width = GameRoot.GameStage.stageWidth;
        this.height = GameRoot.GameStage.stageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
        this._selectNum = 0;
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToL1MainScene, this);
        this.battleStartButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.battleStart, this);
        MessageManager.Ins.addEventListener(MessageType.L1BATTLEUIPORTTAP, this.portTap, this);

        for(let i =0;i<UserData.l1Data.userAllCharIds.length;i++){
            let charId = UserData.l1Data.userAllCharIds[i];
            let port = new L1BattleUIPort(charId);
            port.x = 90 * i;
            this.portImageGroup.addChild(port);
            
            if(UserData.l1Data.userUseCharIds.indexOf(charId) >= 0){
                port.select();
                this._selectNum += 1;
            }
        }

    }

    private portTap(msg: Message){
        let port: L1BattleUIPort = msg.messageContent;
        let charId = port.charId;
        let scene = SceneManager.Ins.curScene as L1NormalBattleScene;
        // 如果选中
        if(port.IsSelect){
            port.selectCancle();
            this._selectNum -= 1;
            scene.removeChar(charId);
            return;
        }
        if (this._selectNum == 4){
                ToastInfoManager.newRedToast("已满员");
                return;
        } 

        // 未选中且未满员
        port.select();
        this._selectNum += 1;
        scene.addChar(charId);
    }

    private backToL1MainScene(){
        SceneManager.Ins.setScene(new L1MainScene());
    }

    private battleStart(){
        if(this._selectNum == 0){
            ToastInfoManager.newRedToast("无上场成员");
            return;
        }
        this.battleStartButton.visible = false;
        (SceneManager.Ins.curScene as L1NormalBattleScene).battleStart();
        this.portScroller.visible = false;
    }

}