/**
 * 表示一个战旗的正方形格子
 */
class L2Cell extends egret.Shape{

    public width: number;
    /**第几列 */
    public row:number;
    /**第几行 */
    public col:number;

    private defaultColor: number = ColorDef.Tan;

    /**
     * 
     * @param width 宽度
     * @param row 第几列
     * @param col 第几行
     */
    public constructor(width: number, row: number, col: number){
        super();
        this.width = width;
        // 绘制一个正方形的可点击的格子
        Util.drawSquar(this, width, this.defaultColor);
        this.touchEnabled = true;
        this.row = row;
        this.col = col;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    public changeColor(color: number){
        Util.drawSquar(this, this.width, color);
    }

    private onTap(): void{
        MessageManager.Ins.sendMessage(MessageType.L2CELLTAP, this);
        MessageManager.Ins.sendMessage(MessageType.L2USEENERGY, this)
    }
}