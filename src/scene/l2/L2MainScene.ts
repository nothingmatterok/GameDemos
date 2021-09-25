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
    public energyManager: L2EnergyManager;
    public skillManager: L2SkillManager;
    public buffManager: L2BuffManager;

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
            let charTest = new L2Char(L2Config.CharCfg[0], 1 - i%2 * 2);
            charTest.hpChangeTo(charTest.attr.maxHp);
            charTest.camp == L2Camp.Player ? this.players.push(charTest) : this.enemies.push(charTest);
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
        this.energyManager = new L2EnergyManager();
        this.status = new L2SceneStatusNormal();
        this.skillManager = new L2SkillManager();
        this.buffManager = new L2BuffManager();
        this.buffManager.initial();

        let buff = this.buffManager.newBuff(L2Config.BuffCfg[0], null);
        this.buffManager.attachBuff2Char(buff, this.enemies[0]);

        // 监听各种点击消息
        MessageManager.Ins.addEventListener(MessageType.L2CELLTAP, this.cellTap, this);
        MessageManager.Ins.addEventListener(MessageType.L2CHARTAP, this.charTap, this);
        MessageManager.Ins.addEventListener(MessageType.L2TIMEPORTTAP, this.timePortTap, this);
    }

    // 如果行动没结束，玩家不能对格子cell进行任何操作
    public isPause:boolean = false;
    public isCharMoveEnd: boolean = true;

    public update(){
        // 如果暂停了
        if (this.isPause)return;
        // 如果上一个角色还没移动完
        if (!this.isCharMoveEnd) return;
        // 如果技能管理器还在处理技能中
        if (this.skillManager.IsInSkillProcess) return;

        // 如果角色都行动结束，同时timemanager上还有被布置的角色，那么该角色应该是刚行动完的角色
        // timemanager 进行角色行动完毕后的回收
        if (this.timeManager.curChar != null){
            this.timeManager.afterCharNormalAction();
        }
        // timemanager分配下一个角色，角色开始行动，角色行动是否结束只为false
        let charSelect = this.timeManager.toNextChar();
        MessageManager.Ins.sendMessage(MessageType.L2BuffTriggerTime, [L2TriggerTimeType.BeforeAction]);
        charSelect.startAction(); // 行动的时候会把各种状态放到合适的值
    }

    public status: IL2MainSceneStatus;
    public focusChar: L2Char;

    private charTap(msg: Message): void {
        let char: L2Char = msg.messageContent;
        this.status.charTap(char);
    }

    private timePortTap(msg: Message): void{
        let timePort: L2TimeBarPort = msg.messageContent;
        this.status.timePortTap(timePort);
    }

    private cellTap(msg: Message): void {
        // 如果技能或者角色没有移动完，就可以直接返回了
        if(!this.isCharMoveEnd || this.skillManager.IsInSkillProcess ) {
            return;
        }
        let cell: L2Cell = msg.messageContent;
        this.status.cellTap(cell);
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
        this.skillManager.release();
        this.skillManager = null;
        this.buffManager.release();
        this.buffManager = null;
    }

    public releaseResource(){
        this._resLoad.releaseResource();
    }
}