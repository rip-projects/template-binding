/* globals Node */
const Expr = require('./expr');
const Binding = require('./binding');
const Accessor = require('./accessor');
const Annotation = require('./annotation');

class T {
  constructor (template, host) {
    this.__template = template;
    this.__templateHost = host || (template ? template.parentElement : null);
    this.__templateRoot = [];
    this.__templateStamped = false;
    this.__templateAnnotatedElements = [];
    this.__templateBindings = {};
    this.__templateListeners = {};
  }

  render () {
    if (!this.__templateStamped) {
      this.__templateStamped = true;

      let fragment = document.importNode(this.__template, true).content;
      this.__templateRoot = [].slice.call(fragment.childNodes);

      this.__parseAnnotations();

      this.__templateHost.appendChild(this.__template);
      this.__templateHost.insertBefore(fragment, this.__template);
    }
  }

  get (path) {
    var object = this;

    var segments = path.split('.');

    segments.some(segment => {
      if (object === undefined || object === null) {
        object = undefined;
        return true;
      }

      object = object[segment];
      return false;
    });

    return object;
  }

  set (path, value) {
    var oldValue = this.get(path);

    if (value === oldValue) {
      return;
    }

    var object = this;

    var segments = path.split('.');

    segments.slice(0, -1).forEach(segment => {
      if (!object) {
        return;
      }
      if (object[segment] === undefined || object[segment] === null) {
        object[segment] = {};
      }

      object = object[segment];
    });

    var property = segments.slice(-1).pop();

    object[property] = value;

    this.notify(path, value, oldValue);
  }

  __getBinding (path) {
    let binding;

    let segments = path.split('.');

    let bindings = this.__templateBindings;
    let found = segments.every(segment => {
      var currentBinding = binding ? binding.paths[segment] : bindings[segment];
      if (!currentBinding) {
        return false;
      }

      binding = currentBinding;
      return true;
    }, null);

    if (found) {
      return binding;
    }
  }

  notify (path, value, oldValue) {
    try {
      let binding = this.__getBinding(path);
      binding.walkEffect(value);
    } catch (err) {
      console.warn('#notify caught error: ' + err.message +
          '\n Stack trace: ' + err.stack);
    }
  }

  addComputedProperty (propName, fnExpr) {
    let expr = Expr.getFn(fnExpr, true);
    let accessor = Accessor.get(this, propName, expr);
    return Annotation.annotate(this, accessor);
  }

  __parseAnnotations () {
    this.__templateAnnotatedElements = [];

    let len = this.__templateRoot.length;
    for (let i = 0; i < len; i++) {
      let node = this.__templateRoot[i];
      if (node.nodeType === window.Node.ELEMENT_NODE) {
        this.__parseElementAnnotations(node);
      } else {
        this.__parseTextAnnotations(node);
      }
    }

    Object.keys(this.__templateBindings).forEach(key => this.notify(key, this.get(key)));
  }

  __parseEventAnnotations (element, attrName) {
    // bind event annotation
    let attrValue = element.getAttribute(attrName);
    let eventName = attrName.slice(1, -1);
    // var eventName = attrName.substr(3);
    if (eventName === 'tap') {
      eventName = 'click';
    }

    let context = this;
    let expr = Expr.getFn(attrValue, true);

    // TODO might be slow or memory leak setting event listener to inside element
    element.addEventListener(eventName, function (evt) {
      return expr.invoke(context);
    }, true);
  }

  __parseAttributeAnnotations (element) {
    let context = this;

    // clone attributes to array first then foreach because we will remove
    // attribute later if already processed
    // this hack to make sure when attribute removed the attributes index doesnt shift.
    return Array.prototype.slice.call(element.attributes).reduce(function (annotated, attr) {
      var attrName = attr.name;

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
  }

  __parseElementAnnotations (element) {
    let annotated = false;

    if (element.__templateInstance) {
      return false;
    }

    element.__templateInstance = this;

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
  }

  __parseTextAnnotations (node) {
    return Annotation.annotate(this, Accessor.get(node));
  }

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
  }

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
  }

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
  }
}

module.exports = T;
