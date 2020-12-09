class L1CreationManager {

    private _deadCreations: L1Creation[];
    private _activateCreations: MySet<L1Creation>;

    public constructor() {
        this._deadCreations = [];
        this._activateCreations = new MySet<L1Creation>();
    }

    public update() {
        // 判断死亡的creation进行移除与加入死亡池
        let deadCreations = [];
        // 对活着的creation进行更新
        for (let creation of this._activateCreations.data) {
            creation.update();
            if (creation.isLifeEnd()) {
                creation.lifeEnd();
                deadCreations.push(creation)
            }
        }
        for (let creation of deadCreations) {
            this._activateCreations.remove(creation);
            this._deadCreations.push(creation);
        }
    }

    public newCreation(
        config: L1CreationConfig, caster: L1Char,
        targetChar: L1Char = null, startPos: [number, number],
        posDest: [number, number] = null, directRad: number = null
    ) {
        let creation: L1Creation = null;
        if (this._deadCreations.length > 0) {
            creation = this._deadCreations.pop();
        } else {
            creation = new L1Creation();
        }
        creation.initial(config, caster, targetChar, startPos, posDest, directRad);
        this._activateCreations.add(creation);
    }
}