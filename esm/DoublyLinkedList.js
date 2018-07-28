import {LinkedList, LinkedListNode, LinkedSentinelNode} from "./LinkedList";

export class DoublyLinkedListNode extends LinkedListNode {
    constructor (data, next, prev) {
        super(data, next);
        this.prev = prev;
    }

    setPrev(_n){
        this.prev = _n;
    }

}

//Inheritance Diagram:
//DoublyLinkedSentinelNode -> LinkedSentinelNode -> DoublyLinkedListNode -> LinkedListNode
export class DoublyLinkedSentinelNode extends LinkedSentinelNode(DoublyLinkedListNode){
    constructor (type, next, prev) {
        super(type, next, prev);
    }
}

export  class DoublyLinkedList extends LinkedList{
    constructor(fromArray) {
        super(undefined, DoublyLinkedListNode, DoublyLinkedSentinelNode);
        this.tail.prev = this.root;
        if(fromArray){
            this.fromArray(fromArray);
        }
    }

    fromArray(array ){
        super.fromArray(array);
        var _n = this.root.next;
        var _p = this.root;
        do{
            _n.setPrev(_p);
            _p = _n;
        }while(_n = _n.next);
    }

    //O(n/2) time
    search(data) {
        var recursiveSearch = function(left, right){
            if(Object.is(left.data, data))
                return left;
            else if(Object.is(right.data, data))
                return right;
            else if(left == right)
                return;
            else
                return recursiveSearch(left.next, right.prev);
        };

        return recursiveSearch(this.root, this.tail);
    }

    //O(n/2) worst-case time to find the node. The actual removal operation is O(1);
    remove(data) {
        var _n = this.search(data);
        _n.prev.next = _n.next;
        _n.next.prev = _n.prev;
        return _n;
    }

    unshift(data) {
        var _n = super.unshift(data)
        _n.prev = this.root;
        return _n;
    }

    //O(1) time!! #toma
    append(data) {
        var _n = new DoublyLinkedListNode(data, this.tail, this.tail.prev);
        this.tail.prev.next = _n;
        this.tail.prev = _n;
        return _n;
    }

    reverseIterate(callback){
        var _n = this.tail;
        while(_n = _n.prev){
            if(!(_n instanceof DoublyLinkedSentinelNode)){
                callback(_n);
            }
        }
    }
}