class L2MainScene extends IScene{

    private static cellDis = 2; // 格子之间的间隔

    public initial(){
        LayerManager.Ins.uiLayer.addChild(new L2MainUI());
        let boardRow:number = 10;//棋盘列数，TODO:未来从关卡配置中读取
        let boardCol:number = 14;//棋盘行数，未来从关卡配置中读取
        let boardCells: L2Cell[][] = [];// 棋盘格子，访问时，先列，后行，第几列第几行
        let cellWidth: number = GameRoot.StageWidth / boardRow;
        for(let row=0;row<boardRow;row++){
            let x = row * cellWidth;
            let boardRowCells: L2Cell[] = [];// 棋盘的一列
            for(let col=0;col<boardCol;col++){
                let y = 100 + col * cellWidth;
                let cell = new L2Cell(cellWidth - L2MainScene.cellDis,row,col);
                boardRowCells.push(cell);
                LayerManager.Ins.gameLayer.addChild(cell);
                cell.x = x;
                cell.y = y;
            }
            boardCells.push(boardRowCells);
        }
    }
}