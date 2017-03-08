import BaseAccessor from './base';

class HTMLAccessor extends BaseAccessor {
  set (value = '') {
    this.node.innerHTML = value;
  }

  get () {
    return this.node.innerHTML;
  }
}

export default HTMLAccessor;
