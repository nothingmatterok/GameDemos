class L2CmdModSceneStatus extends IL2MainSceneStatus{
    public initial() {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;

        // 定义状态
        scene.board.resetCellsColor();
        mainUI.selectBarGroup.visible = false;
        mainUI.commandButton.visible = false;
        mainUI.showInfoImage.visible = false;
        mainUI.skill1Button.visible = false;
        mainUI.skill2Button.visible = false;
        mainUI.moveButton.visible = false;
        mainUI.confirmButton.visible = false;
        mainUI.disConfirmButton.visible = false;
        mainUI.commandModeLabel.visible = true;
        mainUI.skillInfoLabel.visible = false;
        scene.isPause = true;
    }

    public charTap(char: L2Char): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.FocusChar = char;
        this.changeTo(new L2CharSelectSceneStatus());
    }

    public cellTap(): void{
        this.back();
    }

    public back(): void{
        ToastInfoManager.newRedToast("退出指令模式，战斗恢复");
        this.changeTo(new L2NormalSceneStatus());
    }
}