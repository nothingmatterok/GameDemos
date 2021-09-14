class L2EnergyBarManager {

    private fireBar: eui.Group;
    private fires: egret.Shape[];
    private static fireDis: number = 30;

    public constructor(fireBar: eui.Group) {
        this.fireBar = fireBar;
        this.fires = [];

        // 接收消息对火进行相应管理
        MessageManager.Ins.addEventListener(MessageType.L2USEENERGY, this.useEnergy, this);
        MessageManager.Ins.addEventListener(MessageType.L2ADDENERGY, this.addEnergy, this);
    }

    private useEnergy(msg: Message): void {
        let useEnergyNum = 1; // TODO: 从msg中解析出用了多少能量
        for (let i = 0; i < useEnergyNum; i++) {
            if (this.fires.length > 0) {
                let fire = this.fires.pop();
                this.fireBar.removeChild(fire);
            }
        }
    }

    private addEnergy(msg: Message): void {
        let addEnergyNum = 1; // TODO: 从msg中解析出加了多少能量
        for (let i = 0; i < addEnergyNum; i++) {
            if (this.fires.length <= 10) {
                let fire = new egret.Shape();
                Util.drawCircle(fire, 9, ColorDef.DarkOrange);
                this.fires.push(fire);
                this.fireBar.addChild(fire);
                fire.x = L2EnergyBarManager.fireDis * (this.fires.length - 1);
            }
        }
    }
}