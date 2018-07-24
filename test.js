import test from 'ava';
import {BinaryTree} from './esm/index';
import RandomSeed from 'random-seed';

const determinism_seed = "viscalaterralliure";
const btree_size = 10; //in nodes
const node_value_upper = 100;

test('Should correctly construct a BST from source data', (t) => {
    var determinism = RandomSeed.create();
    determinism.seed(determinism_seed);
    var nodes_ar = [];

    //generate pseudo-random source data
    while(nodes_ar.length < btree_size){
        nodes_ar.push(determinism(node_value_upper));
    }

    var bst = new BinaryTree(nodes_ar);

    t.pass();
});