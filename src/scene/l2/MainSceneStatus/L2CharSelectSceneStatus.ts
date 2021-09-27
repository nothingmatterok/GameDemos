/**
 * 命令模式主要状态，即从当前的技能列表播放完成后暂停，展示一个角色的移动范围
 * 可以进入到角色信息查看/移动选择状态/技能选择状态
 */
class L2CharSelectSceneStatus extends IL2MainSceneStatus {

    private moveableCells:L2Cell[];

    public initial() {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;
        let char = scene.FocusChar;

        // 定义状态
        scene.board.resetCellsColor();
        mainUI.selectBarGroup.visible = false;
        mainUI.commandButton.visible = false;
        mainUI.showInfoImage.visible = true;
        let skillButtonVisible = char.camp == L2Camp.Player;
        mainUI.skill1Button.visible = skillButtonVisible;
        mainUI.skill2Button.visible = skillButtonVisible;
        mainUI.moveButton.visible = false;
        mainUI.confirmButton.visible = false;
        mainUI.disConfirmButton.visible = false;
        mainUI.commandModeLabel.visible = true;
        mainUI.skillInfoLabel.visible = false;
        scene.isPause = true;

        mainUI.showInfoImage.source = `${char.config.imgName}`
        
        // 更改可移动格点颜色
        let cells = char.allMovableCells();
        this.moveableCells = cells;
        let cellColor = char.camp == L2Camp.Player ? ColorDef.LimeGreen : ColorDef.Orange;
        for(let cell of cells){
            cell.changeColor(cellColor);
        }
    }

    public charTap(char: L2Char): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.FocusChar = char;
        this.initial();
    }

    public cellTap(cell: L2Cell): void {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        if (!Util.contains(this.moveableCells, cell)){
            this.back();
        }
        if(Util.contains(this.moveableCells, cell) && scene.FocusChar.camp == L2Camp.Player){
            if (scene.energyManager.energyNum < 1){
                ToastInfoManager.newRedToast("移动所需能量不足");
                return;
            }
            this.changeTo(new L2MoveSelectSceneStatus(), [[cell, this.moveableCells]]);
            this.moveableCells = null;
        }
    }

    public back(){
        ToastInfoManager.newRedToast("退出指令模式，战斗恢复");
        this.changeTo(new L2NormalSceneStatus());
    }

    public skill1ButtonTap(){
        this.changeToSkillSelect(0);
    }

    public skill2ButtonTap(){
        this.changeToSkillSelect(1);
    }

    private changeToSkillSelect(skillOrder: number): void{
        this.changeTo(new L2SkillSelectStatus(), [skillOrder]);
    }
}