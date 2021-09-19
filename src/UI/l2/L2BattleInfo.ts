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
    private descrGroup: eui.Group;
    private descrLabel: eui.Label;

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
        let char = scene.focusChar;
        this.visible = true;
        this.charNameLabel.text = char.name;
        this.maxHpLabel.text = `${char.attr.maxHp}`;
        this.hpRateRect.percentWidth = char.HP / char.attr.maxHp * 100;
        this.atkNumLabel.text = `${char.attr.atk}`;
        this.defNumLabel.text = `${char.attr.def}`;
        this.actionSpeedLabel.text = `${char.attr.actionSpeed}`;
        this.moveRangeLabel.text = `${char.attr.moveRange}`;
        this.atkRangeLabel.text = `${char.attr.atkRange}`;
        // 技能组信息初始化

        // 状态组信息初始化

        // 隐藏info面板
        this.descrGroup.visible = false;
    }

}