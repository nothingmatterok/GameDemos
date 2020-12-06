class L1Harm {

    public static harm(caster: L1Char, targets: L1Char[], harmConfig?: L1HarmConfig) {
        const defautHarmConfig = new L1HarmConfig();
        if (!harmConfig) harmConfig = defautHarmConfig;
        for (let target of targets) {
            let [isCrit, harmNum] = harmConfig.harmFunc(caster, target);
            target.curHp -= harmNum;
            if(harmNum >=0 ){
                target.addAngerNumber(10);
            }
            this.harmFloat(target, harmNum, isCrit);
        }
    }


    private static harmFloat(target: L1Char, harmNum: number, isCrit: boolean) {
        if (target.alive) {
            let harmText = "";
            let extraText = "miss";
            let size = 25;
            let color = ColorDef.GhostWhite;
            harmNum = Math.ceil(harmNum);
            if (harmNum != 0) {
                size = isCrit ? 30 : 25;
                let isHeal = harmNum < 0;
                extraText = isCrit ? "暴击 " : isHeal ? "治疗 " : "";
                color = isHeal ? ColorDef.LimeGreen : isCrit ?
                    ColorDef.DarkRed : ColorDef.GhostWhite;
                harmText = `${isHeal?"+":""}${-harmNum}`;
            }
            ToastInfoManager.newToast(
                `${extraText}${harmText}`, color,
                target.y - 40, target.x - GameRoot.GameStage.stageWidth / 2,
                -50, 0, 2500, size, false, egret.Ease.quadOut
            );
        }
    }

    /**
     * 
     * @param point point=100代表100%
     */
    public static isRandTrue(point: number): boolean {
        return Math.random() * 100 < point;
    }

}