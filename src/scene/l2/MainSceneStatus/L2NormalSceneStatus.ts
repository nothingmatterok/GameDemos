class L2NormalSceneStatus extends IL2MainSceneStatus {
    public initial() {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;
        // 状态定义
        scene.board.resetCellsColor();
        mainUI.selectBarGroup.visible = false;
        mainUI.commandButton.visible = true;
        mainUI.showInfoImage.visible = false;
        mainUI.moveButton.visible = false;
        mainUI.skill1Button.visible = false;
        mainUI.skill2Button.visible = false;
        mainUI.confirmButton.visible = false;
        mainUI.disConfirmButton.visible = false;
        mainUI.commandModeLabel.visible = false;
        mainUI.skillInfoLabel.visible = true;
        scene.isPause = false;
    }

    public charTap(char: L2Char): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.FocusChar = char;
        this.changeTo(new L2CharSelectSceneStatus());
    }

}

