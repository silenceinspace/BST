// Every element in a binary search tree is a node
class Node {
  constructor(data, leftChildren = null, rightChildren = null) {
    this.data = data;
    this.leftChildren = leftChildren;
    this.rightChildren = rightChildren;
  }
}

// Create a queue data structure to enable proper breadth first traversal in a binary search tree
class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.items[this.tail] = element;
    this.tail++;
  }

  dequeue() {
    delete this.items[this.head];
    this.head++;
  }

  peek() {
    return this.items[this.head];
  }

  isEmpty() {
    if (this.tail === this.head) {
      return true;
    } else {
      return false;
    }
  }
}

// Tree has a root element at the very top
class Tree {
  constructor(rootNode) {
    this.root = rootNode;
  }

  insert(value, node = this.root) {
    if (this.root === null) {
      return (this.root = new Node(value));
    }

    if (node === null) {
      return new Node(value);
    }

    if (node.data > value) {
      node.leftChildren = this.insert(value, node.leftChildren);
    } else if (node.data < value) {
      node.rightChildren = this.insert(value, node.rightChildren);
    }

    return node;
  }

  delete(value, node = this.root) {
    if (node === null) return node;

    if (node.data > value) {
      node.leftChildren = this.delete(value, node.leftChildren);
    } else if (node.data < value) {
      node.rightChildren = this.delete(value, node.rightChildren);
    }

    if (node.data === value) {
      // Case 1 - deleting a leaf node that can be a root
      if (node.leftChildren === null && node.rightChildren === null) {
        if (this.root === node) {
          return (this.root = null);
        } else {
          return (node = null);
        }
      }

      // Case 2 - deleting a node with one child that can be a root
      if (node.leftChildren === null) {
        if (this.root === node) {
          return (this.root = node.rightChildren);
        } else {
          return node.rightChildren;
        }
      } else if (node.rightChildren === null) {
        if (this.root === node) {
          return (this.root = node.leftChildren);
        } else {
          return node.leftChildren;
        }
      }

      // Case 3 - deleting a node with two children
      if (node.leftChildren !== null && node.rightChildren !== null) {
        let wholeBranch = node;

        let nextLargest;
        node = node.rightChildren;
        while (node.leftChildren !== null) {
          node = node.leftChildren;
        }
        nextLargest = node;

        // Recursevily delete the next largest node and return a tree (starting from node I am trying to delete) without it
        let temp = this.delete(nextLargest.data, wholeBranch);
        temp.data = nextLargest.data;

        return temp;
      }
    }
    return node;
  }

  find(value, node = this.root) {
    if (node === null || value == undefined) return null;
    if (node.data === value) return node;

    if (value > node.data) {
      node = this.find(value, node.rightChildren);
    } else if (value < node.data) {
      node = this.find(value, node.leftChildren);
    }
    return node;
  }

  // Breadth first traversal of a binary search tree
  levelOrder(callback) {
    let node = this.root;
    const arrayWithNodes = [];

    const queue = new Queue();
    queue.enqueue(node);
    arrayWithNodes.push(queue.peek());

    while (true) {
      if (node.leftChildren !== null) {
        queue.enqueue(node.leftChildren);
      }
      if (node.rightChildren !== null) {
        queue.enqueue(node.rightChildren);
      }

      queue.dequeue();
      if (queue.isEmpty()) break;

      arrayWithNodes.push(queue.peek());
      node = queue.peek();
    }

    if (!callback) {
      return displayDefaultValues(arrayWithNodes);
    } else {
      arrayWithNodes.forEach(callback);
    }
  }

  // Depth first traversals
  preOrder(callback, node = this.root, arrayWithNodes = []) {
    if (node === null) return arrayWithNodes;

    arrayWithNodes.push(node);
    this.preOrder(callback, node.leftChildren, arrayWithNodes);
    this.preOrder(callback, node.rightChildren, arrayWithNodes);

    if (!callback && node === this.root) {
      return displayDefaultValues(arrayWithNodes);
    } else if (callback && node === this.root) {
      arrayWithNodes.forEach(callback);
    }
  }

  inOrder(callback, node = this.root, arrayWithNodes = []) {
    if (node === null) return arrayWithNodes;

    this.inOrder(callback, node.leftChildren, arrayWithNodes);
    arrayWithNodes.push(node);
    this.inOrder(callback, node.rightChildren, arrayWithNodes);

    if (!callback && node === this.root) {
      return displayDefaultValues(arrayWithNodes);
    } else if (callback && node === this.root) {
      arrayWithNodes.forEach(callback);
    }
  }

  postOrder(callback, node = this.root, arrayWithNodes = []) {
    if (node === null) return arrayWithNodes;

    this.postOrder(callback, node.leftChildren, arrayWithNodes);
    this.postOrder(callback, node.rightChildren, arrayWithNodes);
    arrayWithNodes.push(node);

    if (!callback && node === this.root) {
      return displayDefaultValues(arrayWithNodes);
    } else if (callback && node === this.root) {
      arrayWithNodes.forEach(callback);
    }
  }

  // Height and Depth expect an input node with all its references not a value => height(tree.root.rightChildren)
  height(node) {
    if (node === null) return -1;

    let leftHeight = this.height(node.leftChildren);
    let rightHeight = this.height(node.rightChildren);
    let largerHeight = Math.max(leftHeight, rightHeight) + 1;

    return largerHeight;
  }

  depth(givenNode, node = this.root, counter = 0) {
    if (givenNode === undefined || givenNode === null) return null;
    if (givenNode.data === node.data) return counter;

    let result;
    if (givenNode.data > node.data) {
      result = this.depth(givenNode, node.rightChildren, (counter += 1));
      if (result === null) return null;
      else return result;
    } else if (givenNode.data < node.data) {
      result = this.depth(givenNode, node.leftChildren, (counter += 1));
      if (result === null) return null;
      else return result;
    }
  }

  isBalanced() {
    const allTreeNodes = this.levelOrder();

    // Check heights of left and right subtrees on every node
    return allTreeNodes.every((node) => {
      const parent = this.find(node);

      const leftSubtree = parent.leftChildren;
      const rightSubtree = parent.rightChildren;

      if (leftSubtree === null && rightSubtree === null) return true;

      const leftHeight = this.height(leftSubtree);
      const rightHeight = this.height(rightSubtree);
      const diff = leftHeight - rightHeight;

      if (-1 <= diff && diff <= 1) {
        return true;
      } else return false;
    });
  }

  rebalance() {
    const isBalanced = this.isBalanced();
    if (isBalanced === true) return 'Initial tree is already balanced';

    const array = this.levelOrder();
    this.root = buildTree(array);
    prettyPrint(this.root);
    return 'Tree has been rebalanced';
  }
}

// Helper functions:
function callbackFunc(node, counter = 0) {
  counter++;
  console.log(`Element ${counter}:`);
  console.log(node.data);
}

function displayDefaultValues(array) {
  const values = [];
  for (const node of array) {
    values.push(node.data);
  }
  return values;
}

// Creates a binary search tree from an array
function buildTree(array) {
  let sortedArray = sortArray(array);
  sortedArray = removeDuplicates(array);

  return buildTreeHelper(sortedArray);
}

function buildTreeHelper(array, start = 0, end = array.length - 1) {
  if (start > end) return null;

  const mid = Math.floor((start + end) / 2);
  const root = new Node(array[mid]);

  root.leftChildren = buildTreeHelper(array, start, mid - 1);
  root.rightChildren = buildTreeHelper(array, mid + 1, end);

  return root;
}

function sortArray(array) {
  const sorted = array.sort((a, b) => a - b);
  return sorted;
}

// Map data structure allows to have only unique keys, so it's a nice way to avoid duplicates
function removeDuplicates(array) {
  const mapObject = new Map();
  for (let i = 0; i < array.length; i++) {
    mapObject.set(array[i], undefined);
  }

  const uniqueArray = [];
  for (const key of mapObject.keys()) {
    uniqueArray.push(key);
  }

  return uniqueArray;
}

// Visual representation of a tree in the console
function prettyPrint(node, prefix = '', isLeft = true) {
  if (node === null) {
    return;
  }
  if (node.rightChildren !== null) {
    prettyPrint(
      node.rightChildren,
      `${prefix}${isLeft ? '│   ' : '    '}`,
      false
    );
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.leftChildren !== null) {
    prettyPrint(
      node.leftChildren,
      `${prefix}${isLeft ? '    ' : '│   '}`,
      true
    );
  }
}

//
// Driver Script
//
function testProgram(number = 20) {
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  console.log(`Generating an array with ${number} random numbers below 100...`);
  const randomNumbers = [];
  for (let i = 0; i < number; i++) {
    const randomNumber = generateRandomNumber(0, 99);
    randomNumbers.push(randomNumber);
  }

  // Step 1
  console.log('Building a tree off the previously generated array...');
  const tree = new Tree(buildTree(randomNumbers));
  console.log(tree);
  console.log(prettyPrint(tree.root));

  // Step 2
  console.log('Confirming that the tree is balanced...', tree.isBalanced());

  // Step 3
  console.log('Breadth-first order: ', tree.levelOrder());
  console.log('Preorder order: ', tree.preOrder());
  console.log('Inorder order: ', tree.inOrder());
  console.log('Postorder order: ', tree.postOrder());

  // Step 4
  console.log(
    'Unbalancing the tree by adding a few random numbers from 100 to 1000...'
  );
  for (let i = 0; i < 5; i++) {
    const randomNumber = generateRandomNumber(101, 1000);
    tree.insert(randomNumber);
  }

  // Step 5
  console.log(
    'Confirming that the tree is unbalanced...(===false)',
    tree.isBalanced()
  );
  console.log(prettyPrint(tree.root));

  // Step 6
  console.log('Rebalancing the tree...');
  console.log(tree.rebalance());

  // Step 7
  console.log('Confirming that the tree is balanced...', tree.isBalanced());

  // Step 8
  console.log('Breadth-first order: ', tree.levelOrder());
  console.log('Preorder order: ', tree.preOrder());
  console.log('Inorder order: ', tree.inOrder());
  console.log('Postorder order: ', tree.postOrder());
}

console.log(testProgram(1000));
