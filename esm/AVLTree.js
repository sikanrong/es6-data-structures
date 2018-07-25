import {BinaryTree, BinaryTreeNode} from './BinaryTree'

export class AVLTreeNode extends BinaryTreeNode {
    constructor (left, key, value, right, parent, balanceFactor){
        super(left, key, value, right, parent);
        Object.assign(this, {balanceFactor});
    }
}

export class AVLTree extends BinaryTree{
    constructor (source_ar){
        super(source_ar, AVLTreeNode);
    }
}