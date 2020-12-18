class L1TouchLabel extends eui.Component{
    public nameLabel: eui.Label;
    public cdRect: eui.Rect;

    private _name: string;

    public constructor(name: string){
        super();
        this._name = name;
        this.addEventListener(eui.UIEvent.COMPLETE, this.UIEventInit, this);
    }

    private UIEventInit(){
        this.nameLabel.text = this._name;
        this.width = 100;
        this.height = 100;
        this.y = 10;
    }
}