class StartScene extends IScene{
    public initial(){
        let testUI = new StartPanel();
        LayerManager.Ins.uiLayer.addChild(testUI);
    }
}