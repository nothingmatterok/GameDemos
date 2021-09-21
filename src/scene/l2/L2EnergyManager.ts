class L2EnergyManager{
    public energyNum: number = 0;
    private static MaxEnergy: number = 10;

    public useEnergy(energyNum: number): void{
        if(this.energyNum < energyNum) {
            console.error("使用的能量超过上限");
            return;
        }
        this.energyNum -= energyNum;
        (SceneManager.Ins.curScene as L2MainScene).mainUI.removeFires(energyNum);
    }

    public addEnergy(energyNum: number): void{
        this.energyNum += energyNum;
        let floatEnergy: number = 0; // 溢出的数量
        if (this.energyNum > 10) {
            floatEnergy = this.energyNum - 10; 
            this.energyNum = 10;
        }
        let scene = SceneManager.Ins.curScene as L2MainScene;
        // 溢出的能量会对全场敌人造成伤害，感觉作用不大，暂时隐藏
        // for(let i=0;i<floatEnergy;i++){
        //     for(let enemy of scene.enemies){
        //         if (enemy.alive){
        //             enemy.hpChange(-Math.ceil(enemy.HP * 0.05));
        //         }
        //     }
        // }
        scene.mainUI.addFires(energyNum - floatEnergy);
    }

    public removeEnergy(energyNum: number): void{
        this.energyNum -= energyNum;
        let floatEnergy: number = 0;
        if (this.energyNum < 0){
            floatEnergy = this.energyNum; 
            this.energyNum = 10;
        }
        (SceneManager.Ins.curScene as L2MainScene).mainUI.removeFires(energyNum - floatEnergy);
    }
}