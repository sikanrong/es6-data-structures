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
        super(null, next, prev);
    }
}

export  class DoublyLinkedList extends LinkedList{
    constructor () {
        super(undefined, DoublyLinkedSentinelNode);

        //link tail sentinel node to root
        this.tail.setPrev(this.root);
    }

    fromArray(array){
        super.fromArray(array);
        var _n = this.root.next;
        var _p = this.root;
        do{
            _p.setPrev(_n);

            _p = _n;
        }while(_n = _n.next);
    }
}