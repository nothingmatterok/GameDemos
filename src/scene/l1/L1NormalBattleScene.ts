class L1NormalBattleScene extends IScene {

    public skillManager: L1SkillManager;
    public creationManager: L1CreationManager;
    public buffManager: L1BuffManager;

    private _resLoad: ResAsyncLoader = new ResAsyncLoader();
    private _players: L1Char[] = [];
    private _enemies: L1Char[] = [];

    public battleEnd: boolean = false;

    public initial() {
        this.skillManager = new L1SkillManager();
        this.creationManager = new L1CreationManager();
        this.buffManager = new L1BuffManager();
        LayerManager.Ins.uiLayer.addChild(new L1BattleSceneUI());
        this.initialGameLayer();
    }

    private initialGameLayer() {
        // 从L1Userdata中读取关卡信息
        let enemiesIds = UserData.l1Data.currentLevelEnemies;
        for (let i of enemiesIds) {
            let char = new L1Char(L1Camp.Enemy, i);
            char.addToScene();
            this._enemies.push(char);
        }
        let charIds = UserData.l1Data.userUseCharIds;
        for (let i of charIds) {
            let char = new L1Char(L1Camp.Player, i);
            char.addToScene();
            this._players.push(char);
        }

        this._enemies.sort((a, b) => { return a.rawAttr.posNum - b.rawAttr.posNum });
        this._players.sort((a, b) => { return a.rawAttr.posNum - b.rawAttr.posNum });

        this._enemies.forEach(char => {
            char.initial(this._players, this._enemies);
        });

        this._players.forEach(char => {
            char.initial(this._enemies, this._players);
        });
    }

    private _battleStart: boolean = false;
    public battleStart() {
        this._battleStart = true;
    }

    public removeChar(charId:number) {
        let index = -1;
        for(let i=0;i<this._players.length;i++){
            if(this._players[i].charId == charId){
                index = i;
                break;
            }
        }
        if (index == -1){
            console.warn("哪里不对劲");
            return;
        }
        let char = this._players[index];
        char.removeFromScene();
        this._players.splice(index, 1);
        this.endReplace();
    }

    public addChar(charId: number) {
        let char = new L1Char(L1Camp.Player, charId);
        char.addToScene();
        this._players.push(char);
        this.endReplace();
    }

    private endReplace() {
        // 对我方角色重新排序与初始化
        this._players.sort((a, b) => { return a.rawAttr.posNum - b.rawAttr.posNum });
        this._players.forEach(char => {
            char.initial(this._enemies, this._players);
        });
        
    }

    public update() {
        // 如果战斗还没开始
        if (!this._battleStart) return;
        // 如果战斗结束了
        if (this.battleEnd) return;
        // 胜利判定
        let palyerAliveNum = 0;
        let enemyAliveNum = 0;
        [this._enemies, this._players].forEach(chars => {
            chars.forEach(char => {
                if (!char.alive) return;
                if (char.camp == L1Camp.Enemy) enemyAliveNum++;
                if (char.camp == L1Camp.Player) palyerAliveNum++;
            });
        });
        if (palyerAliveNum == 0) {
            this.battleEnd = true;
            ToastInfoManager.newRedToast("战斗失败");
            return;
        }
        if (enemyAliveNum == 0) {
            this.battleEnd = true;
            ToastInfoManager.newRedToast("战斗胜利");
            return;
        }
        this.skillManager.update();
        this.creationManager.update();
        this.buffManager.update();

        [this._enemies, this._players].forEach(chars => {
            chars.forEach(char => {
                char.update();
            });
        });
    }

    public async loadResource() {
        await this._resLoad.loadGroup("portrait", 0, LayerManager.Ins.loadingUI);
    }

    public releaseResource() {
        this._resLoad.releaseResource();
    }
}