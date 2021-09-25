class L2TimeBarPort extends eui.Group{

    private charTimeLabel: eui.Label;
    private static charTimeLabelSize:number = 18;
    private static barPortWidth: number = 40;
    private static barWidthOffset: number = 80; // 和stage宽度比，时间条短多少
    public char: L2Char;

    public constructor(char:L2Char){
        super();
        this.char = char;
        this.width = L2TimeBarPort.barPortWidth;
        this.height = this.width;

        // 构建头像
        let width = L2TimeBarPort.barPortWidth;
        let img = new eui.Image(char.config.imgName);
        img.width = width * 1.6;
        img.height = img.width;
        let offset = (img.width - width) / 2;
        img.mask = new egret.Rectangle(offset, offset, width, width);
        this.addChild(img);
        img.x = -offset;
        img.y = -offset;

        // 增加数字表示该角色的顺位
        this.charTimeLabel = new eui.Label();
        this.charTimeLabel.textColor = ColorDef.DarkRed;
        this,this.charTimeLabel.background = true;
        this.charTimeLabel.backgroundColor = ColorDef.AntiqueWhite;
        this.charTimeLabel.textColor = char.camp == L2Camp.Player ? ColorDef.LimeGreen : ColorDef.DarkRed;
        this.charTimeLabel.size = L2TimeBarPort.charTimeLabelSize;
        this.charTimeLabel.text = "0";
        this.addChild(this.charTimeLabel);

        // 增加点击事件
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    private onTap(): void {
        // 如果被点击了，就拉到最高层级
        this.moveToTop();
        MessageManager.Ins.sendMessage(MessageType.L2TIMEPORTTAP, this);
    }

    public moveToTop(): void{
        this.parent.addChild(this);
    }

    public setTime(nowTime: number): void{
        let barWidth = GameRoot.StageWidth - L2TimeBarPort.barWidthOffset;
        this.x = barWidth * nowTime / 100;
        this.charTimeLabel.text = `${nowTime}`;
    }

    public release(){
        this.char = null;
    }
}