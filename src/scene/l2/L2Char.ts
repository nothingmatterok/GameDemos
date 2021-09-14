class L2Char extends eui.Group{

    private static hpBoardWidth:number = 3; // 周围一圈血条宽度

    public timeBarPort: L2TimeBarPort;    
    private hpMask: egret.Shape;
    private bgWidth: number;
    

    // 角色属性
    public attr: L2CharAttr;

    // 运行时状态
    private nowTime: number = 0;
    public timePrior: number = 100; // 时间权重，正常为100，0最大
    public camp: L2Camp;
    private hp: number;
    public isDead: boolean;

    public get HP(): number{
        return this.hp;
    }

    public hpChange(hpChangeNum: number):number{
        // 更新血量
        let newHp = hpChangeNum + this.hp;
        if (newHp > 0){
            this.hp = newHp;
        } else {
            this.hp = 0;
        }
        this.drawHpCircle(this.hp / this.attr.maxHp);

        // 执行死亡
        if(this.hp == 0){
            this.isDead = true;
            Util.safeRemoveFromParent(this);
        }

        // 返回当前血量
        return this.hp;
    }

    public get NowTime(): number{return this.nowTime;}

    public constructor(width:number, imgName: string, camp:L2Camp){
        super();
        this.camp = camp;
        this.bgWidth = width;
        this.width = width;
        this.height = width;
        this.isDead = false;
        this.attr = new L2CharAttr();

        // 构建血条底色，绿色表示我方，红色表示敌方
        let hpBg = new egret.Shape();
        let bgColor = camp == L2Camp.Player ? ColorDef.LimeGreen : ColorDef.DarkRed;
        Util.drawSquar(hpBg, width, bgColor);
        this.addChild(hpBg);
        this.hpMask = new egret.Shape();
        hpBg.mask = this.hpMask;
        this.addChild(this.hpMask);
        this.drawHpCircle(1);

        // 构建头像
        let imgWidth = width - L2Char.hpBoardWidth * 2;
        let img = new eui.Image(imgName);
        img.width = imgWidth * 1.6;
        img.height = img.width;
        let offset = (img.width - imgWidth) / 2;
        img.mask = new egret.Rectangle(offset, offset, imgWidth, imgWidth);
        this.addChild(img);
        img.x = - offset + L2Char.hpBoardWidth;
        img.y = img.x;
        
        // 构建时间轴上的头像，在MainUI中intial完毕后统一加入到轴上
        this.timeBarPort = new L2TimeBarPort(imgName, this);


        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    private onTap(): void {
        MessageManager.Ins.sendMessage(MessageType.L2CHARTAP, this);
    }

    public setTime(nowTime: number):void{
        this.nowTime = nowTime;
        this.timeBarPort.setTime(nowTime);
    }

    public highLight(): void{
        egret.Tween.get(this).to({alpha:0.2}, 500).to({alpha:1},500);
    }

    private drawCircle(shape: egret.Shape, endAngle: number, radius:number){
        let startAngle = -90;
        endAngle -= 90;
        Util.drawAngleCircle(shape, endAngle, radius, startAngle);
    }

    public drawHpCircle(hpPercent: number){
        this.hpMask.x = 0
        this.hpMask.y = 0;
        this.drawCircle(this.hpMask, hpPercent * 360, this.bgWidth);
        this.hpMask.x = this.bgWidth/2;
        this.hpMask.y = this.bgWidth/2;
    }

    public startAction(): void {
        egret.Tween.get(this).to({scaleX:0.2, scaleY:0.2}, 1000).to({scaleX:1, scaleY:1}, 1000).call(()=>{
            (SceneManager.Ins.curScene as L2MainScene).isCharActionEnd = true;
        });
    }

    public release(): void{
        this.timeBarPort.release();
        this.timeBarPort = null;
        this.hpMask = null;
    }

}

enum L2Camp{
    Enemy = 1,
    Player = -1
}