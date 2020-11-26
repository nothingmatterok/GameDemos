class L1CharPortr extends eui.Component{

    private portImage: eui.Image;
    private portMask: eui.Rect;
    private angerNumCircle: eui.Rect;
    private hpNumCircle: eui.Rect;
    private angerNumMask: egret.Shape;
    private hpNumMask: egret.Shape;
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
        
    }

    private drawHpCircle(hpPercent: number){
        this.drawCircle(this.hpNumMask, hpPercent * 360, this.hpNumCircle.width/2);
    }

    private drawAngerCircle(angerPercent: number){
        this.drawCircle(this.angerNumMask, angerPercent, this.angerNumCircle.width/2);
    }

    private drawCircle(shape: egret.Shape, endAngle: number, radius:number){
        let startAngle = -90;
        endAngle -= 90;
        Util.drawAngleCircle(shape, endAngle, radius, startAngle);
    }

    
}

enum L1Camp{
    Enemy = 1,
    Player = -1
}