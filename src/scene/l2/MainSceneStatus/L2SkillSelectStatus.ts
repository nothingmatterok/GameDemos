/**
 * 选择技能后的状态，进入技能目标选择状态
 */
class L2SkillSelectStatus extends IL2MainSceneStatus {

    private skillOrder: number;
    private isSelectOver: boolean;
    private selectCharTarget: L2Char;
    private selectCellTarget: L2Cell;
    private canSelectCharTargets: L2Char[];
    private canSelectCellTargets: L2Cell[];
    private effectCells: L2Cell[];
    private skillCfg: L2SkillCfg;

    public initial(initialInfos: any[]) {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let mainUI = scene.mainUI;
        let char = scene.FocusChar;
        let skillOrder: number = initialInfos[0];
        this.skillOrder = skillOrder;
        let skillCfg = L2Config.SkillCfg[char.config.skillIds[skillOrder]];
        this.skillCfg = skillCfg;
        this.isSelectOver = false;

        // 定义状态
        scene.board.resetCellsColor();
        mainUI.selectBarGroup.visible = false;
        mainUI.commandButton.visible = false;
        mainUI.showInfoImage.visible = false;
        mainUI.moveButton.visible = false;
        mainUI.skill1Button.visible = false;
        mainUI.skill2Button.visible = false;
        mainUI.confirmButton.visible = true;
        mainUI.disConfirmButton.visible = true;
        mainUI.commandModeLabel.visible = false;
        mainUI.skillInfoLabel.visible = true;
        scene.isPause = true;

        // 组件初始化
        mainUI.skillInfoLabel.text = skillCfg.description;
        // 高亮所有可释放范围
        let skillRangeCells: L2Cell[] = char.Cell.rangeCells(skillCfg.castRange);
        for (let cell of skillRangeCells) {
            cell.changeColor(ColorDef.Orange);
        }
        // 标注可选择角色/cell
        // 如果是自动选择类型直接返回
        if (skillCfg.targetSelectType == L2SkTgtSeltType.Auto) {
            this.isSelectOver = true;
            return;
        }
        // 如果不是自动选择，筛选出可选择范围
        if (skillCfg.targetSelectType == L2SkTgtSeltType.AlliesCharWithoutSelf ||
            skillCfg.targetSelectType == L2SkTgtSeltType.AlliesCharWithSelf ||
            skillCfg.targetSelectType == L2SkTgtSeltType.OpposeChar
        ) {
            let allies = char.camp == L2Camp.Player ? scene.players : scene.enemies;
            let oppose = char.camp == L2Camp.Player ? scene.enemies : scene.players;
            this.canSelectCharTargets = [];
            switch (skillCfg.targetSelectType) {
                case L2SkTgtSeltType.AlliesCharWithoutSelf:
                    for (let al of allies) {
                        if (al != char && char.disToChar(al) <= skillCfg.castRange)
                            this.canSelectCharTargets.push(al)
                    }
                    break;
                case L2SkTgtSeltType.AlliesCharWithSelf:
                    for (let al of allies) {
                        if (char.disToChar(al) <= skillCfg.castRange) {
                            this.canSelectCharTargets.push(al)
                        }
                    }
                    break;
                case L2SkTgtSeltType.OpposeChar:
                    for (let op of oppose) {
                        if (char.disToChar(op) <= skillCfg.castRange) {
                            this.canSelectCharTargets.push(op)
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        // 如果是格点类型，加入所有格点，格点类型需要注意，如果点击到的char属于格点，应触发格点选择反应
        if (skillCfg.targetSelectType == L2SkTgtSeltType.Cell) {
            this.canSelectCellTargets = skillRangeCells;
        }
    }

    public charTap(char: L2Char): void {
        // 如果不属于可能的范畴
        if (!(this.skillCfg.targetSelectType == L2SkTgtSeltType.AlliesCharWithoutSelf ||
            this.skillCfg.targetSelectType == L2SkTgtSeltType.AlliesCharWithSelf ||
            this.skillCfg.targetSelectType == L2SkTgtSeltType.OpposeChar ||
            this.skillCfg.targetSelectType == L2SkTgtSeltType.Cell
        )) { return; }
        // 如果是点击格点类，且点击的角色属于该地格范畴内
        if (this.skillCfg.targetSelectType == L2SkTgtSeltType.Cell) {
            if (Util.contains(this.canSelectCellTargets, char.Cell)) {
                // 如果已经有选择了，原来的格子颜色恢复，新的格子颜色变色
                if (this.selectCellTarget) {
                    this.selectCellTarget.unSelect();
                }
                this.selectCellTarget = char.Cell;
                this.selectCellTarget.onSelect();
                // 影响范围全部进行一次刷新
                this.refreshEffectCells(char.Cell);
                this.isSelectOver = true;
            }
            return;
        }
        // 如果是点击角色类型
        if (Util.contains(this.canSelectCharTargets, char)) {
            if (this.selectCharTarget) {
                this.selectCharTarget.unSelect();
            }
            this.selectCharTarget = char;
            char.onSelect();
            this.refreshEffectCells(char.Cell);
            this.isSelectOver = true;
            return;
        }

    }

    private refreshEffectCells(newCell: L2Cell) {
        // 刷新影响范围地格现实
        if (this.effectCells) {
            for (let cell of this.effectCells) {
                cell.unSelect();
            }
        }
        this.effectCells = newCell.rangeCells(this.skillCfg.effectRange);
        for (let cell of this.effectCells) {
            cell.onSelect();
        }
    }

    public disConfirmButtonTap() {
        this.back();
    }

    public cellTap(cell: L2Cell) {
        if (this.skillCfg.targetSelectType == L2SkTgtSeltType.Cell &&
            Util.contains(this.canSelectCellTargets, cell)) {
            // 如果已经有选择了，原来的格子颜色恢复，新的格子颜色变色
            if (this.selectCellTarget) {
                this.selectCellTarget.unSelect();
            }
            cell.onSelect();
            this.refreshEffectCells(cell);
            this.selectCellTarget = cell;
            this.isSelectOver = true;
        }
    }

    public confirmButtonTap(): void {
        if (!this.isSelectOver) {
            ToastInfoManager.newRedToast("请选择目标后再释放");
            return;
        }
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let char = scene.FocusChar;
        let skillCfg = L2Config.SkillCfg[char.config.skillIds[this.skillOrder]];
        let canCastInfos = skillCfg.canCast(char);
        if (!canCastInfos[0]) {
            // 如果不满足释放条件
            ToastInfoManager.newRedToast(canCastInfos[1]);
            return;
        }
        scene.skillManager.pushSkill(
            L2Config.SkillCfg[char.config.skillIds[this.skillOrder]], char, {
                "targetChar": this.selectCharTarget,
                "targetCell": this.selectCellTarget
            }
        );
        this.changeTo(new L2CmdModSceneStatus())
    }

    public changeTo(status: IL2MainSceneStatus, initialInfos: any[] = null) {
        if (this.effectCells) {
            for (let cell of this.effectCells) {
                cell.unSelect();
            }
        }
        if (this.selectCellTarget) {
            this.selectCellTarget.unSelect();
        }
        if (this.selectCharTarget) {
            this.selectCharTarget.unSelect();
        }
        super.changeTo(status, initialInfos);
    }

    public back() {
        this.changeTo(new L2CharSelectSceneStatus());
    }

    public release() {
        this.selectCharTarget = null;
        this.selectCellTarget = null;
        this.canSelectCharTargets = null;
        this.canSelectCellTargets = null;
        this.effectCells = null;
        this.skillCfg = null;
    }
}