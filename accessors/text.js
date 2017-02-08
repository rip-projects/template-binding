import BaseAccessor from './base';

class TextAccessor extends BaseAccessor {
  constructor (node) {
    super(node, 'textContent');
  }

  set (value) {
    this.node.textContent = typeof value === 'undefined' ? '' : value;
  }
}

export default TextAccessor;
