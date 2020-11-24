class ToastInfoManager{

	private static _labelPools: eui.Label[] = [];

	public static newToast(info: string, color:number=ColorDef.DodgerBlue): void{
		let label: eui.Label;
		if (this._labelPools.length > 0){
			label = this._labelPools.pop()
		}else{
			label = new eui.Label();
			label.horizontalCenter = 0;
		}
		label.textColor = color;
		label.y = 60;
		label.alpha = 1;
		label.size = 30;
		label.text = info;
		label.bold = true;
		LayerManager.Ins.uiLayer.addChild(label);
		egret.Tween.get(label).to(
			{y: label.y - 100, alpha: 0}, 6000, egret.Ease.circOut
		).call(
			()=>{
				LayerManager.Ins.uiLayer.removeChild(label);
				this._labelPools.push(label);
			}
		)
	}

	public static newRedToast(info: string): void{
		ToastInfoManager.newToast(info, ColorDef.Coral);
	}
}