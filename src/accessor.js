/* globals Node */

const Expr = require('./expr');

class Accessor {
  constructor (node, name, expr) {
    this.node = node;
    this.name = name;
    this.expr = expr;

    this.changeEvents = [];
  }

  set (value, model) {
    if (typeof this.node === 'function') {
      this.node(this.name, this.expr.invoke(model));
    } else {
      this.node[this.name] = this.expr.invoke(model);
    }
  }

  get () {
    return this.node[this.name];
  }
}

class TextAccessor extends Accessor {
  constructor (node) {
    super(node, 'textContent', Expr.get(node.textContent));
  }

  set (value, model) {
    this.node.textContent = this.expr.invoke(model) || '';
  }

  get () {
    return this.node.textContext;
  }
}

class ValueAccessor extends Accessor {
  constructor (node) {
    super(node, 'value', Expr.get(node.value));

    if (this.node.nodeName === 'INPUT') {
      this.changeEvents.push('input');
    }
  }

  set (value, model) {
    this.node.value = this.expr.invoke(model) || '';
  }

  get () {
    return this.node.value;
  }
}

class AttributeAccessor extends Accessor {
  constructor (node, name) {
    super(node, name.slice(0, -1), Expr.get(node.getAttribute(name)));
  }

  set (value) {
    this.node.setAttribute(this.name, value);
  }

  get () {
    return this.node.getAttribute(this.name);
  }
}

function get (node, name, expr) {
  if (node && 'nodeType' in node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (name === 'value') {
          return new ValueAccessor(node);
        } else if (name.endsWith('$')) {
          return new AttributeAccessor(node, name);
        }

        return new Accessor(node, name, Expr.get(node.getAttribute(name)));
      case Node.TEXT_NODE:
        if (node.parentElement && node.parentElement.nodeName === 'TEXTAREA') {
          return new ValueAccessor(node.parentElement);
        }
        return new TextAccessor(node);
      default:
        throw new Error(`Unimplemented resolving accessor for nodeType: ${node.nodeType}`);
    }
  } else {
    return new Accessor(node, name, expr);
  }
}

module.exports = Accessor;
module.exports.get = get;
