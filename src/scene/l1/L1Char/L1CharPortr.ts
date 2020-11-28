class L1CharPortr extends eui.Component{

    private portImage: eui.Image;
    private portMask: eui.Rect;
    private angerNumCircle: eui.Rect;
    private hpNumCircle: eui.Rect;
    private angerNumMask: egret.Shape;
    private hpNumMask: egret.Shape;
    private contentGroup: eui.Group;
    public rotationCircle: eui.Group;
    private _camp: L1Camp;
    private _charId: number;

    constructor(camp:L1Camp, charId:number) {
        super();
        this._camp = camp;
        this._charId = charId;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventEndInit, this);
    }

    private UIEventEndInit() {

        // 根据角色id初始化
        this.portImage.source = `${this._charId}_portrait_png`;
        this.portImage.mask = this.portMask; // 初始化头像mask

        // 初始化血条颜色
        if(this._camp == L1Camp.Player){
            this.hpNumCircle.fillColor = ColorDef.LimeGreen;
        }else{
            this.hpNumCircle.fillColor = ColorDef.DarkRed;
        }

        // 初始化怒气条环形mask
        this.angerNumMask = new egret.Shape();
        this.addChild(this.angerNumMask);
        this.angerNumCircle.mask = this.angerNumMask;
        this.drawAngerCircle(0);

        // 初始化hp条环形mask
        this.hpNumMask = new egret.Shape();
        this.addChild(this.hpNumMask);
        this.hpNumCircle.mask = this.hpNumMask;
        this.drawHpCircle(1);

        // debug状态给角色增加一个标示
        if(DEBUG){
            let label = new eui.Label;
            label.text = `${this._charId}`;
            label.y = -30;
            label.x = 10;
            label.background = true;
            label.backgroundColor = ColorDef.AntiqueWhite;
            if(this._camp==L1Camp.Enemy)label.textColor = ColorDef.DarkRed;
            else label.textColor = ColorDef.LimeGreen;
            this.addChild(label);
        }
        
    }

    public drawHpCircle(hpPercent: number){
        this.drawCircle(this.hpNumMask, hpPercent * 360, this.hpNumCircle.width/2);
    }

    public drawAngerCircle(angerPercent: number){
        this.drawCircle(this.angerNumMask, angerPercent, this.angerNumCircle.width/2);
    }

    private drawCircle(shape: egret.Shape, endAngle: number, radius:number){
        let startAngle = -90;
        endAngle -= 90;
        Util.drawAngleCircle(shape, endAngle, radius, startAngle);
    }

    // 攻击的时候，头像向rotation方向动一下，做一下表示
    public attakAnim(){
        let tw = egret.Tween.get(this.contentGroup);
        const step = 10;
        let rad = this.rotationCircle.rotation * angle2RadParam;
        let xChange = step * Math.cos(rad);
        let yChange = step * Math.sin(rad);
        tw.to({x: -50 + xChange, y: -50 + yChange}, 200).to({x:-50, y:-50}, 200);
    }
    
}

enum L1Camp{
    Enemy = 1,
    Player = -1
}