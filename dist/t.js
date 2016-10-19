/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/* globals Node, HTMLUnknownElement */
	var Expr = __webpack_require__(1);
	var Binding = __webpack_require__(3);
	var Accessor = __webpack_require__(4);
	var Annotation = __webpack_require__(5);
	var Token = __webpack_require__(2);
	var Serializer = __webpack_require__(6);
	
	var SLOT_SUPPORTED = 'HTMLUnknownElement' in window && !(document.createElement('slot') instanceof HTMLUnknownElement);
	
	var templateId = 0;
	
	function nextId() {
	  return templateId++;
	}
	
	function slotName(element) {
	  return SLOT_SUPPORTED ? element.name : element.getAttribute('name');
	}
	
	function slotAppend(slot, node, root) {
	  if (!slot.__appended) {
	    slot.__appended = true;
	    slot.__fallbackContent = slot.innerHTML;
	    slot.innerHTML = '';
	  }
	
	  slot.appendChild(node);
	}
	
	function elementSlot(element) {
	  return SLOT_SUPPORTED ? element.slot : element.getAttribute('slot');
	}
	
	function fixTemplate(template) {
	  if (!template.content && window.HTMLTemplateElement && window.HTMLTemplateElement.decorate) {
	    window.HTMLTemplateElement.decorate(template);
	  }
	  return template;
	}
	
	function T(template, host, marker) {
	  this.__templateInitialize(template, host, marker);
	}
	
	T.prototype = {
	  __templateInitialize: function __templateInitialize(template, host, marker) {
	    this.__templateId = nextId();
	    // this.__templateAnnotatedElements = [];
	    this.__templateBindings = {};
	    this.__templateHost = host || (template ? template.parentElement : null);
	    this.__templateMarker = marker;
	    this.$ = {};
	
	    if (!template) {
	      return;
	    }
	
	    // do below only if template is exists
	    this.__template = fixTemplate(template);
	    this.__templateFragment = document.importNode(this.__template.content, true);
	
	    this.__parseAnnotations();
	
	    if (marker) {
	      return;
	    }
	
	    if (this.__template.parentElement === this.__templateHost) {
	      // when template parent is template host, it means that template is specific template
	      // then use template as marker
	      this.__templateMarker = this.__template;
	    } else {
	      // when template is not child of host, put marker to host
	      this.__templateMarker = document.createComment('marker-' + this.__templateId);
	      this.__templateHost.appendChild(this.__templateMarker);
	    }
	  },
	  $$: function $$(selector) {
	    return this.querySelector(selector);
	  },
	  render: function render(content) {
	    var _this = this;
	
	    if (!this.__templateFragment) {
	      return;
	    }
	
	    if (content) {
	      try {
	        [].forEach.call(this.__templateFragment.querySelectorAll('slot'), function (slot) {
	          var name = slotName(slot);
	          if (name) {
	            content.forEach(function (node) {
	              if (node.nodeType === Node.ELEMENT_NODE && name === elementSlot(node)) {
	                slotAppend(slot, node, _this.__templateFragment);
	              }
	              // TODO query to childnodes looking for slot
	            });
	          } else {
	            content.forEach(function (node) {
	              slotAppend(slot, node, _this.__templateFragment);
	            });
	          }
	        });
	      } catch (err) {
	        console.error(err.stack);
	        throw err;
	      }
	    }
	
	    this.__templateMarker.parentElement.insertBefore(this.__templateFragment, this.__templateMarker);
	  },
	  get: function get(path) {
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
	  },
	  set: function set(path, value) {
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
	  },
	  notify: function notify(path, value, oldValue) {
	    try {
	      var binding = this.__templateGetBinding(path);
	      if (binding) {
	        binding.walkEffect(value);
	      }
	    } catch (err) {
	      console.warn('#notify caught error: ' + err.message + '\n Stack trace: ' + err.stack);
	    }
	  },
	  __parseAnnotations: function __parseAnnotations() {
	    var _this2 = this;
	
	    // this.__templateAnnotatedElements = [];
	
	    // [].forEach.call(this.__templateFragment.querySelectorAll('*'), (el) => {
	    //   console.warn(this.is, !!el.__templateModel, el);
	    // });
	
	    var len = this.__templateFragment.childNodes.length;
	    for (var i = 0; i < len; i++) {
	      var node = this.__templateFragment.childNodes[i];
	      switch (node.nodeType) {
	        case Node.ELEMENT_NODE:
	          this.__parseElementAnnotations(node);
	          break;
	        case Node.TEXT_NODE:
	          this.__parseTextAnnotations(node);
	          break;
	      }
	    }
	
	    Object.keys(this.__templateBindings).forEach(function (key) {
	      _this2.notify(key, _this2.get(key));
	    });
	  },
	  __parseEventAnnotations: function __parseEventAnnotations(element, attrName) {
	    // bind event annotation
	    var attrValue = element.getAttribute(attrName);
	    var eventName = attrName.slice(1, -1);
	    // let eventName = attrName.substr(3);
	    if (eventName === 'tap') {
	      eventName = 'click';
	    }
	
	    var context = this;
	    var expr = Expr.getFn(attrValue, [], true);
	
	    // TODO might be slow or memory leak setting event listener to inside element
	    element.addEventListener(eventName, function (evt) {
	      return expr.invoke(context, { evt: evt });
	    }, true);
	  },
	  __parseAttributeAnnotations: function __parseAttributeAnnotations(element) {
	    var _this3 = this;
	
	    // clone attributes to array first then foreach because we will remove
	    // attribute later if already processed
	    // this hack to make sure when attribute removed the attributes index doesnt shift.
	    return Array.prototype.slice.call(element.attributes).reduce(function (annotated, attr) {
	      var attrName = attr.name;
	
	      if (attrName.indexOf('(') === 0) {
	        _this3.__parseEventAnnotations(element, attrName);
	      } else {
	        // bind property annotation
	        annotated = _this3.__templateAnnotate(Expr.get(attr.value), Accessor.get(element, attrName)) || annotated;
	      }
	
	      return annotated;
	    }, false);
	  },
	  __parseElementAnnotations: function __parseElementAnnotations(element) {
	    var annotated = false;
	    var scoped = element.__templateModel;
	
	    if (!scoped) {
	      element.classList.add(this.__templateHost.is + '__scope');
	      element.__templateModel = this;
	
	      // populate $
	      if (element.id && !this.$[element.id]) {
	        this.$[element.id] = element;
	      }
	
	      if (element.attributes && element.attributes.length) {
	        annotated = this.__parseAttributeAnnotations(element) || annotated;
	      }
	    }
	
	    if (element.childNodes && element.childNodes.length) {
	      var childNodes = [].slice.call(element.childNodes);
	      var childNodesLength = childNodes.length;
	
	      for (var i = 0; i < childNodesLength; i++) {
	        var childNode = childNodes[i];
	
	        switch (childNode.nodeType) {
	          case Node.TEXT_NODE:
	            if (!scoped) {
	              annotated = this.__parseTextAnnotations(childNode) || annotated;
	            }
	            break;
	          case Node.ELEMENT_NODE:
	            annotated = this.__parseElementAnnotations(childNode) || annotated;
	            break;
	          default:
	          // noop
	        }
	      }
	    }
	
	    // if (annotated) {
	    //   this.__templateAnnotatedElements.push(element);
	    // }
	
	    return annotated;
	  },
	  __parseTextAnnotations: function __parseTextAnnotations(node) {
	    var expr = Expr.get(node.textContent);
	
	    var accessor = void 0;
	    if (node.parentElement && node.parentElement.nodeName === 'TEXTAREA') {
	      accessor = Accessor.get(node.parentElement, 'value');
	    } else {
	      accessor = Accessor.get(node);
	    }
	
	    return this.__templateAnnotate(expr, accessor);
	  },
	  __templateAnnotate: function __templateAnnotate(expr, accessor) {
	    var _this4 = this;
	
	    if (expr.type === 's') {
	      return false;
	    }
	
	    // annotate every paths
	    var annotation = new Annotation(this, expr, accessor);
	
	    expr.annotatedPaths.forEach(function (arg) {
	      return _this4.__templateGetBinding(arg.name).annotations.push(annotation);
	    });
	
	    return true;
	  },
	  __templateGetBinding: function __templateGetBinding(path) {
	    var segments = path.split('.');
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
	};
	
	if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
	  window.T = T;
	}
	
	module.exports = T;
	module.exports.Accessor = Accessor;
	module.exports.Expr = Expr;
	module.exports.Token = Token;
	module.exports.Serializer = Serializer;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Token = __webpack_require__(2);
	
	var Expr = function () {
	  function Expr(value, unwrapped) {
	    _classCallCheck(this, Expr);
	
	    // define base properties
	    this.mode = '[';
	    this.type = 's';
	    this.name = '';
	    this.args = [];
	    this.value = value;
	    this.unwrapped = Boolean(unwrapped);
	
	    var valType = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	    if (valType === 'function') {
	      this.type = 'm';
	      return;
	    } else if (valType !== 'string') {
	      // validate args
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
	    value: function invoke(context, otherArgs) {
	      if (this.type === 'p') {
	        return typeof context.get === 'function' ? context.get(this.name) : context[this.name];
	      }
	
	      var fn = context.__templateHost[this.name];
	      if (typeof fn !== 'function') {
	        throw new Error('Method is not eligible, ' + (context.__templateHost.nodeName || '$anonymous') + '#' + this.name);
	      }
	
	      var args = this.args.map(function (arg) {
	        return arg.value(context, otherArgs);
	      });
	
	      return fn.apply(context, args);
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
	  if (typeof value === 'function') {
	    return get(value, unwrapped);
	  }
	  return get(value.indexOf('(') === -1 ? value + '(' + args.join(', ') + ')' : value, unwrapped);
	}
	
	function rawTokenize(str) {
	  var count = 0;
	  var tokens = [];
	
	  while (str && count++ < 10) {
	    var matches = str.match(/^\s*("[^"]*"|[^,]+),?/);
	
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
	    value: function value(context, others) {
	      context = context || GLOBAL;
	
	      if (this.type === 's') {
	        return this._value;
	      }
	
	      if (context) {
	        var val = context.get ? context.get(this.name) : context[this.name];
	        if (typeof val !== 'undefined') {
	          return val;
	        }
	      }
	
	      if (others) {
	        var _val = others.get ? others.get(this.name) : others[this.name];
	        if (typeof _val !== 'undefined') {
	          return _val;
	        }
	      }
	
	      return;
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
	          annotation.effect(value, _this.model);
	        } catch (err) {
	          console.error('Error caught while walk effect annotation: ' + (annotation.expr ? annotation.expr.value : '#unknown') + '\n ' + err.stack);
	        }
	      });
	
	      Object.keys(this.paths).forEach(function (i) {
	        _this.paths[i].walkEffect(value ? value[i] : undefined);
	      });
	    }
	  }]);
	
	  return Binding;
	}();
	
	module.exports = Binding;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* globals Node */
	
	var BaseAccessor = function () {
	  function BaseAccessor(node, name) {
	    _classCallCheck(this, BaseAccessor);
	
	    this.node = node;
	    this.name = name;
	  }
	
	  _createClass(BaseAccessor, [{
	    key: 'set',
	    value: function set(value) {
	      if (typeof this.node.set === 'function') {
	        this.node.set(this.name, value);
	      } else {
	        this.node[this.name] = value;
	      }
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      if (typeof this.node.get === 'function') {
	        return this.node.get(this.name);
	      } else {
	        return this.node[this.name];
	      }
	    }
	  }]);
	
	  return BaseAccessor;
	}();
	
	var TextAccessor = function (_BaseAccessor) {
	  _inherits(TextAccessor, _BaseAccessor);
	
	  function TextAccessor(node) {
	    _classCallCheck(this, TextAccessor);
	
	    return _possibleConstructorReturn(this, (TextAccessor.__proto__ || Object.getPrototypeOf(TextAccessor)).call(this, node, 'textContent'));
	  }
	
	  _createClass(TextAccessor, [{
	    key: 'set',
	    value: function set(value) {
	      this.node.textContent = value || '';
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.node.textContext;
	    }
	  }]);
	
	  return TextAccessor;
	}(BaseAccessor);
	
	var ValueAccessor = function (_BaseAccessor2) {
	  _inherits(ValueAccessor, _BaseAccessor2);
	
	  function ValueAccessor() {
	    _classCallCheck(this, ValueAccessor);
	
	    return _possibleConstructorReturn(this, (ValueAccessor.__proto__ || Object.getPrototypeOf(ValueAccessor)).apply(this, arguments));
	  }
	
	  _createClass(ValueAccessor, [{
	    key: 'set',
	    value: function set(value) {
	      _get(ValueAccessor.prototype.__proto__ || Object.getPrototypeOf(ValueAccessor.prototype), 'set', this).call(this, value || '');
	    }
	  }]);
	
	  return ValueAccessor;
	}(BaseAccessor);
	
	var AttributeAccessor = function (_BaseAccessor3) {
	  _inherits(AttributeAccessor, _BaseAccessor3);
	
	  function AttributeAccessor(node, name) {
	    _classCallCheck(this, AttributeAccessor);
	
	    return _possibleConstructorReturn(this, (AttributeAccessor.__proto__ || Object.getPrototypeOf(AttributeAccessor)).call(this, node, name.slice(0, -1)));
	  }
	
	  _createClass(AttributeAccessor, [{
	    key: 'set',
	    value: function set(value) {
	      if (value) {
	        this.node.setAttribute(this.name, value);
	      } else {
	        this.node.removeAttribute(this.name);
	      }
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      return this.node.getAttribute(this.name);
	    }
	  }]);
	
	  return AttributeAccessor;
	}(BaseAccessor);
	
	function get(node, name) {
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
	        throw new Error('Unimplemented resolving accessor for nodeType: ' + node.nodeType);
	    }
	  } else {
	    return new BaseAccessor(node, name);
	  }
	}
	
	module.exports = BaseAccessor;
	module.exports.get = get;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Annotation = function () {
	  function Annotation(model, expr, accessor) {
	    _classCallCheck(this, Annotation);
	
	    this.model = model;
	    this.expr = expr;
	    this.accessor = accessor;
	  }
	
	  _createClass(Annotation, [{
	    key: "effect",
	    value: function effect(value) {
	      if (this.accessor) {
	        var _value = this.expr.invoke(this.model);
	        // FIXME implement composite annotation
	        // FIXME implement filtered annotation
	        // FIXME implement function type annotation
	        this.accessor.set(_value);
	      } else {
	        this.expr.invoke(this.model);
	      }
	    }
	  }]);
	
	  return Annotation;
	}();
	
	module.exports = Annotation;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function serialize(value) {
	  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
	    case 'boolean':
	      return value ? '' : undefined;
	
	    case 'object':
	      if (value instanceof Date) {
	        return value;
	      } else if (value) {
	        try {
	          return JSON.stringify(value);
	        } catch (err) {
	          return '';
	        }
	      }
	      break;
	    default:
	    // noop
	  }
	  return value === null ? undefined : value;
	}
	
	function deserialize(value, type) {
	  switch (type) {
	    case Number:
	      value = Number(value);
	      break;
	
	    case Boolean:
	      value = Boolean(value === '' || value === 'true' || value === '1' || value === 'on');
	      break;
	
	    case Object:
	      try {
	        value = JSON.parse(value);
	      } catch (err) {
	        // allow non-JSON literals like Strings and Numbers
	        // console.warn('Failed decode json: "' + value + '" to Object');
	      }
	      break;
	
	    case Array:
	      try {
	        value = JSON.parse(value);
	      } catch (err) {
	        // .console.warn('Failed decode json: "' + value + '" to Array');
	        value = null;
	      }
	      break;
	
	    case Date:
	      value = new Date(value);
	      break;
	
	    // behave like default for now
	    // case String:
	    default:
	      break;
	  }
	  return value;
	}
	
	module.exports.serialize = serialize;
	module.exports.deserialize = deserialize;

/***/ }
/******/ ]);
//# sourceMappingURL=t.js.map