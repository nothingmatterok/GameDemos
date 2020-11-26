class L1Char{
    private charPort: L1CharPortr;
    public camp: L1Camp;
    public charId: number;

    constructor(camp:L1Camp, charId:number) {
        this.camp = camp;
        this.charId = charId;
        this.charPort = new L1CharPortr(camp, charId);

        // 临时生成到合适的位置
        this.charPort.x = GameRoot.GameStage.stageWidth * (1/2) + camp * 200;
        this.charPort.y = GameRoot.GameStage.stageHeight * (1/10) + (charId + charId % 2) * 60;
    }

    public addToScene(){
        LayerManager.Ins.gameLayer.addChild(this.charPort);
    }

    public removeFromScene(){
        LayerManager.Ins.gameLayer.removeChild(this.charPort);
    }

}