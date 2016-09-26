/* globals Node */
const Expr = require('./expr');
const Binding = require('./binding');
const Annotation = require('./annotation');

class T {
  constructor (template, host) {
    this.__template = template;
    this.__templateHost = host || this.__template.parentElement;
    this.__templateRoot = [];
    this.__templateStamped = false;
    this.__templateAnnotatedElements = [];
    this.__templateBindings = {};
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

  get (key) {
    var object = this;

    var segments = key.split('.');

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

  set (key, value) {
    var oldValue = this.get(key);

    if (value === oldValue) {
      return;
    }

    var object = this;

    var segments = key.split('.');

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

    this.__notify(key, value, oldValue);
  }

  __notify (path, value, oldValue) {
    var segments = path.split('.');
    try {
      var walkingSegments = [];
      var binding;
      try {
        var found = segments.every(function (segment) {
          var currentBinding = binding ? binding.paths[segment] : this.__templateBindings[segment];
          if (!currentBinding) {
            return false;
          }

          walkingSegments.push(segment);
          binding = currentBinding;
          return true;
        }.bind(this), null);

        if (!found) {
          return;
        }
      } catch (err) {
        console.trace(err.stack);
        return;
      }

      // FIXME keluarin walkEffect biar ga bikin function berulang kali
      var walkEffect = function (binding, value, oldValue) {
        binding.annotations.forEach(function (annotation) {
          try {
            annotation.effect(value, oldValue);
          } catch (err) {
            console.error('Error caught on #__notify#walkEffect annotation: ' + annotation.expr.value + '\n' + err.stack);
          }
        });

        Object.keys(binding.paths).forEach(function (i) {
          walkEffect(binding.paths[i], value ? value[i] : undefined);
        });
      }.bind(this);

      walkEffect(binding, value, oldValue);
    } catch (err) {
      console.warn('#__notify caught error: ' + err.message +
          '\n Stack trace: ' + err.stack);
    }
  }

  __parseAnnotations () {
    let len = this.__templateRoot.length;
    for (let i = 0; i < len; i++) {
      let node = this.__templateRoot[i];
      if (node.nodeType === window.Node.ELEMENT_NODE) {
        this.__parseElementAnnotations(node);
      } else {
        this.__parseTextAnnotations(node);
      }
    }

    Object.keys(this.__templateBindings).forEach(key => this.__notify(key, this.get(key)));
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
    let context = this;
    let expr = Expr.get(node.textContent);

    if (expr.type === 's') {
      return false;
    }

    // bind read annotation
    if (expr.type === 'p') {
      expr.annotatedArgs.forEach(function (arg) {
        context.__bind(arg.name, new Annotation(expr, node));
      });
    } else {
      throw new Error('Expr type ' + expr.type + ' not implemented');
    }

    // TODO why ' ' why not ''
    // node.textContent = ' ';
    node.textContent = '';

    return true;
  }

  __bind (name, annotation) {
    let segments = name.split('.');

    let binding;

    // resolve binding
    let bindings;
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];

      bindings = binding ? binding.paths : this.__templateBindings;

      if (!bindings[segment]) {
        bindings[segment] = new Binding(this, segment);
      }

      binding = bindings[segment];
    }

    binding.annotate(annotation);
  }
}

module.exports = T;
