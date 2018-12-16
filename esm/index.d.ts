export declare interface BTDatum {
    key: number;
    value: any;
}

export declare class BinaryTreeNode implements BTDatum {
    public left:BinaryTreeNode;
    public right: BinaryTreeNode;
    public parent: BinaryTreeNode;

    public key: number;
    public value: any;

    public constructor(left: BinaryTreeNode, key: number, value: any, right: BinaryTreeNode, parent: BinaryTreeNode);

    public traverse(callback: Function, return_node: boolean): void;
    public findMin(): BinaryTreeNode;
    public replaceWith(_n: BinaryTreeNode): void;
    public isDetached: boolean;
    public hasChildren: boolean;
    public calculateSubtreeHeight(): number;
}

export declare class BinaryTree {
    public constructor(source_ar: BTDatum[]);
    public constructor(source_ar: BTDatum[], nodeClass: Function);

    public verify(): boolean;
    public insert(key: number, value: any): void;
    public traverseNodes(callback: Function): void;
    public traverse(callback: Function, return_node: boolean): void;
    public searchNode(key: number): any | void;
    public search(key: number, return_node: boolean): BinaryTreeNode| any | void;
    public delete(key: number): void;
}

export declare class AVLTreeNode extends BinaryTreeNode {
    public balanceFactor: number;
    public constructor(left: BinaryTreeNode, key: number, value: any, right: BinaryTreeNode, parent: BinaryTreeNode, balanceFactor: number);
    public leftHeavy(): boolean;
    public rightHeavy(): boolean;
    public isLeftChild(): boolean;
    public isRightChild(): boolean;

    public static rotate(direction: string, X: AVLTreeNode, Z: AVLTreeNode): AVLTreeNode;
    public static rotate(direction: string, X: AVLTreeNode, Z: AVLTreeNode): AVLTreeNode;
}

export declare class AVLTree extends BinaryTree {
    public constructor(source_ar: BTDatum[]);
}