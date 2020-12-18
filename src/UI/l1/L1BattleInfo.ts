class L1BattleInfo extends eui.Component{
    private charNameLabel: eui.Label;
    private atkNumLabel: eui.Label;
    private defNumLabel: eui.Label;
    private rangeLabel: eui.Label;
    private critPLabel: eui.Label;
    private critRLabel: eui.Label;
    private dodgeLabel: eui.Label;
    private skillScrollerGroup: eui.Group;
    private buffScrollerGroup: eui.Group;
    private bgRect: eui.Rect;
    private maxHpLabel: eui.Label;
    private hpRateRect: eui.Rect;
    private curChar: L1Char;

    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit(){
        this.bgRect.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            this.visible = false
            this.curChar = null;
        }, this);
        MessageManager.Ins.addEventListener(MessageType.L1BATTLECHARTAP, this.charTap, this);
    }


    private charTap(msg: Message){ 
        let char:L1Char = msg.messageContent;
        this.curChar = char;
        this.visible = true;
        this.charNameLabel.text = char.name;
        this.maxHpLabel.text = `${char.maxHp}`;
        this.hpRateRect.percentWidth = char.curHp / char.maxHp * 100;
        this.atkNumLabel.text = `${char.atk}`;
        this.defNumLabel.text = `${char.def}`;
        this.dodgeLabel.text = `${char.dodgePoint}`;
        this.critPLabel.text = `${char.critPoint}`;
        this.critRLabel.text = `${char.critTime}`;
        this.rangeLabel.text = `${char.rawAttr.range}`;
        for(let i in char.skills){
            let skill = char.skills[i];
            let touchLabel: L1TouchLabel = new L1TouchLabel(skill.config.name);
            touchLabel.x = 150 * parseInt(i) + 5;
            this.skillScrollerGroup.addChild(touchLabel);
        }
        
    }

    public update(){
        if(this.curChar){
            let char = this.curChar;
            this.maxHpLabel.text = `${char.maxHp}`;
            this.hpRateRect.percentWidth = char.curHp / char.maxHp * 100;
            this.atkNumLabel.text = `${char.atk}`;
            this.defNumLabel.text = `${char.def}`;
            this.dodgeLabel.text = `${char.dodgePoint}`;
            this.critPLabel.text = `${char.critPoint}`;
            this.critRLabel.text = `${char.critTime}`;
            // TODO:跟新buff信息与技能CD信息

        }
    }

}