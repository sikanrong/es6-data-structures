import test from 'ava';
import {
    BinaryTree,
    AVLTree,
    LinkedList,
    DoublyLinkedList,
    BinaryHeap,
    MinimalPerfectHashTable,
    LomutoPerfectHashTable
} from './esm/index';
import RandomSeed from 'random-seed';
import {DeterministicUniqId} from 'deterministic-uniqid';

const determinism_seed = "Ac1dBurnZeroCool";
const btree_size = 100; //in nodes
const node_value_upper = 10000000;

var determinism = RandomSeed.create();
determinism.seed(determinism_seed);
const _dig = new DeterministicUniqId(determinism_seed);
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

    t.is(bst.root.key, 6895060);
    bst.delete(firstNode.key);

    t.true(bst.verify());
    t.falsy(bst.search(lastNode.key), "node is no longer in the tree");
    t.is(bst.root.key, 6993413, "the trees root node was correctly updated");
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

    t.notThrows(function () {
       avl = new AVLTree(nodes_ar);
    });

    t.true(avl.verify());
});

test("AVLTree should rebalanceDown itself after a deletion leaves it in an AVL-unbalanced state", (t)=>{
    nodes_ar.forEach(function (_n) {
        avl.delete(_n.key);
        t.falsy(avl.search(_n.key)); //node removed
        var _v = avl.verify();
        t.true(_v);
    });
});

var ll;
var ll_values = nodes_ar.map(_n => {return _n.value});
test("Should correctly build a LinkedList", (t) => {
    t.notThrows(function () {
        ll = new LinkedList(ll_values);
    }.bind(this));

    var _a = [];
    var _n = ll.root;
    while(_n = _n.next)
        if(!Object.is(_n, ll.tail))
            _a.push(_n.data);

    t.deepEqual(_a, ll_values);
});

test("should find a node in the LinkedList", (t) => {
    var _v = ll_values[ll_values.length - 1];
    t.is(ll.search(_v).data, _v);
});

test("should iterate through the array and include all items in the LinkedList", (t) => {
    var iter_a = [];
    ll.iterate((_n) => {iter_a.push(_n.data)});
    t.deepEqual(iter_a, ll_values);
});

var sampleData = "BADF00D";

test("Should unshift a node to the LinkedList (add to the front)", t => {
    var _f = ll.root.next;
    var _n = ll.unshift(sampleData);
    t.is(ll.search(sampleData), _n);
    t.is(ll.root.next, _n);
    t.is(_n.next, _f);
});

test("should remove a node from the LinkedList", (t) => {
    ll.remove(sampleData);
    t.falsy(ll.search(sampleData));

    t.notThrows(function () {
        ll.remove(sampleData); //remove already-removed node
    });

    t.notThrows(function () {
        ll.iterate(function () {
            //do nothing
        });
    });
});

test("should append a node to the tail of the LinkedList", (t) => {
    var _n = ll.append(sampleData);
    t.is(_n.next, ll.tail);

    t.is(ll.search(sampleData), _n);
});

test("LinkedListNode#insertAfter should let me splice in another LinkedList nodeChain into the existing list", (t) => {
    var _n = ll.search(sampleData);
    var data_ar = ['a', 'b', 'c'];
    _n.insertAfter(new LinkedList(data_ar).root);
    var _a = [];
    while(_n = _n.next){
        _a.push(_n.data);
    }

    t.deepEqual(_a, data_ar.concat([null]));
});

var dll;

test("Should construct a DoublyLinkedList from the test data", t => {
    t.notThrows(function () {
        dll = new DoublyLinkedList(ll_values);
    });

    var _a = [];
    dll.iterate(_n => {_a.push(_n)});
    t.deepEqual(_a.map(_n => {return _n.data}), ll_values);
});

test("DoublyLinkedList should be able to iterate backwards through the array", t => {
    var _a = [];
    dll.reverseIterate(_n => {_a.push(_n)});
    t.deepEqual(_a.map(_n => {return _n.data}), ll_values.concat().reverse());
});

test("DoublyLinkedList should be able to remove an element and reappend it to the tail; always maintaining prev and next links", t => {
    var last_val = ll_values[ll_values.length - 1];
    var _removed = dll.remove(last_val);
    t.is(last_val, _removed.data);
    t.falsy(dll.search(last_val));
    var _n = dll.append(last_val);
    t.is(_n.prev, _removed.prev);
    t.is(_n.next, dll.tail);
    t.truthy(dll.search(last_val));
});

test("DoublyLinkedList should return node of searched item", t => {
    var middle_val = ll_values[Math.floor(ll_values.length / 2)];
    t.is(dll.search(middle_val).data, middle_val);
});

var heap, heap_keys = nodes_ar.map(_n => {return _n.key});
test("BinaryHeap should correctly organize itself into a valid state", t => {
    t.notThrows(() => {
        heap = new BinaryHeap(heap_keys);
    });

    t.true(heap.verify());
});

test("BinaryHeap should rebalanceUp after insert", t => {
    var new_key = heap.heapArray[0] + 1;
    heap.insert(new_key);
    t.true(heap.verify());
    t.is(heap.heapArray[0], new_key, "new key bubbled up to the top of the heap");
});

test("BinaryHeap#delete should rebalance both down and up after deletion", t => {
    var toRemove = Math.floor(heap.heapArray.length / 2);
    var removedValue = heap.heapArray[toRemove];
    heap.remove(toRemove);
    t.is(-1, heap.heapArray.indexOf(removedValue));
    t.true(heap.verify());
});

test("BinaryHeap#delete should rebalanceDown after root deletion", t => {
    var removedIndex = 0;
    var removedValue = heap.heapArray[removedIndex];
    heap.remove(removedIndex);
    t.is(-1, heap.heapArray.indexOf(removedValue));
    t.true(heap.verify());
});

var mpht, lpht;
var hash_data = {};
nodes_ar.forEach(_n => {
    hash_data[_n.value] = _n.key;
});
test("MinimalPerfectHashTable should construct the table and search all source data key-by-key to verify", t => {
    t.notThrows(() => {
        mpht = new MinimalPerfectHashTable(hash_data);
    });

    Object.keys(hash_data).forEach(_k => {
        t.is(mpht.get(_k), hash_data[_k]);
    });
});

test("LomutoPerfectHashTable should construct hashtable and search all source data key-by-key to verify", t => {
    t.notThrows(() => {
        lpht = new LomutoPerfectHashTable(hash_data);
    });

    Object.keys(hash_data).forEach(_k => {
        var actual = lpht.get(_k);
        var expected = hash_data[_k];
        t.is(expected, actual);
    });
});