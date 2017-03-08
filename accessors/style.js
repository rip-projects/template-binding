import BaseAccessor from './base';

class StyleAccessor extends BaseAccessor {
  set (value = '') {
    this.node.style[this.name] = value;
  }

  get () {
    throw new Error('Unimplemented');
  }
}

export default StyleAccessor;
