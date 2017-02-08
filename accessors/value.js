import BaseAccessor from './base';

class ValueAccessor extends BaseAccessor {
  constructor (node) {
    super(node, 'value');
  }

  set (value) {
    if (document.activeElement !== this.node) {
      super.set(typeof value === 'undefined' ? '' : value);
    }
  }
}

export default ValueAccessor;
