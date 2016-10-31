class BaseAccessor {
  static get (node, name) {
    if (node && 'nodeType' in node) {
      switch (node.nodeType) {
        case window.Node.ELEMENT_NODE:
          if (name.endsWith('$')) {
            return new AttributeAccessor(node, name);
          } else if (name === 'text') {
            return new TextAccessor(node);
          } else if (name === 'html') {
            return new HTMLAccessor(node, name);
          } else if (name === 'value' && node.nodeName === 'INPUT') {
            return new ValueAccessor(node);
          }

          if (name.startsWith('class.')) {
            return new ClassAccessor(node, name.split('.').splice(1).join('.'));
          } else if (name.startsWith('style.')) {
            return new StyleAccessor(node, name.split('.').splice(1).join('.'));
          }

          return new BaseAccessor(node, name);
        case window.Node.TEXT_NODE:
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

class ClassAccessor extends BaseAccessor {
  set (value) {
    if (value) {
      this.node.classList.add(this.name);
    } else {
      this.node.classList.remove(this.name);
    }
  }

  get () {
    throw new Error('Unimplemented');
  }
}

class StyleAccessor extends BaseAccessor {
  set (value) {
    this.node.style[this.name] = value || '';
  }

  get () {
    throw new Error('Unimplemented');
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
    var selectable = document.activeElement === this.node;
    if (!selectable) {
      super.set(typeof value === 'undefined' ? '' : value);
    }
    //  &&
    //   this.node.nodeName === 'INPUT' && (
    //       this.node.type !== 'email' &&
    //       this.node.type !== 'range' &&
    //       this.node.type !== 'checkbox'
    //       );
    //
    // var selStart;
    // var selEnd;
    // if (selectable) {
    //   selStart = this.node.selectionStart;
    //   selEnd = this.node.selectionEnd;
    // }
    //
    // this.node[this.name] = value === undefined ? '' : value;
    //
    // if (selectable) {
    //   this.node.setSelectionRange(selStart, selEnd);
    //
    //   // does not work well with below
    //   // this.context.selectionStart = selStart;
    //   // this.context.selectionEnd = selStart;
    // }
    // super.set(typeof value === 'undefined' ? '' : value);
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

export default BaseAccessor;
