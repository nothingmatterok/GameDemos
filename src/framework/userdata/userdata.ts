class UserData{

    public static l1Data = new L1Data();

    public static initialData(){
        this.l1Data.initial();
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
        egret.localStorage.clear()
    }

}