export class BinaryHeap{
    constructor (source_data) {
        this.heapArray = source_data.concat();
        this.build();
    }

    build () {
        this.forEachParent( i => {
            this.rebalance(i);
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

    rebalance (fromNode) {
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

    insert(n) {
        this.heapArray.push(n);
        var p = this.heapArray.length - 1;
        do{
            p = this.parentIndex(p);
            this.rebalance(p);
        }while(p) //will stop at 0
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