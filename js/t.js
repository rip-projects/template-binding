/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/* globals Node */
	var Expr = __webpack_require__(1);
	var Binding = __webpack_require__(3);
	var Accessor = __webpack_require__(4);
	var Annotation = __webpack_require__(5);
	var Token = __webpack_require__(2);

	var T = function () {
	  function T(template, host) {
	    _classCallCheck(this, T);

	    this.__template = template;
	    this.__templateHost = host || (template ? template.parentElement : null);
	    this.__templateRoot = [];
	    this.__templateStamped = false;
	    this.__templateAnnotatedElements = [];
	    this.__templateBindings = {};
	    this.__templateListeners = {};
	  }

	  _createClass(T, [{
	    key: 'render',
	    value: function render() {
	      if (!this.__templateStamped) {
	        this.__templateStamped = true;

	        var fragment = document.importNode(this.__template, true).content;
	        this.__templateRoot = [].slice.call(fragment.childNodes);

	        this.__parseAnnotations();

	        this.__templateHost.appendChild(this.__template);
	        this.__templateHost.insertBefore(fragment, this.__template);
	      }
	    }
	  }, {
	    key: 'get',
	    value: function get(path) {
	      var object = this;

	      var segments = path.split('.');

	      segments.some(function (segment) {
	        if (object === undefined || object === null) {
	          object = undefined;
	          return true;
	        }

	        object = object[segment];
	        return false;
	      });

	      return object;
	    }
	  }, {
	    key: 'set',
	    value: function set(path, value) {
	      var oldValue = this.get(path);

	      if (value === oldValue) {
	        return;
	      }

	      var object = this;

	      var segments = path.split('.');

	      segments.slice(0, -1).forEach(function (segment) {
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
	  }, {
	    key: '__getBinding',
	    value: function __getBinding(path) {
	      var binding = void 0;

	      var segments = path.split('.');

	      var bindings = this.__templateBindings;
	      var found = segments.every(function (segment) {
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
	  }, {
	    key: 'notify',
	    value: function notify(path, value, oldValue) {
	      try {
	        var binding = this.__getBinding(path);
	        binding.walkEffect(value);
	      } catch (err) {
	        console.warn('#notify caught error: ' + err.message + '\n Stack trace: ' + err.stack);
	      }
	    }
	  }, {
	    key: 'addComputedProperty',
	    value: function addComputedProperty(propName, fnExpr) {
	      var expr = Expr.getFn(fnExpr, [], true);
	      var accessor = Accessor.get(this, propName, expr);
	      return Annotation.annotate(this, accessor);
	    }
	  }, {
	    key: '__parseAnnotations',
	    value: function __parseAnnotations() {
	      var _this = this;

	      this.__templateAnnotatedElements = [];

	      var len = this.__templateRoot.length;
	      for (var i = 0; i < len; i++) {
	        var node = this.__templateRoot[i];
	        if (node.nodeType === window.Node.ELEMENT_NODE) {
	          this.__parseElementAnnotations(node);
	        } else {
	          this.__parseTextAnnotations(node);
	        }
	      }

	      Object.keys(this.__templateBindings).forEach(function (key) {
	        return _this.notify(key, _this.get(key));
	      });
	    }
	  }, {
	    key: '__parseEventAnnotations',
	    value: function __parseEventAnnotations(element, attrName) {
	      // bind event annotation
	      var attrValue = element.getAttribute(attrName);
	      var eventName = attrName.slice(1, -1);
	      // var eventName = attrName.substr(3);
	      if (eventName === 'tap') {
	        eventName = 'click';
	      }

	      var context = this;
	      var expr = Expr.getFn(attrValue, [], true);

	      // TODO might be slow or memory leak setting event listener to inside element
	      element.addEventListener(eventName, function (evt) {
	        return expr.invoke(context);
	      }, true);
	    }
	  }, {
	    key: '__parseAttributeAnnotations',
	    value: function __parseAttributeAnnotations(element) {
	      var context = this;

	      // clone attributes to array first then foreach because we will remove
	      // attribute later if already processed
	      // this hack to make sure when attribute removed the attributes index doesnt shift.
	      return Array.prototype.slice.call(element.attributes).reduce(function (annotated, attr) {
	        var attrName = attr.name;

	        if (attrName.indexOf('(') === 0) {
	          context.__parseEventAnnotations(element, attrName);
	        } else {
	          // bind property annotation
	          var expr = Expr.get(attr.value);
	          if (expr.type !== 's') {
	            annotated = Annotation.annotate(context, Accessor.get(element, attrName)) || annotated;
	          }
	        }

	        return annotated;
	      }, false);
	    }
	  }, {
	    key: '__parseElementAnnotations',
	    value: function __parseElementAnnotations(element) {
	      var annotated = false;

	      if (element.__templateInstance) {
	        return false;
	      }

	      element.__templateInstance = this;

	      if (element.attributes && element.attributes.length) {
	        annotated = this.__parseAttributeAnnotations(element) || annotated;
	      }

	      if (element.childNodes && element.childNodes.length) {
	        var childNodes = [].slice.call(element.childNodes);
	        var childNodesLength = childNodes.length;

	        for (var i = 0; i < childNodesLength; i++) {
	          var childNode = childNodes[i];

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
	  }, {
	    key: '__parseTextAnnotations',
	    value: function __parseTextAnnotations(node) {
	      return Annotation.annotate(this, Accessor.get(node));
	    }
	  }, {
	    key: '__templateGetBinding',
	    value: function __templateGetBinding(name) {
	      var segments = name.split('.');
	      var bindings = void 0;
	      var binding = void 0;

	      for (var i = 0; i < segments.length; i++) {
	        var segment = segments[i];

	        bindings = binding ? binding.paths : this.__templateBindings;

	        if (!bindings[segment]) {
	          bindings[segment] = new Binding(this, segment);
	        }

	        binding = bindings[segment];
	      }

	      return binding;
	    }
	  }, {
	    key: 'addTargetedListener',
	    value: function addTargetedListener(eventName, target, callback) {
	      var self = this;
	      var listeners = this.__templateListeners[eventName] = this.__templateListeners[eventName] || [];

	      var listener = {
	        name: eventName,
	        target: target,
	        callback: callback,
	        listenerCallback: function listenerCallback(evt) {
	          if (evt.target.__templateInstance !== self) {
	            return;
	          }

	          if (evt.target === listener.target) {
	            callback.apply(null, arguments);
	          }
	        }
	      };

	      listeners.push(listener);

	      this.__templateHost.addEventListener(eventName, listener.listenerCallback, true);
	    }
	  }, {
	    key: 'removeTargetedListener',
	    value: function removeTargetedListener(eventName, target, callback) {
	      var listeners = [];
	      if (target && this.__templateListeners[eventName]) {
	        this.__templateListeners[eventName].forEach(function (listener) {
	          if (listener.target === target && (!callback || listener.callback === callback)) {
	            return;
	          }

	          listeners.push(listener);
	        });
	      }
	      this.__templateListeners[eventName] = listeners;
	    }
	  }]);

	  return T;
	}();

	if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
	  window.T = T;
	}

	module.exports = T;
	module.exports.Expr = Expr;
	module.exports.Token = Token;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Token = __webpack_require__(2);

	var Expr = function () {
	  function Expr(value, unwrapped) {
	    _classCallCheck(this, Expr);

	    // define base properties
	    this.value = value;
	    this.unwrapped = Boolean(unwrapped);
	    this.mode = '[';
	    this.type = 's';
	    this.name = '';
	    this.args = [];

	    // validate args
	    if (typeof value !== 'string') {
	      return;
	    }

	    // cleanse value
	    value = value.trim();

	    var token = value;
	    if (!this.unwrapped) {
	      if (value[0] !== '[' && value[0] !== '{') {
	        return;
	      }
	      token = value.slice(2, -2).trim();
	      this.mode = value[0];
	    }

	    if (token.indexOf('(') < 0) {
	      this.type = 'p';
	      this.name = token;
	      this.args.push(new Token(token));
	    } else {
	      // force mode to '[' when type is !p
	      this.mode = '[';
	      this.type = 'm';

	      var matches = token.match(/([^(]+)\(([^)]*)\)/);

	      this.name = matches[1].trim();

	      this.args = tokenize(matches[2]);
	    }
	  }

	  _createClass(Expr, [{
	    key: 'invoke',
	    value: function invoke(context) {
	      var f = typeof context.get === 'function' ? context.get(this.name) : context[this.name];

	      if (this.type === 'p') {
	        return f;
	      }

	      if (typeof f !== 'function') {
	        throw new Error('Method is not eligible, ' + this.name);
	      }

	      var args = this.args.map(function (arg) {
	        return arg.value(context);
	      });

	      return f.apply(context, args);
	    }
	  }, {
	    key: 'annotatedPaths',
	    get: function get() {
	      var _this = this;

	      if (!this._annotatedPaths) {
	        (function () {
	          var annotatedPaths = [];
	          _this.args.forEach(function (arg) {
	            if (arg.type === 'v' && annotatedPaths.indexOf(arg.name) === -1) {
	              annotatedPaths.push(arg);
	            }
	          });
	          _this._annotatedPaths = annotatedPaths;
	        })();
	      }

	      return this._annotatedPaths;
	    }
	  }]);

	  return Expr;
	}();

	function get(value, unwrapped) {
	  // FIXME implement cache
	  return new Expr(value, unwrapped);
	}

	function getFn(value, args, unwrapped) {
	  return get(value.indexOf('(') === -1 ? (value + '(' + args.join(', ') + ')') : value, unwrapped);
	}

	function rawTokenize(str) {
	  var count = 0;
	  var tokens = [];

	  while (str && count++ < 10) {
	    var matches = str.match(/^\s*("[^"]*"|'[^']*'|[^,]+),?/);

	    str = str.substr(matches[0].length);
	    tokens.push(matches[1].trim());
	  }

	  return tokens;
	}

	function tokenize(str) {
	  return rawTokenize(str).map(function (token) {
	    return new Token(token);
	  });
	}

	module.exports = Expr;
	module.exports.getFn = getFn;
	module.exports.get = get;
	module.exports.rawTokenize = rawTokenize;
	module.exports.tokenize = tokenize;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GLOBAL = global || window;

	var Token = function () {
	  function Token(name) {
	    _classCallCheck(this, Token);

	    this.name = name;
	    try {
	      var value = JSON.parse(this.name);
	      this.type = 's';
	      this._value = value;
	    } catch (err) {
	      this.type = 'v';
	      this._value = null;
	    }
	  }

	  _createClass(Token, [{
	    key: 'value',
	    value: function value(context) {
	      context = context || GLOBAL;

	      if (this.type === 's') {
	        return this._value;
	      }

	      return context[this.name];
	    }
	  }]);

	  return Token;
	}();

	function get(name) {
	  // FIXME implement cache
	  return new Token(name);
	}

	module.exports = Token;
	module.exports.get = get;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Binding = function () {
	  function Binding(context, model) {
	    _classCallCheck(this, Binding);

	    this.context = context;
	    this.model = model;
	    this.paths = {};
	    this.annotations = [];
	  }

	  _createClass(Binding, [{
	    key: 'walkEffect',
	    value: function walkEffect(value) {
	      var _this = this;

	      this.annotations.forEach(function (annotation) {
	        try {
	          annotation.effect(value);
	        } catch (err) {
	          console.error('Error caught while walk effect annotation: ' + annotation.expr.value + '\n' + err.stack);
	        }
	      });

	      Object.keys(this.paths).forEach(function (i) {
	        return _this.paths[i].walkEffect(value ? value[i] : undefined);
	      });
	    }
	  }]);

	  return Binding;
	}();

	module.exports = Binding;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/* globals Node */

	var Expr = __webpack_require__(1);

	var Accessor = function () {
	  function Accessor(node, name, expr) {
	    _classCallCheck(this, Accessor);

	    this.node = node;
	    this.name = name;
	    this.expr = expr;

	    this.changeEvents = [];
	  }

	  _createClass(Accessor, [{
	    key: 'set',
	    value: function set(value, model) {
	      if (typeof this.node === 'function') {
	        this.node(this.name, this.expr.invoke(model));
	      } else {
	        this.node[this.name] = this.expr.invoke(model);
	      }
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.node[this.name];
	    }
	  }]);

	  return Accessor;
	}();

	var TextAccessor = function (_Accessor) {
	  _inherits(TextAccessor, _Accessor);

	  function TextAccessor(node) {
	    _classCallCheck(this, TextAccessor);

	    return _possibleConstructorReturn(this, (TextAccessor.__proto__ || Object.getPrototypeOf(TextAccessor)).call(this, node, 'textContent', Expr.get(node.textContent)));
	  }

	  _createClass(TextAccessor, [{
	    key: 'set',
	    value: function set(value, model) {
	      this.node.textContent = this.expr.invoke(model) || '';
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.node.textContext;
	    }
	  }]);

	  return TextAccessor;
	}(Accessor);

	var ValueAccessor = function (_Accessor2) {
	  _inherits(ValueAccessor, _Accessor2);

	  function ValueAccessor(node) {
	    _classCallCheck(this, ValueAccessor);

	    var _this2 = _possibleConstructorReturn(this, (ValueAccessor.__proto__ || Object.getPrototypeOf(ValueAccessor)).call(this, node, 'value', Expr.get(node.value)));

	    if (_this2.node.nodeName === 'INPUT') {
	      _this2.changeEvents.push('input');
	    }
	    return _this2;
	  }

	  _createClass(ValueAccessor, [{
	    key: 'set',
	    value: function set(value, model) {
	      this.node.value = this.expr.invoke(model) || '';
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.node.value;
	    }
	  }]);

	  return ValueAccessor;
	}(Accessor);

	var AttributeAccessor = function (_Accessor3) {
	  _inherits(AttributeAccessor, _Accessor3);

	  function AttributeAccessor(node, name) {
	    _classCallCheck(this, AttributeAccessor);

	    return _possibleConstructorReturn(this, (AttributeAccessor.__proto__ || Object.getPrototypeOf(AttributeAccessor)).call(this, node, name.slice(0, -1), Expr.get(node.getAttribute(name))));
	  }

	  _createClass(AttributeAccessor, [{
	    key: 'set',
	    value: function set(value) {
	      this.node.setAttribute(this.name, value);
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.node.getAttribute(this.name);
	    }
	  }]);

	  return AttributeAccessor;
	}(Accessor);

	function get(node, name, expr) {
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
	        throw new Error('Unimplemented resolving accessor for nodeType: ' + node.nodeType);
	    }
	  } else {
	    return new Accessor(node, name, expr);
	  }
	}

	module.exports = Accessor;
	module.exports.get = get;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Annotation = function () {
	  function Annotation(accessor) {
	    _classCallCheck(this, Annotation);

	    this.accessor = accessor;
	  }

	  _createClass(Annotation, [{
	    key: 'annotate',
	    value: function annotate(model) {
	      var _this = this;

	      var accessor = this.accessor;
	      var expr = accessor.expr;

	      this.model = model;

	      expr.annotatedPaths.forEach(function (arg) {
	        return model.__templateGetBinding(arg.name).annotations.push(_this);
	      });

	      if (expr.mode === '{') {
	        (function () {
	          var notifyCallback = function notifyCallback(evt) {
	            evt.stopImmediatePropagation();
	            model.set(accessor.expr.name, accessor.get());
	          };

	          accessor.changeEvents.forEach(function (name) {
	            return model.addTargetedListener(name, accessor.node, notifyCallback);
	          });
	        })();
	      }
	    }
	  }, {
	    key: 'effect',
	    value: function effect(value) {
	      // FIXME implement composite annotation
	      // FIXME implement filtered annotation
	      // FIXME implement function type annotation
	      this.accessor.set(value, this.model);
	    }
	  }]);

	  return Annotation;
	}();

	function annotate(model, accessor) {
	  if (accessor.expr.type === 's') {
	    return false;
	  }

	  new Annotation(accessor).annotate(model);

	  return true;
	}

	module.exports = Annotation;
	module.exports.annotate = annotate;

/***/ }
/******/ ]);
