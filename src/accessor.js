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
    this.node.textContent = typeof value === 'undefined' ? '' : value;
  }
}

class HTMLAccessor extends BaseAccessor {
  set (value) {
    this.node.innerHTML = typeof value === 'undefined' ? '' : value;
  }

  get () {
    return this.node.innerHTML;
  }
}

class ValueAccessor extends BaseAccessor {
  constructor (node) {
    super(node, 'value');
  }

  set (value) {
    super.set(typeof value === 'undefined' ? '' : value);
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
        } else if (name === 'text') {
          return new TextAccessor(node);
        } else if (name === 'html') {
          return new HTMLAccessor(node, name);
        } else if (name === 'value' && node.nodeName === 'INPUT') {
          return new ValueAccessor(node);
        }

        return new BaseAccessor(node, name);
      case Node.TEXT_NODE:
        if (node.parentElement && node.parentElement.nodeName === 'TEXTAREA') {
          return new ValueAccessor(node.parentElement);
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
