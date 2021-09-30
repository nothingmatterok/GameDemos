class L2GameEndStatus extends IL2MainSceneStatus{
    public initial(){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.mainUI.gameEndGroup.visible = true;
        let endInfo:string = scene.winner == L2Camp.Player ? "战斗胜利" : "战斗失败";
        let buttonLabel:string = scene.winner == L2Camp.Player ? "下一关" : "重新开始";
        scene.mainUI.gameEndLabel.text = endInfo;
        scene.mainUI.gameEndButton.label = buttonLabel;
        scene.mainUI.gameEndButton.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            if (scene.winner == L2Camp.Player){
                ToastInfoManager.newRedToast("假装进入下一关");
            } else {
                // TODO: 等待关卡管理器实现
                ToastInfoManager.newRedToast("假装重新开始");
            }
        }, this);
        
    }
}