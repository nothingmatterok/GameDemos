class MainScene extends IScene{
    public initial(){
        LayerManager.Ins.uiLayer.addChild(new MainUI());
    }
}