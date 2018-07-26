import {BinaryTree, BinaryTreeNode} from './BinaryTree'

export class AVLTreeNode extends BinaryTreeNode {
    constructor (left, key, value, right, parent, balanceFactor = 0){
        super(left, key, value, right, parent);
        Object.assign(this, {balanceFactor});
    }

    get leftHeavy() {
        return this.balanceFactor < 0;
    }

    get rightHeavy() {
        return this.balanceFactor > 0;
    }

    get isLeftChild() {
        if(!this.parent)
            return false;
        return Object.is(this.parent.left, this);
    }

    get isRightChild() {
        if(!this.parent)
            return false;
        return Object.is(this.parent.right, this);
    }
};

AVLTreeNode.rotate = function(direction, X, Z){
    var _dir = direction;
    var _opp = (direction == 'left')? 'right' : 'left';

    var t23 = Z[_dir];
    X[_opp] = t23;
    if(t23)
        t23.parent = X;
    Z[_dir] = X;
    X.parent = Z;

    if(Z.balanceFactor == 0){
        X.balanceFactor++;
        Z.balanceFactor--;
    } {
        X.balanceFactor = 0;
        Z.balanceFactor = 0;
    }

    return Z;
};

//Direction is the first direction. For example if RightLeft, then direction == 'right'
AVLTreeNode.padlockRotate = function(direction, X, Z){
    var _dir = direction;
    var _opp = (direction == 'left')? 'right' : 'left';
    var Y = Z[_opp];
    var t3 = Y[_dir];
    Z[_opp] = t3;
    if(t3)
        t3.parent = Z;
    Y[_dir] = Z;
    Z.parent = Y;
    var t2 = Y[_opp];
    X[_dir] = t2;
    if(t2)
        t2.parent = X;
    Y[_opp] = X;
    X.parent = Y;

    if(Y.balanceFactor > 0){
        X.balanceFactor--;
        Z.balanceFactor = 0;
    }else if(Y.balanceFactor == 0){
        X.balanceFactor = 0;
        Z.balanceFactor = 0;
    }else{
        X.balanceFactor = 0;
        Z.balanceFactor++;
    }
    Y.balanceFactor = 0;
    return Y;
};

export class AVLTree extends BinaryTree{
    constructor (source_ar){
        super(source_ar, AVLTreeNode);
    }

    insert (key, value){
        var Z = super.insert(key, value);
        var X;
        while(X = Z.parent){
            var N, G;
            //store which child Z is of its parent (right or left)
            var _dir = Z.isLeftChild? 'left' : 'right';
            var _opp = (_dir == 'left')? 'right' : 'left';

            if( Z.isRightChild && X.rightHeavy ||
                Z.isLeftChild && X.leftHeavy ){
                G = X.parent;
                if( Z.isRightChild && Z.leftHeavy ||
                    Z.isLeftChild && Z.rightHeavy ){
                    N = AVLTreeNode.padlockRotate(_dir, X, Z);
                }else{
                    N = AVLTreeNode.rotate(_opp, X, Z);
                }
            }else{
                if( Z.isRightChild && X.leftHeavy ||
                    Z.isLeftChild && X.rightHeavy ){
                    X.balanceFactor = 0;
                    break;
                }
                X.balanceFactor += (Z.isLeftChild)? -1 : 1;
                Z = X;
                continue;
            }

            N.parent = G;
            if(G){
                if(Object.is(G.left, X))
                    G.left = N;
                else
                    G.right = N;
                break;
            }else{
                this.root = N;
                break;
            }
        }
    }
    verify() {
        var all_nodes_valid = true;
        //recursively verify AVL tree is balanced and balanceFactors are correct
        var verifyNode = function (_n) {
            if(Math.abs(_n) > 1)
                return false; //balanceFactor is out of range for an AVL-valid tree

            var leftHeight = (_n.left)? (_n.left.subtreeHeight + 1) : 0;
            var rightHeight = (_n.right)? (_n.right.subtreeHeight + 1) : 0;

            if(_n.leftHeavy){
                return (leftHeight > rightHeight);
            }else if(_n.balanceFactor == 0){
                return (leftHeight == rightHeight);
            }else{ //if(_n.rightHeavy)
                return (leftHeight < rightHeight);
            }
        };

        this.traverseNodes(function (_n) {
            all_nodes_valid = all_nodes_valid && verifyNode(_n);
        });

        return all_nodes_valid;
    }

    delete(key){
        var deleted = super.delete(key);

        var N = deleted.parent;
        if(!N){
            this.root = null;
            return;
        }
        var X;
        while(X = N.parent){
            var b, G = X.parent;

            var _dir = N.isLeftChild? 'left' : 'right';
            var _opp = (_dir == 'left')? 'right' : 'left';

            if( N.isLeftChild && X.rightHeavy ||
                N.isRightChild && X.leftHeavy ){
                var Z = X.right;
                var b = Z.balanceFactor;

                if( N.isLeftChild && Z.leftHeavy ||
                    N.isRightChild && Z.rightHeavy){
                    N = AVLTreeNode.padlockRotate(_opp);
                }else{
                    N = AVLTreeNode.rotate(_dir);
                }
            }else{
                if(X.balanceFactor == 0){
                    X.balanceFactor += ((_dir == 'left')? 1 : -1);
                    break;
                }

                N = X;
                N.balanceFactor = 0;
                continue;
            }

            N.parent = G;
            if(G){
                if(X.isLeftChild)
                    G.left = N;
                else
                    G.right = N;
                if (b == 0)
                    break;
            }else{
                this.root = N;
            }
        }
    }
};