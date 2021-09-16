class L2MainScene extends IScene {

    private static cellDis = 2; // 格子之间的间隔
    private static colStartDis = 200; // 初始行的高度
    public cellWidth: number;
    public realCellWidth: number; // 实际内部的格子宽度
    public board:L2CellBoard; // 棋盘格子,访问时，先列，后行，第几列第几行，对标 X Y
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
        this.board = new L2CellBoard();

        // 定义角色与敌方单位 TODO: 测试过程
        this.players = [];
        this.enemies = [];
        for(let i = 1; i < 6;i++){
            let charTest = new L2Char(this.board.realCellWidth, `${i*3}_portrait_png`, 1 - i%2 * 2);
            charTest.attr.startTime = i * 20;
            charTest.attr.actionSpeed = i * 5;
            charTest.attr.maxHp = 1000;
            charTest.hpChangeTo(charTest.attr.maxHp);
            charTest.attr.atk = 100;
            charTest.attr.def = 20;
            charTest.attr.moveRange = 5;
            charTest.attr.atkRange = i % 2 + 1;
            charTest.name = `${i}`;
            if(charTest.camp == L2Camp.Player){this.players.push(charTest);}else{this.enemies.push(charTest);}
        }

        // 角色及敌人进入到gameLayer中 TODO: 测试过程
        let i = 1;
        for(let char of this.enemies.concat(this.players)){
            LayerManager.Ins.gameLayer.addChild(char);
            char.Cell = this.board.cells[i][i];
            char.placeToCell();
            i += 1;
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
    public isPause:boolean = false;

    public update(){
        // 如果暂停了
        if (this.isPause)return;

        // 如果上一个角色还没动完
        if (!this.isCharActionEnd) return;

        // 如果角色都行动结束，同时timemanager上还有被布置的角色，那么该角色应该是刚行动完的角色
        // timemanager 进行角色行动完毕后的回收
        if (this.timeManager.curChar != null){
            this.timeManager.afterCharNormalAction();
        }
        // timemanager分配下一个角色，角色开始行动，角色行动是否结束只为false
        let charSelect = this.timeManager.toNextChar();
        this.isCharActionEnd = false;
        charSelect.startAction();
    }

    private charTap(msg: Message): void {
        // let char: L2Char = msg.messageContent;
        // this.timeManager.toNextChar();
        // this.timeManager.afterCharNormalAction();
        this.isPause = true;
        this.mainUI.continueButton.visible = true;
    }

    private timePortTap(msg: Message): void{
        let timePort:L2TimeBarPort = msg.messageContent;
        timePort.char.highLight();
        this.isPause = true;
        this.mainUI.continueButton.visible = true;
    }

    private cellTap(msg: Message): void {
        if(!this.isCharActionEnd) {
            // ToastInfoManager.newToast("请先选择一个单位");
            return;
        }
        let cell: L2Cell = msg.messageContent;
        if (cell.char != null){
            cell.changeColor(ColorDef.DarkOrange);
        }
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
        this.board.release();
        this.board = null;
    }

    public releaseResource(){
        this._resLoad.releaseResource();
    }
}