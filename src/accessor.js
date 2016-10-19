/* globals Node */

class BaseAccessor {
  constructor (node, name) {
    this.node = node;
    this.name = name;
  }

  set (value) {
    if (typeof this.node.set === 'function') {
      this.node.set(this.name, value);
    } else {
      this.node[this.name] = value;
    }
  }

  get () {
    if (typeof this.node.get === 'function') {
      return this.node.get(this.name);
    } else {
      return this.node[this.name];
    }
  }
}

class TextAccessor extends BaseAccessor {
  constructor (node) {
    super(node, 'textContent');
  }

  set (value) {
    this.node.textContent = value || '';
  }

  get () {
    return this.node.textContext;
  }
}

class ValueAccessor extends BaseAccessor {
  set (value) {
    super.set(value || '');
  }
}

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

function get (node, name) {
  if (node && 'nodeType' in node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (name.endsWith('$')) {
          return new AttributeAccessor(node, name);
        } else if (name === 'value') {
          return new ValueAccessor(node, name);
        }

        return new BaseAccessor(node, name);
      case Node.TEXT_NODE:
        if (node.parentElement && node.parentElement.nodeName === 'TEXTAREA') {
          return new ValueAccessor(node.parentElement, 'value');
        }

        return new TextAccessor(node);
      default:
        throw new Error(`Unimplemented resolving accessor for nodeType: ${node.nodeType}`);
    }
  } else {
    return new BaseAccessor(node, name);
  }
}

module.exports = BaseAccessor;
module.exports.get = get;
