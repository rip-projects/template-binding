import BaseAccessor from './base';

class AttributeAccessor extends BaseAccessor {
  constructor (node, name) {
    super(node, name.slice(0, -1));
  }

  set (value) {
    if (value) {
      this.node.setAttribute(this.name, value);
    } else {
      this.node.removeAttribute(this.name);
    }
  }

  get () {
    return this.node.getAttribute(this.name);
  }
}

export default AttributeAccessor;
