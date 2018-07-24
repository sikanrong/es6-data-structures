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
        source_ar.forEach(_pair => {
            this.insert(_pair.key, _pair.value);
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

    traverse (callback){
        var traverseRecursive = function (_node) {
            if(!_node)
                return;
            traverseRecursive(_node.left);
            callback(_node.value);
            traverseRecursive(_node.right);
        };

        return traverseRecursive(this.root);
    }

    search(key){
        var searchRecursive = function (_node) {
            if(!_node)
                return;
            if(key == _node.key)
                return _node.value;
            if(key > _node.key)
                return searchRecursive(_node.right);
            else
                return searchRecursive(_node.left);
        };
        return searchRecursive(this.root);
    }
}