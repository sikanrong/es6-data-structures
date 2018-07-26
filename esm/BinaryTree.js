export class BinaryTreeNode {
    constructor (left, key, value, right, parent){
        Object.assign(this, {left, key, value, right, parent});
    }

    findMin (){
        var _n = this;
        while(_n.left){
            _n = _n.left;
        }
        return _n;
    }

    replaceWith (_n){
        if(this.parent)
            if(this.parent.left == this)
                this.parent.left = _n;
            else
                this.parent.right = _n;
        if(_n)
            _n.parent = this.parent;

    }

    get hasChildren(){
        return (this.left || this.right);
    }

    get subtreeHeight(){
        var deepest = 0;
        const countDepthRecursive = (_n, _h = 0) => {
            if(!_n)
                return;
            if(deepest < _h)
                deepest = _h;
            if(_n.hasChildren){
                countDepthRecursive(_n.left, _h + 1);
                countDepthRecursive(_n.right, _h + 1);
            }else{
                return;
            }
        };

        countDepthRecursive(this);

        return deepest;

    }
}
//Average performance of a Binary tree for search and insert is O(log n);
//worst case is O(n) if the unbalanced tree becomes a linked list.
export class BinaryTree{
    constructor (source_ar, nodeClass=BinaryTreeNode){
        this.root = null;
        this.nodeClass = nodeClass;
        source_ar.forEach(_pair => {
            this.insert(_pair.key, _pair.value);
        });
    }

    insert (key, value){
        var _inserted = null;
        var insertRecursive = (_node, _parent) => {
            if(_node == null){
                _inserted = _node = new this.nodeClass(null, key, value, null, _parent);
            }else if(_node.key == key){
                _node.value = value;
                _inserted = _node;
            }else if( key < _node.key)
                _node.left = insertRecursive(_node.left, _node);
            else
                _node.right = insertRecursive(_node.right, _node);
            return _node;
        };
        this.root = insertRecursive(this.root);
        return _inserted;
    }

    traverseNodes (callback){
        return this.traverse(callback, true);
    }

    traverse (callback, return_node = false){
        var traverseRecursive = function (_node) {
            if(!_node)
                return;
            traverseRecursive(_node.left);
            callback(return_node? _node : _node.value);
            traverseRecursive(_node.right);
        };

        return traverseRecursive(this.root);
    }

    searchNode(key){
        return this.search(key, true);
    }

    search(key, return_node = false){
        var searchRecursive = function (_node) {
            if(!_node)
                return;
            if(key == _node.key){
                if(return_node)
                    return node;
                else
                    return _node.value;
            }
            if(key > _node.key)
                return searchRecursive(_node.right);
            else
                return searchRecursive(_node.left);
        };
        return searchRecursive(this.root);
    }

    delete(key){

        var deleteRecursive = function (_n, _k) {
            if(_k < _n.key)
                return deleteRecursive(_n.left, _k);
            if(_k > _n.key)
                return deleteRecursive(_n.right, _k);

            if(_n.left && _n.right){
                var successor = _n.right.findMin();
                _n.key = successor.key;
                _n.value = successor.value;
                deleteRecursive(successor, successor.key);
            }else if (_n.left){
                if(Object.is(this.root, _n))
                    this.root = _n.left;
                _n.replaceWith(_n.left);
            }else if (_n.right){
                if(Object.is(this.root, _n))
                    this.root = _n.right;
                _n.replaceWith(_n.right);
            }else{
                if(Object.is(this.root, _n))
                    this.root = null;
                _n.replaceWith(null);
            }
            return _n; //return deleted node
        }.bind(this);

        return deleteRecursive(this.root, key);
    }
}