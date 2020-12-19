class L1TouchLabel extends eui.Component {
    private nameLabel: eui.Label;
    private cdRect: eui.Rect;
    private skillPreStateLabel: eui.Label;
    private buffTierLabel: eui.Label;
    private skillCDLabel: eui.Label;

    public info: [L1Skill, L1Char, L1BuffConfig, number];

    public constructor(skill: L1Skill, char: L1Char, buffConfig: L1BuffConfig, buffTier: number) {
        super();
        this.info = [skill, char, buffConfig, buffTier];
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private isCurSkill(): boolean {
        let char = this.info[1];
        let skill = this.info[0];
        return char.skills[char.curSkillIndex] == skill;
    }

    private UIEventInit() {
        let [skill, _, buffConfig, buffTier] = this.info;
        if (skill) {
            this.nameLabel.text = skill.config.name;
            this.skillCDLabel.visible = true;
            let cdStr = (skill.config.cdMs / 1000).toFixed(2);
            this.skillCDLabel.text = `${cdStr}s`;
        }
        if (buffConfig) {
            this.nameLabel.text = buffConfig.name;
            this.buffTierLabel.visible = true;
            this.buffTierLabel.text = `x${buffTier}`;
        }
        this.width = 100;
        this.height = 100;
        this.y = 10;

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            MessageManager.Ins.sendMessage(MessageType.L1TOUCHLABELTAP, this);
        }, this);
        
    }

    public updateSkillCd() {
        let skill = this.info[0]
        if (skill) {
            let curCDS = skill.CDRUN / GameRoot.GameStage.frameRate;
            if (curCDS == 0) {
                this.skillCDLabel.visible = false;
            } else {
                this.skillCDLabel.visible = true;
                let curCDSstr = curCDS.toFixed(2);
                this.skillCDLabel.text = `${curCDSstr}s`;
            }
            this.cdRect.percentWidth = curCDS * 100000 / skill.config.cdMs;
            if (this.isCurSkill()) {
                this.skillPreStateLabel.visible = true;
            } else {
                this.skillPreStateLabel.visible = false;
            }
        }
    }

}