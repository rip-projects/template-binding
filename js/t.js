var T =
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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/* globals Node */
	var Expr = __webpack_require__(1);
	var Binding = __webpack_require__(3);
	var Annotation = __webpack_require__(4);

	var T = function () {
	  function T(template, host) {
	    _classCallCheck(this, T);

	    this.__template = template;
	    this.__templateHost = host || this.__template.parentElement;
	    this.__templateRoot = [];
	    this.__templateStamped = false;
	    this.__templateAnnotatedElements = [];
	    this.__templateBindings = {};
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
	    value: function get(key) {
	      var object = this;

	      var segments = key.split('.');

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
	    value: function set(key, value) {
	      var oldValue = this.get(key);

	      if (value === oldValue) {
	        return;
	      }

	      var object = this;

	      var segments = key.split('.');

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

	      this.__notify(key, value, oldValue);
	    }
	  }, {
	    key: '__notify',
	    value: function __notify(path, value, oldValue) {
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
	        console.warn('#__notify caught error: ' + err.message + '\n Stack trace: ' + err.stack);
	      }
	    }
	  }, {
	    key: '__parseAnnotations',
	    value: function __parseAnnotations() {
	      var _this = this;

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
	        return _this.__notify(key, _this.get(key));
	      });
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
	      var context = this;
	      var expr = Expr.get(node.textContent);

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
	  }, {
	    key: '__bind',
	    value: function __bind(name, annotation) {
	      var segments = name.split('.');

	      var binding = void 0;

	      // resolve binding
	      var bindings = void 0;
	      for (var i = 0; i < segments.length; i++) {
	        var segment = segments[i];

	        bindings = binding ? binding.paths : this.__templateBindings;

	        if (!bindings[segment]) {
	          bindings[segment] = new Binding(this, segment);
	        }

	        binding = bindings[segment];
	      }

	      binding.annotate(annotation);
	    }
	  }]);

	  return T;
	}();

	module.exports = T;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Token = __webpack_require__(2);

	var Expr = function () {
	  function Expr(value) {
	    _classCallCheck(this, Expr);

	    // define base properties
	    this.value = value;
	    this.mode = '';
	    this.type = 's';
	    this.name = '';
	    this.args = [];

	    // validate args
	    if (typeof value !== 'string') {
	      return;
	    }

	    // cleanse value
	    value = value.trim();

	    if (value[0] !== '[' && value[0] !== '{') {
	      return;
	    }

	    var token = value.slice(2, -2).trim();
	    this.mode = value[0];

	    if (value.indexOf('(') < 0) {
	      this.type = 'p';
	      this.name = token;
	      this.args.push(new Token(token));
	    } else {
	      this.type = 'm';

	      var matches = token.match(/([^(]+)\(([^)]+)\)/);

	      this.name = matches[1].trim();

	      this.args = tokenize(matches[2]);
	    }
	  }

	  _createClass(Expr, [{
	    key: 'invoke',
	    value: function invoke(context) {
	      if (this.type === 'p') {
	        return context[this.name];
	      }

	      var args = this.args.map(function (arg) {
	        return arg.value(context);
	      });
	      return context[this.name].apply(context, args);
	    }
	  }, {
	    key: 'annotatedArgs',
	    get: function get() {
	      var _this = this;

	      if (!this._annotatedArgs) {
	        (function () {
	          var annotatedArgs = [];
	          _this.args.forEach(function (arg) {
	            if (arg.type === 'v' && annotatedArgs.indexOf(arg.name) === -1) {
	              annotatedArgs.push(arg);
	            }
	          });
	          _this._annotatedArgs = annotatedArgs;
	        })();
	      }

	      return this._annotatedArgs;
	    }
	  }]);

	  return Expr;
	}();

	function get(value) {
	  // FIXME implement cache
	  return new Expr(value);
	}

	function rawTokenize(str) {
	  var count = 0;
	  var tokens = [];

	  do {
	    var matches = str.match(/^\s*("[^"]*"|'[^']*'|[^,]+),?/);

	    str = str.substr(matches[0].length);
	    tokens.push(matches[1].trim());
	  } while (str && count++ < 10);

	  return tokens;
	}

	function tokenize(str) {
	  return rawTokenize(str).map(function (token) {
	    return new Token(token);
	  });
	}

	module.exports = Expr;
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

	"use strict";

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
	    key: "annotate",
	    value: function annotate(annotation) {
	      this.annotations.push(annotation);
	    }
	  }]);

	  return Binding;
	}();

	module.exports = Binding;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Annotation = function () {
	  function Annotation(expr, target) {
	    _classCallCheck(this, Annotation);

	    this.expr = expr;
	    this.target = target;
	  }

	  _createClass(Annotation, [{
	    key: "effect",
	    value: function effect(value) {
	      this.target.textContent = value;
	    }
	  }]);

	  return Annotation;
	}();

	module.exports = Annotation;

/***/ }
/******/ ]);