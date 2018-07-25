import test from 'ava';
import {BinaryTree} from './esm/index';
import RandomSeed from 'random-seed';
import DeterministicIdGenerator from './esm/util/deterministic_id';

const determinism_seed = "viscalaterralliure";
const btree_size = 10; //in nodes
const node_value_upper = 100;

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

test('Should correctly construct a BST from source data', (t) => {
    t.notThrows(function () {
        bst = new BinaryTree(nodes_ar);
    });

    //verify is binary tree.
    var verifyNode = function(_node){
        if(!_node)
            return true;
        if(
            (_node.left && _node.left.key > _node.key) ||
            (_node.right && _node.right.key < _node.key)
        )
            return false;
        return (verifyNode(_node.left) && verifyNode(_node.right));
    }

    t.true(verifyNode(bst.root));
});

test('Should return correct value for btree key search', (t) => {
    //pick a node and search for its key in the tree
    var searchFor = nodes_ar[nodes_ar.length - 1];
    t.is(bst.search(searchFor.key), searchFor.value);
});

test('traversing the bst should return values in-order sorted by key', t => {
    var sortedValues = nodes_ar.concat().sort(function (_a, _b) {
        return _a.key > _b.key;
    }).map(function (_n) {
        return _n.value;
    });

    var traversedValues = [];
    bst.traverse(function (_value) {
        traversedValues.push(_value);
    });

    t.deepEqual(traversedValues, sortedValues);
});

test('should correctly delete a key and reorganize the tree', (t) => {
    var lastNode = nodes_ar[nodes_ar.length - 1];
    var firstNode = nodes_ar[0]; //is root node
    bst.delete(lastNode.key);
    t.is(bst.root.key, 68);
    bst.delete(firstNode.key);

    t.falsy(bst.search(lastNode.key), "node is no longer in the tree");
    t.is(bst.root.key, 69, "the trees root node was correctly updated");

});