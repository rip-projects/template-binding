/* globals Node */

class Accessor {
  constructor (node, name) {
    this.node = node;
    this.name = name;
  }

  set (value) {
    this.node[this.name] = value;
  }

  get () {
    return this.node[this.name];
  }
}

class TextAccessor extends Accessor {
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

class ValueAccessor extends Accessor {
  set (value) {
    this.node.value = value || '';
  }

  get () {
    return this.node.value;
  }
}

class AttributeAccessor extends Accessor {
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
        }

        return new ValueAccessor(node, name);
      case Node.TEXT_NODE:
        if (node.parentElement && node.parentElement.nodeName === 'TEXTAREA') {
          return new ValueAccessor(node.parentElement, 'value');
        }

        return new TextAccessor(node);
      default:
        throw new Error(`Unimplemented resolving accessor for nodeType: ${node.nodeType}`);
    }
  } else {
    return new Accessor(node, name);
  }
}

module.exports = Accessor;
module.exports.get = get;
