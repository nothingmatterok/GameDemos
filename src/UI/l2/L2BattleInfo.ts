class L2BattleInfo extends eui.Component{
    private charNameLabel: eui.Label;
    private atkNumLabel: eui.Label;
    private defNumLabel: eui.Label;
    private atkRangeLabel: eui.Label;
    private actionSpeedLabel: eui.Label;
    private moveRangeLabel: eui.Label;
    private skillScrollerGroup: eui.Group;
    private buffScrollerGroup: eui.Group;
    private bgRect: eui.Rect;
    private maxHpLabel: eui.Label;
    private hpRateRect: eui.Rect;
    public descrGroup: eui.Group;
    public descrLabel: eui.Label;

    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit(){
        this.bgRect.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            this.visible = false
        }, this);
    }

    public initial(){ 
        let scene = SceneManager.Ins.curScene as L2MainScene;
        let char = scene.FocusChar;
        this.visible = true;
        this.charNameLabel.text = char.config.name;
        this.maxHpLabel.text = `${char.attr.maxHp}`;
        this.hpRateRect.percentWidth = char.HP / char.attr.maxHp * 100;
        this.hpRateRect.fillColor = char.camp == L2Camp.Player ? ColorDef.LimeGreen : ColorDef.Red;
        this.atkNumLabel.text = `${char.attr.atk}`;
        this.defNumLabel.text = `${char.attr.def}`;
        this.actionSpeedLabel.text = `${char.attr.actionSpeed}`;
        this.moveRangeLabel.text = `${char.attr.moveRange}`;
        this.atkRangeLabel.text = `${char.attr.atkRange}`;
        // 技能组信息初始化
        let skillIds = new Array(char.config.normalAtkSkillId, ...char.config.skillIds);
        for(let i in skillIds){
            let config = L2Config.SkillCfg[skillIds[i]];
            let button = new L2BattleSkillInfoButton(`${config.name}`, config.description);
            this.skillScrollerGroup.addChild(button);
            button.x = 10 + 120 * parseInt(i);
            button.y = 10;
        }
        // 状态组信息初始化
        for(let i in char.buffs.data){
            let buff = char.buffs.data[i];
            let config = buff.config;
            let button = new L2BattleSkillInfoButton(`${config.name}\n\n剩余回合: ${buff.duration}`, config.description);
            this.buffScrollerGroup.addChild(button);
            button.x = 10 + 120 * parseInt(i);
            button.y = 10
        }

        // 隐藏info面板
        this.descrGroup.visible = false;
    }

}