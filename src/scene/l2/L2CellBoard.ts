/**
 * 棋盘
 */
class L2CellBoard {

    public cells: L2Cell[][];
    public cellWidth: number;
    public realCellWidth: number;
    private static cellDis: number = 3;
    private static colStartDis: number = 200;
    public maxRowX: number; // 从0开始
    public maxColY: number;

    public constructor() {
        let boardRow: number = 10;//棋盘列数，TODO:未来从关卡配置中读取
        let boardCol: number = 14;//棋盘行数，未来从关卡配置中读取
        this.maxRowX = boardRow - 1;
        this.maxColY = boardCol - 1;
        let boardCells: L2Cell[][] = [];// 棋盘格子，访问时，先列，后行，第几列第几行
        let cellWidth: number = GameRoot.StageWidth / boardRow;
        this.cellWidth = cellWidth;
        let realCellWidth = cellWidth - L2CellBoard.cellDis;
        this.realCellWidth = realCellWidth;
        for (let row = 0; row < boardRow; row++) {
            let x = this.getCellX(row);
            let boardRowCells: L2Cell[] = [];// 棋盘的一列
            for (let col = 0; col < boardCol; col++) {
                let y = this.getCellY(col);
                let cell = new L2Cell(realCellWidth, row, col);
                boardRowCells.push(cell);
                LayerManager.Ins.gameLayer.addChild(cell);
                cell.x = x;
                cell.y = y;
            }
            boardCells.push(boardRowCells);
        }
        this.cells = boardCells;
    }

    private getCellX(row: number): number {
        return row * this.cellWidth;
    }

    private getCellY(col: number): number {
        return L2CellBoard.colStartDis + col * this.cellWidth;
    }

    public getBetweenCells(cell: L2Cell): L2Cell[] {
        let cellX = cell.rowX;
        let cellY = cell.colY;
        let targets = [];
        if (cellX != 0) { targets.push(this.cells[cellX - 1][cellY]) }
        if (cellX != this.maxRowX) { targets.push(this.cells[cellX + 1][cellY]) }
        if (cellY != 0) { targets.push(this.cells[cellX][cellY - 1]) }
        if (cellY != this.maxColY) { targets.push(this.cells[cellX][cellY + 1]) }
        return targets;
    }

    /**
     * 所有和cell距离range范围内的格子，包含cell自己，不考虑不可行走等情况
     * @param range 范围
     */
    public rangeCells(cell: L2Cell, range: number): L2Cell[] {
        let inRangeCells = new MySet<L2Cell>();
        let throughCells = new MySet<L2Cell>();
        let throughedCells = new MySet<L2Cell>();
        throughCells.add(cell);
        throughedCells.add(cell);
        while (throughCells.data.length > 0) {
            let curCell = throughCells.data.pop();
            if (curCell.disTo(cell) <= range) {
                inRangeCells.add(curCell);
                for(let othercell of this.getBetweenCells(curCell)){
                    if (!Util.contains(throughedCells.data, othercell) && othercell.disTo(cell) < range){
                        throughCells.add(othercell);
                        throughedCells.add(othercell);
                    }
                }
            }
        }
        return inRangeCells.data;
    }

    public release(): void {
        for (let cellRow of this.cells) {
            for (let cell of cellRow) {
                cell.release();
            }
        }
    }
}