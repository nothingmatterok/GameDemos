class ToastInfoManager {

	private static _labelPools: eui.Label[] = [];
	/**
	 * 
	 * @param floatTime 悬停时间
	 */
	public static newToast(
		info: string, color: number = ColorDef.DodgerBlue,
		startY: number = 60, horizontalCenter: number = 0,
		animYStep: number = -100, animXStep: number = 0,
		animTime: number = 6000, labelSize: number = 30, 
		labelBold: boolean = true, ease: (t: number)=>number = egret.Ease.circOut,
		floatTime: number = 0
	): void {
		let label: eui.Label;
		if (this._labelPools.length > 0) {
			label = this._labelPools.pop()
		} else {
			label = new eui.Label();
		}
		label.textColor = color;
		label.horizontalCenter = horizontalCenter;
		label.y = startY;
		label.alpha = 1;
		label.size = labelSize;
		label.text = info;
		label.bold = labelBold;
		LayerManager.Ins.uiLayer.addChild(label);
		// 先停一会，再往上走
		egret.Tween.get(label).to({}, floatTime).to(
			{ y: label.y + animYStep, horizontalCenter: label.horizontalCenter + animXStep, alpha: 0 }, animTime, ease
		).call(
			() => {
				LayerManager.Ins.uiLayer.removeChild(label);
				this._labelPools.push(label);
			}
		)
	}

	public static newRedToast(info: string): void {
		ToastInfoManager.newToast(info, ColorDef.Coral);
	}
}