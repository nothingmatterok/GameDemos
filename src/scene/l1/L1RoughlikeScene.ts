class L1RoughlikeScene extends IScene{
    public initial(){
        LayerManager.Ins.uiLayer.addChild(new L1MainUI());
    }
}