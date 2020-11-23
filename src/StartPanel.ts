class StartPanel extends eui.Component {
    public pswdTextInput: eui.TextInput
    public confirmButton: eui.Button

    constructor(width: number, height: number) {
        super()
        this.width = width
        this.height = height
        this.addEventListener(eui.UIEvent.COMPLETE, this.panelEventInit, this);
    }

    private panelEventInit() {
        this.confirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirmPswd, this);
    }

    private confirmPswd(event: egret.TouchEvent) {
        this.confirmButton.enabled = false;
        httpGet(VERIFYURL + this.pswdTextInput.text, this.onGetComplete,
            this.onGetIOError, this.onGetProgress, this)
    }

    private onGetComplete(event: egret.Event): void {
        let request = <egret.HttpRequest>event.currentTarget
        let result = request.response.substring(0,1)
        
        // 如果验证失败
        if (result != "y")
        {
            alert("验证失败")
            this.confirmButton.enabled = true
            return
        }

        //todo: 如果验证成功进入下一个界面
        alert("验证成功")

    }

    private onGetIOError(event: egret.IOErrorEvent): void {
        // console.log("get error : " + event);
        alert("网络错误")
        this.confirmButton.enabled = true
    }

    private onGetProgress(event: egret.ProgressEvent): void {
        // console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }



}