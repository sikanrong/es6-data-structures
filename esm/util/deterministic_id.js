var RandomSeed = require('random-seed');

var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var ID_LENGTH = 8; //218 Trillion unique ID space

export default class{
    constructor (seed){
        this.determinism = RandomSeed.create(seed);
    }

    setSeed (seed){
        this.determinism.seed(seed);
    }

    generateId () {
        var _id = '';

        for (var i = 0; i < ID_LENGTH; i++) {
            _id += ALPHABET.charAt(Math.floor(this.determinism.random() * ALPHABET.length));
        }
        return _id;
    };
}