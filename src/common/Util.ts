class Util {

    // 防止被new
    private constructor() { }

    /**
     * 从一个Array中删除元素，如果确实属于ls返回true，否则返回false
     */
    public static removeObjFromArray(ls: any[], obj: any): boolean {
        let index = ls.indexOf(obj);
        if (index >= 0) {
            ls.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 创建一个纯色背景
     * @param width 
     * @param height 
     * @param color 
     * @param alpha 
     */
    public static createColorBG(width:number, height:number, 
        color:number=ColorDef.AntiqueWhite, alpha:number=1): egret.Shape{
        let shape = new egret.Shape();
        shape.width = width;
        shape.height = height;
        shape.graphics.beginFill(color, alpha);
        shape.graphics.drawRect(0, 0, width, height);
        shape.graphics.endFill();
        return shape;
    }

    /**
     * 安全移除egret的子物体，防止父物体空错误
     */
    public static safeRemoveFromParent(element: any): void {
        if (!element) return;
        let p = element.parent;
        if (p) {
            p.removeChild(element);
        }
    }

    /**
     * 打乱输入的数组
     */
    public static getRandomArray(input: any[]): any[] {
        let output = [];
        let len = input.length;
        while (len > 0) {
            let index = Math.floor(Math.random() * len);
            if (index == len) {
                index -= 1;
            }
            output.push(input.splice(index, 1)[0]);
            len -= 1;
        }
        return output;
    }

    /**
     *  以bject中心作为中心不断做缩放
     */
    public static largeSmallTweenAnim(obj: any, widthRate: number, heightRate: number, cycleTime: number): void {
        let startX = obj.x;
        let startY = obj.y;
        let startWidth = obj.width;
        let startHeight = obj.height;
        let endWidth = startWidth * widthRate;
        let endHeight = startHeight * heightRate;
        let endX = startX - (endWidth - startWidth) / 2;
        let endY = startY - (endHeight - startHeight) / 2;
        egret.Tween.get(obj, {loop: true}).to({
            width: endWidth,
            height: endHeight,
            x: endX,
            y: endY
        }, cycleTime).to({
            width: startWidth,
            height: startHeight,
            x: startX,
            y: startY
        }, cycleTime);
    }

    /**
     * 
     * @param url 访问的网址
     * @param onGetComplete 访问结束后的回调
     * @param onGetIOError 访问错误回调
     * @param onGetProgress 访问过程中回调
     * @param eventObj 回调事件主体
     */
    public static httpGet(url: string, onGetComplete: Function,
        onGetIOError: Function, onGetProgress: Function, eventObj: any) {
        let request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(url, egret.HttpMethod.GET);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, onGetComplete, eventObj);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, eventObj);
        request.addEventListener(egret.ProgressEvent.PROGRESS, onGetProgress, eventObj);
    }


    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    public static createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}