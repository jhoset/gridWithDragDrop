
export const tableRow = (node) => {
  if (node.tagName) {
    return node.tagName.toLowerCase() === 'tr';
  }
};

export const closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};
