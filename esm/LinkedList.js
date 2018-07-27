export class LinkedListNode {
    constructor(data, next){
        this.next = next;
        this.data = data;
    }

    setNext(_n){
        this.next = _n;
    }
}

export class SentinelNode extends LinkedListNode{
    constructor(data, next, type){
        super(data, next);
        this.type = type;
    }
}

SentinelNode.TYPE_START = 0;
SentinelNode.TYPE_END = 0;

export class LinkedList {
    constructor (fromArray) {
        this.tail = new SentinelNode(null, null, SentinelNode.TYPE_END);
        this.root = new SentinelNode(null, this.tail, SentinelNode.TYPE_START);

        //Construct a list from a passed array
        if(fromArray)
            this.fromArray(fromArray);
    }

    //Creates a linkedlist from an array in O(n) time instead of what would be O(n^2) time using addNode.
    fromArray (data_ar) {
        var recursiveAdd = function (_a){
            var _d = _a.shift();
            if(!_d)
                return this.tail;
            return new LinkedListNode(_d, recursiveAdd(_a))
        }.bind(this);

        this.root.setNext(recursiveAdd(data_ar.concat()));
    }

    //O(n) performance :(
    addNode (data){
        var _n = this.root;
        while(_n = _n.next){
            if(Object.is(_n.next, this.tail)){
                _n.setNext(new LinkedListNode(data, this.tail));
                break;
            }
        }
    }

    //O(n) performance :(
    search (data) {
        var _n = this.root;
        while(_n = _n.next)
            if(Object.is(_n.data, data))
                return _n;
    }

    iterate (callback){
        var _n = this.root;
        while(_n = _n.next)
            if(!Object.is(_n, this.tail))
                callback(_n);
    }

}