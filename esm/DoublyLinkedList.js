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

    remove(data) {
        var _removed = super.remove(data);
        _removed.next.prev = _removed.prev;
        return _removed;
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
        thi.tail.prev = _n;
        return _n;
    }
}