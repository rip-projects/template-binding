import BaseAccessor from './base';

class HTMLAccessor extends BaseAccessor {
  set (value) {
    this.node.innerHTML = typeof value === 'undefined' ? '' : value;
  }

  get () {
    return this.node.innerHTML;
  }
}

export default HTMLAccessor;
