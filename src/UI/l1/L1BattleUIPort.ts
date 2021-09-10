class L1BattleUIPort extends eui.Group{

    private _selectMask: eui.Rect;
    private _selectLable: eui.Label;
    private _isSelect: boolean;

    public get IsSelect(): boolean{
        return this._isSelect;
    }
    
    public constructor(public charId: number){
        super();
        let charConfig = L1CHARCFGS[charId];
        let imageName = charConfig.portImageName;
        let image = new eui.Image(imageName);
        image.width = 120;
        image.height = 120;
        let maskRect = new eui.Rect(80, 80);
        maskRect.ellipseHeight = 80;
        maskRect.ellipseWidth = 80;
        maskRect.y = 20;
        maskRect.x  = 20;
        image.mask = maskRect;
        let selectMask = new eui.Rect(80, 80);
        selectMask.ellipseHeight = 80;
        selectMask.ellipseWidth = 80;
        selectMask.y = 20;
        selectMask.x  = 20;
        this._selectMask = selectMask;
        selectMask.fillColor = ColorDef.DimGray;
        selectMask.alpha = 0.5;
        let selectLabel = new eui.Label();
        selectLabel.text = "上场";
        selectLabel.y = 50;
        selectLabel.x = 30;
        this._selectLable = selectLabel;
        this.addChild(image);
        this.addChild(maskRect);
        this.addChild(selectMask);
        this.addChild(selectLabel);
        this.selectCancle();// 默认未选中
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchTap, this);
    }

    public touchTap(){
        MessageManager.Ins.sendMessage(MessageType.L1BATTLEUIPORTTAP, this);
    }

    public select(){
        this._isSelect = true;
        this._selectMask.visible = true;
        this._selectLable.visible = true;
    }

    public selectCancle(){
        this._isSelect = false;
        this._selectMask.visible = false;
        this._selectLable.visible = false;
    }



}