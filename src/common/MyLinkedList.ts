class MyLinkedList<T>{

    

    public addFirst(obj: T):void{

    }

    public addLast(obj:T):void{

    }

    public remove(obj:T): void{

    }

    public popFirst():T{
        return null;
    }

    public popLast():T {
        return null;
    }

    public isContain(obj:T):boolean{
        return false;
    }

    public clear(): void{

    }
}

class LinkedNode<T>{
    public content: T;
    public next: LinkedNode<T>;
    public before: LinkedNode<T>;
}