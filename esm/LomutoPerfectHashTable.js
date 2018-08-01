//Alex Pilafian, 2018
//Based on Lomuto's model of perfect hashing in Introduction to Algorithms Ch11.5

//According to theorem 11.9 there is a 1/2 probability that there will be no second-level
//collisions given that the space is the bucket-size squared.

//Similarly, according to theorem 11.10, the total storage requirements for such a scheme
//are asymptotically-bounded by O(2n)

//The actual hash function is the Fowler-Noll-Vo hash function described here:
//https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function

import {FNVHash} from './HashFunctions/fnv_hash';

export class LomutoPerfectHashTable {
    //data is an Object holding the key/value pairs
    constructor(data){
        this.hash = FNVHash;
        this.setData(data);
    }

    setData(data){
        this.data = data;
        this.size = Object.keys(data).length;
        this.buckets = Array.from(Array(this.size), () => new Array());
        this.values = new Array(this.size);
        this.rehash();
    }

    rehash(){
        Object.keys(this.data).forEach(function (_k) {
            const bucketIdx = this.hash(undefined, _k) % this.size;
            this.buckets[bucketIdx].push(_k);
        }.bind(this));

        this.buckets.sort(function (a, b) {
            return (a.length > b.length)? -1 : 1;
        });

        for(var b = 0; b < this.buckets.length; b++){
            var bucket = this.buckets[b];
            if(bucket.length <= 1)
                break;

            var outerSlot = this.hash(undefined, bucket[0]) % this.size;

            var m = Math.pow(bucket.length, 2);
            this.values[outerSlot] = new Array(m + 2);
            var d = 1;
            var item = 0;
            var slots = [];

            while(item < bucket.length){
                var slot = this.hash(d, bucket[item]) % m;
                if(this.values[outerSlot][slot+2] !== undefined || slots.indexOf(slot) >= 0){
                    d++;
                    item = 0;
                    slots = [];
                }else{
                    slots.push(slot);
                    item += 1;
                }
            }

            this.values[outerSlot][0] = d;
            this.values[outerSlot][1] = Math.pow(bucket.length, 2);
            for(var i = 0; i < bucket.length; i++){
                this.values[outerSlot][slots[i] + 2] = this.data[bucket[i]];
            }
        }

        for (b; b < this.size; b++){
            var bucket = this.buckets[b];
            if(bucket.length == 0)
                break;
            var outerSlot = this.hash(undefined, bucket[0]) % this.size;
            this.values[outerSlot] = [null, null, this.data[bucket[0]]];
        }
    }

    get(key){
        var b = this.hash(undefined, key) % this.size;
        var d = this.values[b][0];
        var m = this.values[b][1];
        if(d === null)
            return this.values[b][2];
        return this.values[b][(this.hash(d, key) % m) + 2];
    }
}