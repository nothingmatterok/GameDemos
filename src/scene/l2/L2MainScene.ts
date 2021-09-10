class L2MainScene extends IScene{
    public initial(){
        LayerManager.Ins.uiLayer.addChild(new L2MainUI());
    }
}