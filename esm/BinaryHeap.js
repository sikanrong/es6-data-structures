export class BinaryHeap{
    constructor (source_data) {
        this.heapArray = source_data.concat();
        this.build();
    }

    build () {
        this.forEachParent( i => {
            this.rebalanceDown(i);
        });
    }

    forEachParent(callback){
        var n = this.heapArray.length;
        for(var i = this.parentIndex(n - 1); i >= 0; i--)
            callback(i);
    }

    verify(){
        var isValid = true;
        this.forEachParent(i => {
            var l = this.leftChildIndex(i);
            var r = this.rightChildIndex(i);
            var lVal = this.heapArray[l];
            var rVal = this.heapArray[r];
            var iVal = this.heapArray[i];
            var nodeValid = ( (lVal && lVal < iVal || !lVal) && (rVal && rVal < iVal || !rVal));
            isValid = isValid && nodeValid;
        });
        return isValid;
    }

    rebalanceDown (fromNode) {
        var rebalanceRecursive = function(i){
            var l = this.leftChildIndex(i);
            var r = this.rightChildIndex(i);
            var largest = null;

            if(l <= this.heapArray.length && this.heapArray[l] > this.heapArray[i])
                largest = l;
            else
                largest = i;
            if(r <= this.heapArray.length && this.heapArray[r] > this.heapArray[largest])
                largest = r;
            if(!Object.is(largest, i)){
                var _t = this.heapArray[i];
                this.heapArray[i] = this.heapArray[largest];
                this.heapArray[largest] = _t;
                return rebalanceRecursive(largest);
            }

        }.bind(this);

        return rebalanceRecursive(fromNode);
    }

    rebalanceUp(p){
        if(p <= 0) //p is the root node, has no parent
            return;
        var rebalanceRecursive = function (i) {
            var parentIdx = this.parentIndex(i);
            var iVal = this.heapArray[i];
            var pVal = this.heapArray[parentIdx];

            if(pVal < iVal){
                this.heapArray[parentIdx] = iVal;
                this.heapArray[i] = pVal;
                if( parentIdx > 0 )
                    return rebalanceRecursive(parentIdx);
            }
        }.bind(this);

        return rebalanceRecursive(p);
    }

    remove(p){
        this.heapArray[p] = this.heapArray.pop();
        this.rebalanceDown(p);
        this.rebalanceUp(p);
    }

    insert(n) {
        this.heapArray.push(n);
        this.rebalanceUp(this.heapArray.length - 1);

    }

    rightChildIndex(index) {
        return (2 * index) + 2;
    }

    leftChildIndex(index) {
        return (2 * index) + 1;
    }

    parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }


}