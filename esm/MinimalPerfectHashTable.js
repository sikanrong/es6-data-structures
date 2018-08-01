//Alex Pilafian, 2018
//Based on Steve Hanov python version: http://stevehanov.ca/blog/index.php?id=119

//This article lays out the techniques in my approach:
//Edward A. Fox, Lenwood S. Heath, Qi Fan Chen and Amjad M. Daoud,
//"Practical minimal perfect hash functions for large databases", CACM, 35(1):105-121

//The actual hash function is the Fowler-Noll-Vo hash function described here:
//https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function

import {FNVHash} from './HashFunctions/fnv_hash';

export class MinimalPerfectHashTable {
    //data is an Object holding the key/value pairs
    constructor(data){
        this.hash = FNVHash;
        this.setData(data);
    }

    setData(data){
        this.data = data;
        this.size = Object.keys(data).length;
        this.buckets = Array.from(Array(this.size), () => new Array());
        this.secondaryIndices = new Array(this.size).fill(0);
        this.values = new Array(this.size);
        this.rehash();
    }

    rehash(){
        Object.keys(this.data).forEach(function (_k) {
            const bucketIdx = this.hash(0, _k) % this.size;
            this.buckets[bucketIdx].push(_k);
        }.bind(this));

        this.buckets.sort(function (a, b) {
            return (a.length > b.length)? -1 : 1;
        });

        for(var b = 0; b < this.buckets.length; b++){

            var bucket = this.buckets[b];
            if(bucket.length <= 1)
                break;
            var d = 1;
            var item = 0;
            var slots = [];

            while(item < bucket.length){
                var slot = this.hash(d, bucket[item]) % this.size;
                if(this.values[slot] !== undefined || slots.indexOf(slot) >= 0){
                    d++;
                    item = 0;
                    slots = [];
                }else{
                    slots.push(slot);
                    item += 1;
                }
            }

            //Setting secondaryIndices by trial-and-error happens in O(n) time according to
            //Belazzougui, Botelho, Dietzfelbinger (2009):
            //http://cmph.sourceforge.net/papers/esa09.pdf

            this.secondaryIndices[this.hash(0, bucket[0]) % this.size] = d;
            for(var i = 0; i < bucket.length; i++){
                this.values[slots[i]] = this.data[bucket[i]]
            }
        }

        var freelist = [];
        for(var i = 0; i < this.values.length; i++){
            if(this.values[i] === undefined)
                freelist.push(i);
        }

        for (b; b < this.size; b++){
            var bucket = this.buckets[b];
            if(bucket.length == 0)
                break;
            var slot = freelist.pop();
            this.secondaryIndices[this.hash(0, bucket[0]) % this.size] = -slot - 1;
            this.values[slot] = this.data[bucket[0]];
        }
    }

    get(key){
        var d = this.secondaryIndices[this.hash(0, key) % this.size];
        if(d < 0)
            return this.values[-d-1];
        return this.values[this.hash(d, key) % this.size];
    }
};