abstract class IL2MainSceneStatus {
    public initial(initialInfos: any[] = null): void { }
    public changeTo(status: IL2MainSceneStatus, initialInfos: any[] = null) {
        let scene = SceneManager.Ins.curScene as L2MainScene;
        scene.status = status;
        status.initial(initialInfos);
        this.release();
    }
    public charTap(char: L2Char): void { }
    public timePortTap(timePort: L2TimeBarPort): void {
        timePort.char.highLight();
    }
    public disConfirmButtonTap(): void{}
    public confirmButtonTap(): void { }
    public skill1ButtonTap(): void { }
    public skill2ButtonTap(): void { }
    public cellTap(cell: L2Cell): void { }
    public commandButtonTap(): void {}

    public back() {
        SceneManager.Ins.setScene(new MainScene());
    }

    public moveButtonTap(): void { }

    public release(): void{}
}