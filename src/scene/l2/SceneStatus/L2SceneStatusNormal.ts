abstract class IL2MainSceneStatus {
    public initial(initialInfo: any=null): void { }
    public changeTo(status: IL2MainSceneStatus, initialInfo: any=null){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.status = status;
        status.initial(initialInfo);
    }
    public charTap(char: L2Char): void { }
    public timePortTap(timePort: L2TimeBarPort): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        timePort.char.highLight();
        scene.isPause = true;
    }
    public cellTap(cell: L2Cell): void { }
    public toCommandMod(){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.focusChar = scene.players[0];
        scene.isPause = true;
        this.changeTo(new L2SceneStatusShowInfo());
    }
    public back(){
        SceneManager.Ins.setScene(new MainScene());
    }
    public moveButtonTap(){}
}

class L2SceneStatusNormal extends IL2MainSceneStatus {
    public initial() {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;
        // 状态定义
        mainUI.selectBarGroup.visible = false;
        mainUI.skillGroup.visible = false;
        mainUI.commandButton.visible = true;
        mainUI.showInfoImage.visible = false;
        scene.isPause = false;
        mainUI.commandModeLabel.visible = false;
        scene.board.resetCellsColor();
    }

    public charTap(char: L2Char): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.focusChar = char;
        this.changeTo(new L2SceneStatusShowInfo());
    }

    public cellTap(cell: L2Cell): void {
    }
}

class L2SceneStatusShowInfo extends IL2MainSceneStatus {

    private moveableCells:L2Cell[];

    public initial() {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;
        let char = scene.focusChar;
        scene.board.resetCellsColor();

        mainUI.selectBarGroup.visible = false;
        mainUI.commandButton.visible = false;
        mainUI.showInfoImage.visible = true;
        mainUI.skillGroup.visible = char.camp == L2Camp.Player;
        mainUI.skill1Button.visible = true;
        mainUI.skill2Button.visible = true;
        mainUI.commandModeLabel.visible = true;
        scene.isPause = true;

        mainUI.showInfoImage.source = `${char.config.imgName}`
        let cells = char.allMovableCells();
        this.moveableCells = cells;
        let cellColor = char.camp == L2Camp.Player ? ColorDef.LimeGreen : ColorDef.Orange;
        for(let cell of cells){
            cell.changeColor(cellColor);
        }
    }

    public charTap(char: L2Char): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.focusChar = char;
        scene.isPause = true;
        this.initial();
    }

    public cellTap(cell: L2Cell): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        if (!Util.contains(this.moveableCells, cell)){
            ToastInfoManager.newToast("退出指令模式，战斗恢复");
            this.back();
        }
        if(Util.contains(this.moveableCells, cell) && scene.focusChar.camp == L2Camp.Player){
            if (scene.energyManager.energyNum < 1){
                ToastInfoManager.newToast("移动所需能量不足");
                return;
            }
            this.changeTo(new L2SceneStatusMoveSelect(), [cell, this.moveableCells]);
            this.moveableCells = null;
        }
    }

    public back(){
        this.changeTo(new L2SceneStatusNormal());
        (SceneManager.Ins.curScene as L2MainScene).isPause = false;
    }
}

class L2SceneStatusMoveSelect extends IL2MainSceneStatus {

    private moveableCells:L2Cell[];
    private tapCell: L2Cell;

    public initial(cells:[L2Cell, L2Cell[]]) {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;
        let char = scene.focusChar;
        this.tapCell = cells[0];

        mainUI.selectBarGroup.visible = false;
        mainUI.commandButton.visible = false;
        mainUI.showInfoImage.visible = false;
        mainUI.skillGroup.visible = true;
        mainUI.skill1Button.visible = false;
        mainUI.skill2Button.visible = false;
        mainUI.commandModeLabel.visible = false;
        scene.isPause = true;

        this.moveableCells = cells[1];

        char.x = cells[0].x;
        char.y = cells[0].y;

        char.highLight();
    }

    public cellTap(cell: L2Cell): void {
        if(Util.contains(this.moveableCells, cell)){
            this.initial([cell, this.moveableCells]);
        }else{
            ToastInfoManager.newToast("超出移动范围");
        }
    }

    public back(){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let char = scene.focusChar;
        char.x = char.Cell.x;
        char.y = char.Cell.y;
        this.moveableCells = null;
        this.changeTo(new L2SceneStatusShowInfo());
    }

    public moveButtonTap(){
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.energyManager.useEnergy(1);
        scene.focusChar.Cell = this.tapCell;
        this.moveableCells = null;
        this.tapCell = null;
        this.changeTo(new L2SceneStatusShowInfo());
    }

}