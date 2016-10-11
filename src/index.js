/* globals Node, HTMLUnknownElement */
const Expr = require('./expr');
const Binding = require('./binding');
const Accessor = require('./accessor');
const Annotation = require('./annotation');
const Token = require('./token');
const Serializer = require('./serializer');

const SLOT_SUPPORTED = 'HTMLUnknownElement' in window && !(document.createElement('slot') instanceof HTMLUnknownElement);

let templateId = 0;

function nextId () {
  return templateId++;
}

function slotName (element) {
  return SLOT_SUPPORTED ? element.name : element.getAttribute('name');
}

function slotAppend (slot, node, root) {
  if (!slot.__appended) {
    slot.__appended = true;
    slot.__fallbackContent = slot.innerHTML;
    slot.innerHTML = '';
  }

  slot.appendChild(node);
}

function elementSlot (element) {
  return SLOT_SUPPORTED ? element.slot : element.getAttribute('slot');
}

function fixTemplate (template) {
  if (!template.content) {
    window.HTMLTemplateElement.decorate(template);
  }
  return template;
}

function T (template, host) {
  this.__initialize(template, host);
}

T.prototype = {
  __initialize (template, host) {
    this.__templateId = nextId();
    this.__templateAnnotatedElements = [];
    this.__templateBindings = {};
    this.__templateListeners = {};
    this.$ = {};

    if (!template) {
      return;
    }

    // do below only if template is exists
    this.__template = fixTemplate(template);
    this.__templateHost = host || (template ? template.parentElement : null);
    this.__templateFragment = document.importNode(this.__template.content, true);
    this.__templateMarker = document.createComment(this.__templateId);

    this.__parseAnnotations();

    if (this.__template.parentElement === this.__templateHost) {
      this.__templateHost.insertBefore(this.__templateMarker, this.__template);
      this.__templateHost.removeChild(this.__template);
    } else {
      this.__templateHost.appendChild(this.__templateMarker);
    }
  },

  $$ (selector) {
    return this.querySelector(selector);
  },

  render (content) {
    if (content) {
      try {
        [].forEach.call(this.__templateFragment.querySelectorAll('slot'), slot => {
          let name = slotName(slot);
          if (name) {
            content.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE && name === elementSlot(node)) {
                slotAppend(slot, node, this.__templateFragment);
              }
              // TODO query to childnodes looking for slot
            });
          } else {
            content.forEach(node => {
              slotAppend(slot, node, this.__templateFragment);
            });
          }
        });
      } catch (err) {
        console.error(err.stack);
        throw err;
      }
    }

    this.__templateHost.insertBefore(this.__templateFragment, this.__templateMarker);
  },

  get (path) {
    let object = this;

    let segments = path.split('.');

    segments.some(segment => {
      if (object === undefined || object === null) {
        object = undefined;
        return true;
      }

      object = object[segment];
      return false;
    });

    return object;
  },

  set (path, value) {
    let oldValue = this.get(path);

    if (value === oldValue) {
      return;
    }

    let object = this;

    let segments = path.split('.');

    segments.slice(0, -1).forEach(segment => {
      if (!object) {
        return;
      }
      if (object[segment] === undefined || object[segment] === null) {
        object[segment] = {};
      }

      object = object[segment];
    });

    let property = segments.slice(-1).pop();

    object[property] = value;

    this.notify(path, value, oldValue);
  },

  __getBinding (path) {
    let binding;

    let segments = path.split('.');

    let bindings = this.__templateBindings;
    let found = segments.every(segment => {
      let currentBinding = binding ? binding.paths[segment] : bindings[segment];
      if (!currentBinding) {
        return false;
      }

      binding = currentBinding;
      return true;
    }, null);

    if (found) {
      return binding;
    }
  },

  notify (path, value, oldValue) {
    try {
      let binding = this.__getBinding(path);
      if (binding) {
        binding.walkEffect(value);
      }
    } catch (err) {
      console.warn('#notify caught error: ' + err.message +
          '\n Stack trace: ' + err.stack);
    }
  },

  addObserver (propName, fnExpr) {
    let expr = Expr.getFn(fnExpr, [propName], true);
    let accessor = Accessor.get(null, null, expr);
    let result = Annotation.annotate(this, accessor);

    // invoke first time;
    expr.invoke(this);

    return result;
  },

  addComputedProperty (propName, fnExpr) {
    let expr = Expr.getFn(fnExpr, [], true);
    let accessor = Accessor.get(this, propName, expr);
    let annotation = Annotation.annotate(this, accessor);

    // invoke first time;
    this.set(propName, expr.invoke(this));

    return annotation;
  },

  __parseAnnotations () {
    this.__templateAnnotatedElements = [];

    let len = this.__templateFragment.childNodes.length;
    for (let i = 0; i < len; i++) {
      let node = this.__templateFragment.childNodes[i];
      if (node.nodeType === window.Node.ELEMENT_NODE) {
        this.__parseElementAnnotations(node);
      } else {
        this.__parseTextAnnotations(node);
      }
    }

    Object.keys(this.__templateBindings).forEach(key => this.notify(key, this.get(key)));
  },

  __parseEventAnnotations (element, attrName) {
    // bind event annotation
    let attrValue = element.getAttribute(attrName);
    let eventName = attrName.slice(1, -1);
    // let eventName = attrName.substr(3);
    if (eventName === 'tap') {
      eventName = 'click';
    }

    let context = this;
    let expr = Expr.getFn(attrValue, [], true);

    // TODO might be slow or memory leak setting event listener to inside element
    element.addEventListener(eventName, function (evt) {
      return expr.invoke(context, { evt });
    }, true);
  },

  __parseAttributeAnnotations (element) {
    let context = this;

    // clone attributes to array first then foreach because we will remove
    // attribute later if already processed
    // this hack to make sure when attribute removed the attributes index doesnt shift.
    return Array.prototype.slice.call(element.attributes).reduce(function (annotated, attr) {
      let attrName = attr.name;

      if (attrName.indexOf('(') === 0) {
        context.__parseEventAnnotations(element, attrName);
      } else {
        // bind property annotation
        let expr = Expr.get(attr.value);
        if (expr.type !== 's') {
          annotated = Annotation.annotate(context, Accessor.get(element, attrName)) || annotated;
        }
      }

      return annotated;
    }, false);
  },

  __parseElementAnnotations (element) {
    let annotated = false;

    if (element.__templateInstance) {
      return false;
    }

    element.__templateInstance = this;

    // populate $
    if (element.id && !this.$[element.id]) {
      this.$[element.id] = element;
    }

    if (element.attributes && element.attributes.length) {
      annotated = this.__parseAttributeAnnotations(element) || annotated;
    }

    if (element.childNodes && element.childNodes.length) {
      let childNodes = [].slice.call(element.childNodes);
      let childNodesLength = childNodes.length;

      for (let i = 0; i < childNodesLength; i++) {
        let childNode = childNodes[i];

        switch (childNode.nodeType) {
          case Node.TEXT_NODE:
            annotated = this.__parseTextAnnotations(childNode) || annotated;
            break;
          case Node.ELEMENT_NODE:
            annotated = this.__parseElementAnnotations(childNode) || annotated;
            break;
          default:
            // noop
        }
      }
    }

    if (annotated) {
      this.__templateAnnotatedElements.push(element);
    }

    return annotated;
  },

  __parseTextAnnotations (node) {
    return Annotation.annotate(this, Accessor.get(node));
  },

  __templateGetBinding (name) {
    let segments = name.split('.');
    let bindings;
    let binding;

    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];

      bindings = binding ? binding.paths : this.__templateBindings;

      if (!bindings[segment]) {
        bindings[segment] = new Binding(this, segment);
      }

      binding = bindings[segment];
    }

    return binding;
  },

  addTargetedListener (eventName, target, callback) {
    let self = this;
    let listeners = this.__templateListeners[eventName] = this.__templateListeners[eventName] || [];

    let listener = {
      name: eventName,
      target: target,
      callback: callback,
      listenerCallback (evt) {
        if (evt.target.__templateInstance !== self) {
          return;
        }

        if (evt.target === listener.target) {
          callback.apply(null, arguments);
        }
      },
    };

    listeners.push(listener);

    this.__templateHost.addEventListener(eventName, listener.listenerCallback, true);
  },

  removeTargetedListener (eventName, target, callback) {
    let listeners = [];
    if (target && this.__templateListeners[eventName]) {
      this.__templateListeners[eventName].forEach(listener => {
        if (listener.target === target && (!callback || listener.callback === callback)) {
          return;
        }

        listeners.push(listener);
      });
    }
    this.__templateListeners[eventName] = listeners;
  },
};

if (typeof window === 'object') {
  window.T = T;
}

module.exports = T;
module.exports.Expr = Expr;
module.exports.Token = Token;
module.exports.Serializer = Serializer;
