class BTreeNode {
    constructor (left, key, value, right){
        Object.assign(this, {
            left: left,
            key: key,
            value: value,
            right: right
        });
    }
}

export default class {
    constructor (source_ar){
        this.root = null;
        source_ar.forEach(_k => {
            this.insert(_k, undefined); //value unused for tests
        });
    }

    insert (key, value){
        var insertRecursive = (_node) => {
            if(_node == null)
                return new BTreeNode(null, key, value, null);
            if(_node.key == key)
                return new BTreeNode(_node.left, key, value, _node.right)
            if( key < _node.key)
                return new BTreeNode(insertRecursive(_node.left), _node.key, _node.value, _node.right);
            else
                return new BTreeNode(_node.left, _node.key, _node.value, insertRecursive(_node.right));

        };
        this.root = insertRecursive(this.root);
    }
}