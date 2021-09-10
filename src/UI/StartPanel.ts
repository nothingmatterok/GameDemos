class StartPanel extends eui.Component {
    private pswdTextInput: eui.TextInput
    private confirmButton: eui.Button
    private debugButton: eui.Button;
    private clearLocalButton: eui.Button;

    constructor() {
        super();
        this.width = GameRoot.StageWidth;
        this.height = GameRoot.StageHeight;
        this.addEventListener(eui.UIEvent.COMPLETE, this.panelEventInit, this);
    }

    private panelEventInit() {
        this.confirmButton.addEventListener(egret.TouchEvent.TOUCH_TAP,
            this.confirmPswd, this
        );

        this.clearLocalButton.addEventListener(egret.TouchEvent.TOUCH_TAP,
            () => {
                UserData.clearLocalData();
            }, this
        );

        // DEBUG按键跳转测试场景
        if (DEBUG) {
            this.debugButton.visible = true;
            this.debugButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.debugTap, this);
        }
    }

    // 测试用
    private debugTap() {
        SceneManager.Ins.setScene(new L2MainScene());
    }

    private confirmPswd(event: egret.TouchEvent) {
        if (this.pswdTextInput.text.length == 0) {
            alert("验证失败");
            return;
        }
        this.confirmButton.enabled = false;
        Util.httpGet(VERIFYURL + this.pswdTextInput.text.substring(0, 10),
            this.onGetComplete, this.onGetIOError, this.onGetProgress, this)
    }

    private onGetComplete(event: egret.Event): void {
        let request = <egret.HttpRequest>event.currentTarget
        let result = request.response.substring(0, 1)

        // 如果验证失败
        if (result != "y") {
            alert("验证失败")
            this.confirmButton.enabled = true
            return;
        }

        ToastInfoManager.newRedToast("验证成功");

        setTimeout(() => {
            SceneManager.Ins.setScene(new MainScene());
        }, 1000);

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