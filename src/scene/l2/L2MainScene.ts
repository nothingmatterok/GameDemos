class L2MainScene extends IScene {

    private static cellDis = 2; // 格子之间的间隔
    private static colStartDis = 200; // 初始行的高度
    public cellWidth: number;
    public realCellWidth: number; // 实际内部的格子宽度
    public boardCells: L2Cell[][]; // 棋盘格子
    public mainUI: L2MainUI;
    private _resLoad: ResAsyncLoader = new ResAsyncLoader();

    public players: L2Char[];
    public enemies: L2Char[];
    public timeManager: L2TimeManager;

    public energyNum: number = 0;

    public async loadResource(){
        await this._resLoad.loadGroup("portrait", 0, LayerManager.Ins.loadingUI);
    }

    public initial() {
        // 构造棋盘
        let boardRow: number = 10;//棋盘列数，TODO:未来从关卡配置中读取
        let boardCol: number = 14;//棋盘行数，未来从关卡配置中读取
        let boardCells: L2Cell[][] = [];// 棋盘格子，访问时，先列，后行，第几列第几行
        let cellWidth: number = GameRoot.StageWidth / boardRow;
        this.cellWidth = cellWidth;
        let realCellWidth = cellWidth - L2MainScene.cellDis;
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
        this.boardCells = boardCells;

        // 定义角色与敌方单位 TODO: 测试过程
        this.players = [];
        this.enemies = [];
        for(let i = 1; i < 6;i++){
            let charTest = new L2Char(realCellWidth, `${i*3}_portrait_png`, 1 - i%2 * 2);
            charTest.attr.startTime = i * 20;
            charTest.attr.actionSpeed = 20 + i * 10;
            charTest.attr.maxHp = 1000;
            charTest.attr.atk = 100;
            charTest.attr.def = 20;
            charTest.attr.moveRange = 5;
            if(charTest.camp == L2Camp.Player){this.players.push(charTest);}else{this.enemies.push(charTest);}
        }

        // 角色及敌人进入到gameLayer中 TODO: 测试过程
        let i = 1;
        for(let char of this.enemies.concat(this.players)){
            LayerManager.Ins.gameLayer.addChild(char);
            char.x = this.getCellX(i++);
            char.y = this.getCellY(i++);
        }

        // 定义UI
        this.mainUI = new L2MainUI()
        LayerManager.Ins.uiLayer.addChild(this.mainUI);

        // 初始化timeManager
        this.timeManager = new L2TimeManager();

        // 监听各种点击消息
        MessageManager.Ins.addEventListener(MessageType.L2CELLTAP, this.cellTap, this);
        MessageManager.Ins.addEventListener(MessageType.L2CHARTAP, this.charTap, this);
        MessageManager.Ins.addEventListener(MessageType.L2TIMEPORTTAP, this.timePortTap, this);
    }

    // 如果行动没结束，玩家不能对格子cell进行任何操作
    public isCharActionEnd: boolean = true;

    public update(){
        // 如果上一个角色还没动完
        if (!this.isCharActionEnd) return;
        if (this.timeManager.curChar != null){
            this.timeManager.afterCharNormalAction();
        }
        let charSelect = this.timeManager.toNextChar();
        this.isCharActionEnd = false;
        charSelect.startAction();
    }

    private charTap(msg: Message): void {
        // let char: L2Char = msg.messageContent;
        // this.timeManager.toNextChar();
        // this.timeManager.afterCharNormalAction();
    }

    private timePortTap(msg: Message): void{
        let timePort:L2TimeBarPort = msg.messageContent;
        timePort.char.highLight();
    }

    private cellTap(msg: Message): void {
        if(!this.isCharActionEnd) {
            ToastInfoManager.newToast("请先选择一个单位");
            return;
        }
        let cell: L2Cell = msg.messageContent;
        cell.changeColor(ColorDef.DarkOrange);
    }

    private getCellX(row: number): number {
        return row * this.cellWidth;
    }

    private getCellY(col: number): number {
        return L2MainScene.colStartDis + col * this.cellWidth;
    }



    public release(){
        for(let char of this.players.concat(this.enemies)){
            char.release();
        }
        this.players = null;
        this.enemies = null;
        this.timeManager.release();
        this.timeManager = null;
        this.mainUI.release();
        this.mainUI = null;
        this.boardCells = null;
    }

    public releaseResource(){
        this._resLoad.releaseResource();
    }
}