class L1BattleSceneUI extends eui.Component{
    private backButton: eui.Button;
    private battleStartButton: eui.Button;
    private portScroller: eui.Scroller;
    private portImageGroup: eui.Group;
    private _selectIds: number[];// 已上场数量
    private nextLevelButton: eui.Button;

    constructor() {
        super();
        this.width = GameRoot.GameStage.stageWidth;
        this.height = GameRoot.GameStage.stageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
        this._selectIds = [];
    }

    public battleEnd(){
        this.nextLevelButton.visible = true;
    }

    private UIEventInit() {
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backToL1MainScene, this);
        this.battleStartButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.battleStart, this);
        this.nextLevelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.toNextLevel, this);
        MessageManager.Ins.addEventListener(MessageType.L1BATTLEUIPORTTAP, this.portTap, this);

        for(let i =0;i<UserData.l1Data.UserAllCharIds.length;i++){
            let charId = UserData.l1Data.UserAllCharIds[i];
            let port = new L1BattleUIPort(charId);
            port.x = 90 * i;
            this.portImageGroup.addChild(port);
            
            if(UserData.l1Data.UserUseCharIds.indexOf(charId) >= 0){
                port.select();
                this._selectIds.push(port.charId);
            }
        }

    }

    private toNextLevel(){
        SceneManager.Ins.setScene(new L1NormalBattleScene());
    }

    private portTap(msg: Message){
        let port: L1BattleUIPort = msg.messageContent;
        let charId = port.charId;
        let scene = SceneManager.Ins.curScene as L1NormalBattleScene;
        // 如果选中
        if(port.IsSelect){
            port.selectCancle();
            Util.removeObjFromArray(this._selectIds, port.charId);
            scene.removeChar(charId);
            return;
        }
        if (this._selectIds.length == 4){
                ToastInfoManager.newRedToast("已满员");
                return;
        } 

        // 未选中且未满员
        port.select();
        this._selectIds.push(port.charId);
        scene.addChar(charId);
    }

    private backToL1MainScene(){
        SceneManager.Ins.setScene(new L1MainScene());
    }

    private battleStart(){
        if(this._selectIds.length == 0){
            ToastInfoManager.newRedToast("无上场成员");
            return;
        }
        // 更新上场id
        UserData.l1Data.UserUseCharIds = this._selectIds;
        this.battleStartButton.visible = false;
        (SceneManager.Ins.curScene as L1NormalBattleScene).battleStart();
        this.portScroller.visible = false;
    }

}