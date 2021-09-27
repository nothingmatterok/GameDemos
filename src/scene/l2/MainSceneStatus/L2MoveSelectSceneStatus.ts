/**
 * 移动选择状态，表示玩家选择了一个移动范围中的格子
 * 返回回到命令模式主状态，聚焦于当前聚焦的目标
 * 点击移动，将聚焦目标移动到目标点，同样回到命令模式主状态，聚焦于当前聚焦的目标
 * 此时点击角色不做任何响应
 * 点击其他可移动范围，
 */
class L2MoveSelectSceneStatus extends IL2MainSceneStatus {

    private moveableCells:L2Cell[];
    private tapCell: L2Cell;

    public initial(initialInfos: [[L2Cell, L2Cell[]]]) {
        // 解析信息
        let cells = initialInfos[0];
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;
        let char = scene.FocusChar;
        this.tapCell = cells[0];

        // 定义状态
        mainUI.selectBarGroup.visible = false;
        mainUI.commandButton.visible = false;
        mainUI.showInfoImage.visible = false;
        mainUI.skill1Button.visible = false;
        mainUI.skill2Button.visible = false;
        mainUI.confirmButton.visible = false;
        mainUI.disConfirmButton.visible = false;
        mainUI.moveButton.visible = true;
        mainUI.commandModeLabel.visible = false;
        mainUI.skillInfoLabel.visible = false;
        scene.isPause = true;

        // 初始化
        this.moveableCells = cells[1];
        char.x = cells[0].x;
        char.y = cells[0].y;
        char.highLight();
    }

    public cellTap(cell: L2Cell): void {
        if(Util.contains(this.moveableCells, cell)){
            this.initial([[cell, this.moveableCells]]);
        }else{
            this.back();
        }
    }

    public back(){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let char = scene.FocusChar;
        char.x = char.Cell.x;
        char.y = char.Cell.y;
        this.moveableCells = null;
        this.changeTo(new L2CharSelectSceneStatus());
    }

    public moveButtonTap(){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.energyManager.useEnergy(1);
        scene.FocusChar.Cell = this.tapCell;
        this.moveableCells = null;
        this.tapCell = null;
        this.changeTo(new L2CharSelectSceneStatus());
    }

}