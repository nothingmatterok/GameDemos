class L1MainStoryScene extends IScene {

    private _resLoad: ResAsyncLoader = new ResAsyncLoader();
    private _players: L1Char[] = [];
    private _enemies: L1Char[] = [];

    public battleEnd: boolean = false;
    public initialed: boolean = false;

    public initial() {
        LayerManager.Ins.uiLayer.addChild(new L1MainStorySceneUI());
        this.initialGameLayer();
        this.initialed = true;
    }

    private initialGameLayer() {
        for (let i = 1; i <= 8; i++) {
            let char = new L1Char(i % 2 * 2 - 1, i);
            char.addToScene();
            if (char.camp == L1Camp.Enemy){
                this._enemies.push(char);
            }else{
                this._players.push(char);
            }
        }

        this._enemies.forEach(char => {
            char.initial(this._players, this._enemies);
        });

        this._players.forEach(char => {
            char.initial(this._enemies, this._players);
        });
    }

    public update(){
        if(!this.initialed) return; // 初始化以后才允许update，否则可能会报空

        if(this.battleEnd) return;
        // 胜利判定
        let palyerAliveNum = 0;
        let enemyAliveNum = 0;
        [this._enemies, this._players].forEach(chars => {
            chars.forEach(char => {
                if(!char.alive) return;
                if (char.camp == L1Camp.Enemy) enemyAliveNum++;
                if (char.camp == L1Camp.Player) palyerAliveNum++;
            });
        });
        if (palyerAliveNum == 0){
            this.battleEnd = true;
            ToastInfoManager.newRedToast("战斗失败");
            return;
        }
        if(enemyAliveNum == 0){
            this.battleEnd = true;
            ToastInfoManager.newRedToast("战斗胜利");
            return;
        }

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