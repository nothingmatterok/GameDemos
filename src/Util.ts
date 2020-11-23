function httpGet(url: string, onGetComplete: Function,
    onGetIOError: Function, onGetProgress: Function, eventObj: any) {
    let request = new egret.HttpRequest();
    request.responseType = egret.HttpResponseType.TEXT;
    request.open(url, egret.HttpMethod.GET);
    request.send();
    request.addEventListener(egret.Event.COMPLETE, onGetComplete, eventObj);
    request.addEventListener(egret.IOErrorEvent.IO_ERROR, onGetIOError, eventObj);
    request.addEventListener(egret.ProgressEvent.PROGRESS, onGetProgress, eventObj);
}