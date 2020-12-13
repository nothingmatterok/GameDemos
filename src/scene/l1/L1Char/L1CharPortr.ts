class L1CharPortr extends eui.Component{

    private portImage: eui.Image;
    private portMask: eui.Rect;
    private angerNumCircle: eui.Rect;
    private hpNumCircle: eui.Rect;
    private angerNumMask: egret.Shape;
    private hpNumMask: egret.Shape;
    public contentGroup: eui.Group;
    public rotationCircle: eui.Group;
    public rotationPoint: eui.Rect;
    private _camp: L1Camp;
    public initialed: boolean;
    private dizzLabel: eui.Label;
    private slientLabel: eui.Label;

    constructor(camp:L1Camp, private _portImage:string, private _charId: number = 0) {
        super();
        this._camp = camp;
        this.initialed = false;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventEndInit, this);
    }

    private UIEventEndInit() {

        // 根据角色id初始化
        this.portImage.source = this._portImage;
        this.portImage.mask = this.portMask; // 初始化头像mask

        // 初始化血条颜色
        if(this._camp == L1Camp.Player){
            this.hpNumCircle.fillColor = ColorDef.LimeGreen;
        }else{
            this.hpNumCircle.fillColor = ColorDef.DarkRed;
        }

        // 初始化怒气条环形mask
        this.angerNumMask = new egret.Shape();
        this.contentGroup.addChild(this.angerNumMask);
        this.angerNumCircle.mask = this.angerNumMask;
        this.drawAngerCircle(0);

        // 初始化hp条环形mask
        this.hpNumMask = new egret.Shape();
        this.contentGroup.addChild(this.hpNumMask);
        this.hpNumCircle.mask = this.hpNumMask;
        this.drawHpCircle(1);

        // 初始化方向点颜色
        this.rotationPoint.fillColor = this._camp == L1Camp.Player ? ColorDef.LimeGreen : ColorDef.DarkRed;

        // debug状态给角色增加一个标示
        if(DEBUG){
            let label = new eui.Label;
            label.text = `${this._charId}`;
            label.y = 20;
            label.x = 60;
            label.background = true;
            label.backgroundColor = ColorDef.AntiqueWhite;
            if(this._camp==L1Camp.Enemy)label.textColor = ColorDef.DarkRed;
            else label.textColor = ColorDef.LimeGreen;
            this.contentGroup.addChild(label);
        }
        
        this.initialed = true;
    }

    public drawHpCircle(hpPercent: number){
        this.hpNumMask.x = 0
        this.hpNumMask.y = 0;
        this.drawCircle(this.hpNumMask, hpPercent * 360, this.hpNumCircle.width/2);
        this.hpNumMask.x = this.contentGroup.width/2;
        this.hpNumMask.y = this.contentGroup.width/2;
    }

    public drawAngerCircle(angerPercent: number){
        this.angerNumMask.x = 0
        this.angerNumMask.y = 0;
        this.drawCircle(this.angerNumMask, angerPercent * 360, this.angerNumCircle.width/2);
        this.angerNumMask.x = this.contentGroup.width/2;
        this.angerNumMask.y = this.contentGroup.width/2;
    }

    private drawCircle(shape: egret.Shape, endAngle: number, radius:number){
        let startAngle = -90;
        endAngle -= 90;
        Util.drawAngleCircle(shape, endAngle, radius, startAngle);
    }

    public startAnim(posList:Array<[number, number]>, durations: Array<number>){
        egret.Tween.removeTweens(this.contentGroup);
        let rad = this.rotationCircle.rotation * angle2RadParam;
        let startPos = posList[0];
        let [startXRot, startYRot] = this.getAngleCoorSysPos(startPos, rad);
        this.contentGroup.x = startXRot;
        this.contentGroup.y = startYRot;
        let tw = egret.Tween.get(this.contentGroup);
        for(let i=0; i<durations.length;i++){
            let [nextXRot, nextYRot] = this.getAngleCoorSysPos(posList[i+1], rad);
            let duration = durations[i];
            tw.to({x:nextXRot, y:nextYRot}, duration);
        }
    }

    /**
     * 获取在常规坐标系坐标为pos的点，如果换到往逆时针方向rad角度的坐标系中
     * 其坐标是多少
     * @param pos 
     * @param rad 
     */
    private getAngleCoorSysPos(pos:[number, number], rad:number): [number, number]{
        let x = pos[0];
        let y = pos[1];
        let cosR = Math.cos(-rad);
        let sinR = Math.sin(-rad);
        let x1 = x * cosR + y * sinR;
        let y1 = y * cosR - x * sinR;
        return [x1, y1];
    }

    public toDizz(){
        this.dizzLabel.visible = true;
    }

    public outDizz(){
        this.dizzLabel.visible = false;
    }

    public toSlient(){
        this.slientLabel.visible = true;
    }

    public outSlient(){
        this.slientLabel.visible = false;
    }

    
}

enum L1Camp{
    Enemy = 1,
    Player = -1
}