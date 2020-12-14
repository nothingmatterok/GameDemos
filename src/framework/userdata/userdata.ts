class UserData{

    public static l1Data: L1Data;

    public static initialData(){
        let data = UserData.getObject("L1Data");
        this.l1Data = new L1Data();
        if (data){
            this.l1Data.initialByData(data);
        }
    }

    public static setObject(key: string, value: any){
        egret.localStorage.setItem(key, JSON.stringify(value));
    }

    public static getObject(key: string) {
        return JSON.parse(egret.localStorage.getItem(key));
    }

    public static removeKey(key: string){
        egret.localStorage.removeItem(key);
    }

    public static clearLocalData(){
        egret.localStorage.clear();
        this.initialData();
    }

}