class L1Data{

    private currentMainStoryId: number = 0;
    private userUseCharIds: number[] = [1,2,3,4];
    private userAllCharIds: number[] = [1,2,3,4,5,6,7,8];

    public get CurMainStoryId(): number{return this.currentMainStoryId;}
    public get UserUseCharIds(): number[]{return this.userUseCharIds;}
    public get UserAllCharIds(): number[]{return this.userAllCharIds;}

    public set UserUseCharIds(v: number[]){
        this.userUseCharIds = v;
        this.writeData();
    }

    public set CurMainStoryId(v: number){
        this.currentMainStoryId = v;
        this.writeData();
    }

    public initialByData(data:{}){
        for(let key in data){
            this[key] = data[key];
        }
    }

    private writeData(){
        UserData.setObject("L1Data", this);
    }


    // 全局数据
    public levelType: L1LevelType;

}

enum L1LevelType{
    MainStory,
}