/**
 * 表示一个战旗的正方形格子
 */
class L2Cell extends egret.Shape{

    public width: number;
    /**第几列 */
    public rowX:number;
    /**第几行 */
    public colY:number;

    private defaultColor: number = ColorDef.Tan;

    public char: L2Char;

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
        this.rowX = row;
        this.colY = col;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    public changeColor(color: number){
        Util.drawSquar(this, this.width, color);
    }

    public disTo(otherCell: L2Cell): number{
        return Math.abs(otherCell.colY - this.colY) + Math.abs(otherCell.rowX - this. rowX);
    }

    /**
     * 所有和自己range范围内的格子，包含自己，不考虑不可行走等情况
     * @param range 范围
     */
    public rangeCells(range: number): L2Cell[]{
        return (SceneManager.Ins.curScene as L2MainScene).board.rangeCells(this, range);
    }

    /**
     * 获取相邻格子
     */
    public getBetweenCells(): L2Cell[]{
        return (SceneManager.Ins.curScene as L2MainScene).board.getBetweenCells(this);
    }

    public onSelect(){
        if (!this.filters){
            L2Filters.addYellowGlow(this);
        }
    }

    public unSelect(){
        this.filters = null;
    }

    private onTap(): void{
        MessageManager.Ins.sendMessage(MessageType.L2CELLTAP, this);
        MessageManager.Ins.sendMessage(MessageType.L2USEENERGY, this)
    }

    public release(): void{
        this.char = null;
    }
}