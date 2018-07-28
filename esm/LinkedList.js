export class LinkedListNode {
    constructor(data, next){
        this.next = next;
        this.data = data;
    }

    setNext(_n){
        this.next = _n;
    }

    insertAfter(_n){
        var _next = this.next;
        this.next = (_n.type == LinkedSentinelNode.TYPE_START)? _n.next : _n;
        do{
            if(_n.next == null || _n.next.type == LinkedSentinelNode.TYPE_END)
                break;
        }while(_n = _n.next);
        _n.next = _next;
    }
}

export const LinkedSentinelNode = (parentClass) => class extends parentClass{
    constructor(type, next){
        super(null, next);
        this.type = type;
    }
}

LinkedSentinelNode.TYPE_START = 0;
LinkedSentinelNode.TYPE_END = 1;

export class LinkedList {
    constructor (fromArray, nodeClass = LinkedListNode, sentinelClass = LinkedSentinelNode(LinkedListNode)) {
        this.nodeClass = nodeClass;
        this.sentinelClass = sentinelClass;
        this.tail = new this.sentinelClass( LinkedSentinelNode.TYPE_END, null );
        this.root = new this.sentinelClass( LinkedSentinelNode.TYPE_START, this.tail );

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
            return new this.nodeClass(_d, recursiveAdd(_a))
        }.bind(this);

        this.root.setNext(recursiveAdd(data_ar.concat()));
    }

    //O(n) performance :(
    append (data){
        var _n = this.root;
        while(_n = _n.next){
            if(Object.is(_n.next, this.tail)){
                var _nn = new this.nodeClass(data, this.tail);
                _n.setNext(_nn);
                return _nn;
            }
        }
    }

    unshift (data){
        var _n = new this.nodeClass(data, this.root.next);
        this.root.next = _n;
        return _n;
    }

    remove (data) {
        var _n = this.root;
        do{
            if(_n.next && Object.is(data, _n.next.data)){
                var removed = _n.next;
                _n.next = _n.next.next; //deleted
                return removed;
            }
        }while(_n = _n.next)
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