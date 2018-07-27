import test from 'ava';
import {BinaryTree, AVLTree} from './esm/index';
import RandomSeed from 'random-seed';
import DeterministicIdGenerator from './esm/util/deterministic_id';

const determinism_seed = "viscalaterralliure";
const btree_size = 25; //in nodes
const node_value_upper = 10000000;

var determinism = RandomSeed.create();
determinism.seed(determinism_seed);
const _dig = new DeterministicIdGenerator(determinism_seed);
const nodes_ar = [];

//generate pseudo-random source data
while(nodes_ar.length < btree_size){
    nodes_ar.push({
        key: determinism(node_value_upper),
        value: _dig.generateId()
    });
}

var bst;

test('Should correctly construct a BSTree from source data', (t) => {
    t.notThrows(function () {
        bst = new BinaryTree(nodes_ar);
    });

    t.true(bst.verify());
});

test('Should return correct value for BSTree key search', (t) => {
    //pick a node and search for its key in the tree
    var searchFor = nodes_ar[nodes_ar.length - 1];
    t.is(bst.search(searchFor.key), searchFor.value);
});

test('traversing the BSTree should return values in-order sorted by key', t => {
    var sortedNodes = nodes_ar.concat().sort(function (_a, _b) {
        return (_a.key > _b.key)? 1 : -1;
    });

    var sortedValues = sortedNodes.map(function (_n) {
        return _n.value;
    });

    var traversedValues = [];
    bst.traverse(function (_value) {
        traversedValues.push(_value);
    });

    t.deepEqual(traversedValues, sortedValues);
    t.true(bst.verify());
});

test('should correctly delete a key and reorganize the BSTree', (t) => {
    var lastNode = nodes_ar[nodes_ar.length - 1];
    var firstNode = nodes_ar[0]; //is root node
    bst.delete(lastNode.key);
    t.true(bst.verify());

    t.is(bst.root.key, 6875854);
    bst.delete(firstNode.key);

    t.true(bst.verify());
    t.falsy(bst.search(lastNode.key), "node is no longer in the tree");
    t.is(bst.root.key, 6998894, "the trees root node was correctly updated");
});

test('insert should correctly insert a node into the BSTree, and return the inserted node', t => {
    var firstNode = nodes_ar[0];
    var inserted = bst.insert(firstNode.key, firstNode.value);
    t.is(inserted.value, firstNode.value);
    t.true(bst.verify());
    t.is(bst.search(firstNode.key), firstNode.value);
});

var avl = new AVLTree([]);
test('should correctly create a balanced AVLTree from the data', (t) => {
    nodes_ar.forEach(function (_n) {
        avl.insert(_n.key, _n.value);
        var _v = avl.verify();
        t.true(_v);
    });

    t.true(avl.verify());
});

test("AVLTree should rebalance itself after a deletion leaves it in an AVL-unbalanced state", (t)=>{
    nodes_ar.forEach(function (_n) {
        avl.delete(_n.key);
        t.falsy(avl.search(_n.key)); //node removed
        var _v = avl.verify();
        t.true(_v);
    });

});