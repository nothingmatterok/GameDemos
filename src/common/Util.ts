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

    public static contains(objs: any[], obj:any):boolean{
        return objs.indexOf(obj) >= 0;
    }

    /**
     * 创建一个纯色背景
     * @param width 
     * @param height 
     * @param color 
     * @param alpha 
     */
    public static createColorBG(width: number, height: number,
        color: number = ColorDef.DimGray, alpha: number = 1): egret.Shape {
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
        egret.Tween.get(obj, { loop: true }).to({
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

    /**
     * 画一个带角度的圆形，从竖直的方向开始往右边画，会先清除Shape内的内容
     * @param shape
     * @param endAngle 
     * @param radius 
     * @param startAngle 
     * @param color 
     * @param alpha 
     */
    public static drawAngleCircle(
        shape: egret.Shape, endAngle: number, radius: number,
        startAngle: number = 0, color: number = ColorDef.DarkRed,
        alpha: number = 1,
    ) {
        shape.graphics.clear();
        shape.graphics.beginFill(color, alpha);
        shape.graphics.moveTo(0, 0);
        let startRadius = startAngle * angle2RadParam;
        let startX = Math.cos(startRadius) * radius;
        let startY = Math.sin(startRadius) * radius;
        shape.graphics.lineTo(startX, startY);
        shape.graphics.drawArc(0, 0, radius, startRadius, endAngle * Math.PI / 180);
        shape.graphics.lineTo(0, 0);
        shape.graphics.endFill();
    }

    public static drawCircle(
        shape: egret.Shape, radius: number, color: number = ColorDef.Tan, 
        x:number = 0, y: number = 0, alpha: number = 1
    ) {
        shape.graphics.clear();
        shape.graphics.beginFill(color, alpha);
        shape.graphics.drawCircle(x, y, radius);
        shape.graphics.endFill();
    }

    /**
     * 画一个正方形
     * @param shape 要被绘制的对象
     * @param width 
     * @param color 
     * @param alpha 
     */
    public static drawSquar(
        shape: egret.Shape, width: number,
        color: number = ColorDef.Tan, alpha: number = 1
    ) {
        this.drawRect(shape, width, width, color, alpha);
    }

    public static drawRect(
        shape: egret.Shape, width: number, height: number,
        color: number = ColorDef.Tan, alpha: number = 1
    ) {
        shape.graphics.clear();
        shape.graphics.beginFill(color, alpha);
        shape.graphics.drawRect(0, 0, width, height);
        shape.graphics.endFill();
    }


    public static pointDistance(p1: [number, number], p2: [number, number]): number {
        let xDis = p1[0] - p2[0];
        let yDis = p1[1] - p2[1];
        return Math.sqrt(xDis * xDis + yDis * yDis);
    }

    /**
     * 返回center到end的射线与竖直向下线往逆时针方向的弧度值 
     * @param center 
     * @param end 
     */
    public static getRad(center: [number, number], end: [number, number]): number {
        let longS = Util.pointDistance(center, end);
        let yDis = end[1] - center[1];
        let xDis = end[0] - center[0];
        let sinAngle = xDis / longS;
        let cosAngle = yDis / longS;
        let rad = Math.acos(yDis / longS)
        if (sinAngle > 0) return rad;
        // 如果sin小于0，说明acos要反向一下
        return -rad;
    }

    public static isNumEqual(a: number, b: number, tolerant: number = 3): boolean {
        return Math.abs(a - b) < tolerant;
    }

    // 将角度规范到-180-180内
    public static degNormalize(deg: number): number {
        deg = deg % 360;
        if (deg > 180) return deg - 360;
        if (deg < -180) return deg + 360;
        return deg;
    }

    public static clamp(raw:number, min:number, max:number): number{
        return raw < min ? min : raw > max ? max : raw;
    }

}

const angle2RadParam = Math.PI / 180;