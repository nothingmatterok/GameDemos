class L1MainScene extends IScene{
    public initial(){
        LayerManager.Ins.uiLayer.addChild(new L1MainUI());
    }
}