export class BinaryTreeNode {
    constructor (left, key, value, right, parent){
        Object.assign(this, {left, key, value, right, parent});
        this.height = (parent)? parent.height + 1 : 0;
        this.subtreeMaxHeight = this.height;
    }

    traverse (callback, return_node) {
        this.left && this.left.traverse(callback, return_node);
        callback((return_node)? this : this.value);
        this.right && this.right.traverse(callback, return_node);
    };

    findMin (){
        var _n = this;
        while(_n.left){
            _n = _n.left;
        }
        return _n;
    }

    replaceWith (_n){
        if(this.parent){
            if(Object.is(this.parent.left, this))
                this.parent.left = _n;
            else
                this.parent.right = _n;

            var __n = this.parent;
            while(__n){
                __n.subtreeMaxHeight = (!__n.hasChildren)? __n.height : Math.max((__n.left)? __n.left.subtreeMaxHeight : -1, (__n.right)? __n.right.subtreeMaxHeight : -1);
                __n = __n.parent; //iterate up to the root;
            }
        }
        if(_n){
            _n.parent = this.parent;
            _n.traverse(function (__n) {
                __n.height--;
                __n.subtreeMaxHeight--;
            }, true);
        }
    }

    get isDetached(){
        if(!this.parent) //if object has no parent we cannot test if it doesn't belong to parent.
            return undefined;

        return (!Object.is(this.parent.left, this) && !Object.is(this.parent.right, this));
    }

    get hasChildren(){
        return (this.left || this.right);
    }

    get subtreeHeight(){
        return this.subtreeMaxHeight - this.height;
    }

    calculateSubtreeHeight(){
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

    verify () {
        //verify is binary tree.
        var verifyNode = (_node) => {
            if(!_node)
                return true;
            if(
                (_node.left && _node.left.key > _node.key) ||
                (_node.right && _node.right.key < _node.key)
            )
                return false;

            if(_node.parent && (_node.parent.height + 1) != _node.height)
                return false;

            var calculatedSubtreeHeight = _node.calculateSubtreeHeight();
            if(_node.subtreeHeight != calculatedSubtreeHeight)
                return false;


            return (verifyNode(_node.left) && verifyNode(_node.right));
        }

        return verifyNode(this.root);
    }

    insert (key, value){
        var _inserted = null;
        var _insert_path = [];
        var insertRecursive = (_node, _parent) => {
            if(_node)
                _insert_path.push(_node);

            if(_node == null){
                _inserted = _node = new this.nodeClass(null, key, value, null, _parent);
                _insert_path.forEach(function (_p) {
                    _p.subtreeMaxHeight = Math.max(_p.subtreeMaxHeight, _node.height);
                });
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
        return this.root.traverse(callback, return_node);
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
                    return _node;
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

            var whichChild = (_n.isLeftChild)? 'left' : 'right';

            if(_n.left && _n.right){
                var successor = _n.right.findMin();
                _n.key = successor.key;
                _n.value = successor.value;
                return deleteRecursive(successor, successor.key);
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

            return {
                node: _n,
                whichChild: whichChild
            };
        }.bind(this);

        return deleteRecursive(this.root, key);
    }
}