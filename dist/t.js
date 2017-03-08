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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = BaseAccessor;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__accessors_base__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__accessors_attribute__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__accessors_text__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__accessors_html__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__accessors_value__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__accessors_class__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__accessors_style__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__accessors_property__ = __webpack_require__(11);









/* harmony default export */ __webpack_exports__["a"] = {
  get (node, name) {
    if (node && 'nodeType' in node) {
      switch (node.nodeType) {
        case window.Node.ELEMENT_NODE:
          if (name.endsWith('$')) {
            return new __WEBPACK_IMPORTED_MODULE_1__accessors_attribute__["a" /* default */](node, name);
          } else if (name === 'text') {
            return new __WEBPACK_IMPORTED_MODULE_2__accessors_text__["a" /* default */](node);
          } else if (name === 'html') {
            return new __WEBPACK_IMPORTED_MODULE_3__accessors_html__["a" /* default */](node, name);
          } else if (name === 'value' && node.nodeName === 'INPUT') {
            return new __WEBPACK_IMPORTED_MODULE_4__accessors_value__["a" /* default */](node);
          }

          if (name.startsWith('class.')) {
            return new __WEBPACK_IMPORTED_MODULE_5__accessors_class__["a" /* default */](node, name.split('.').splice(1).join('.'));
          } else if (name.startsWith('style.')) {
            return new __WEBPACK_IMPORTED_MODULE_6__accessors_style__["a" /* default */](node, name.split('.').splice(1).join('.'));
          }

          return new __WEBPACK_IMPORTED_MODULE_7__accessors_property__["a" /* default */](node, name);
        case window.Node.TEXT_NODE:
          if (node.parentElement && node.parentElement.nodeName === 'TEXTAREA') {
            return new __WEBPACK_IMPORTED_MODULE_4__accessors_value__["a" /* default */](node.parentElement);
          }

          return new __WEBPACK_IMPORTED_MODULE_2__accessors_text__["a" /* default */](node);
        default:
          throw new Error(`Unimplemented resolving accessor for nodeType: ${node.nodeType}`);
      }
    } else {
      return new __WEBPACK_IMPORTED_MODULE_0__accessors_base__["a" /* default */](node, name);
    }
  },
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Annotation {
  constructor (model, expr, accessor) {
    this.model = model;
    this.expr = expr;
    this.accessor = accessor;
  }

  effect (type, value) {
    if (this.accessor) {
      this.accessor.set(this.expr.invoke(this.model));
    } else {
      this.expr.invoke(this.model);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = Annotation;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Binding {
  constructor (context, model) {
    this.context = context;
    this.model = model;
    this.paths = {};
    this.annotations = [];
  }

  annotate (annotation) {
    if (this.isAnnotated(annotation)) {
      return;
    }

    this.annotations.push(annotation);
  }

  isAnnotated ({ model, expr }) {
    let annotation = this.annotations.find(annotation => annotation.model === model && annotation.expr === expr);
    return Boolean(annotation);
  }

  walkEffect (type, value) {
    this.annotations.forEach(annotation => {
      annotation.effect(type, value/* , this.model */);
    });

    Object.keys(this.paths).forEach(i => {
      this.paths[i].walkEffect(type, value);
    });
  }
}

/* harmony default export */ __webpack_exports__["a"] = Binding;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__token__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__filter__ = __webpack_require__(15);



const CACHE = {
  's': {
    '[': {},
    '{': {},
  },
  'v': {
    '[': {},
    '{': {},
  },
};

function _get (value, mode, type) {
  let cache = CACHE[type][mode];
  if (value in cache) {
    return cache[value];
  }

  let expr = new Expr(value, mode, type);
  if (type !== 's') {
    cache[value] = expr;
  }

  return expr;
}

class Expr {
  static get CACHE () {
    return CACHE;
  }

  static get (value, unwrapped) {
    value = (value || '').trim();

    if (unwrapped) {
      return _get(value, '[', 'v');
    }

    let mode = value[0];
    if ((mode === '[' || mode === '{') && value[1] === mode) {
      value = value.slice(2, -2).trim();
      return _get(value, mode, 'v');
    }

    return _get(value, '[', 's');
  }

  static getFn (value, args, unwrapped) {
    return Expr.get(value.indexOf('(') === -1 ? `${value}(${args.join(', ')})` : value, unwrapped);
  }

  static rawTokenize (str) {
    let count = 0;
    let tokens = [];

    while (str && count++ < 10) {
      let matches = str.match(/^\s*("[^"]*"|[^,]+),?/);

      str = str.substr(matches[0].length);
      tokens.push(matches[1].trim());
    }

    return tokens;
  }

  static tokenize (str) {
    return Expr.rawTokenize(str).map(token => __WEBPACK_IMPORTED_MODULE_0__token__["a" /* default */].get(token));
  }

  constructor (value, mode, type) {
    // define base properties
    this.mode = mode;
    this.type = type;
    this.name = '';
    this.args = [];
    this.filters = [];
    this.value = value;

    if (type === 's') {
      return;
    }

    let tokens = value.split('|');
    let token = tokens[0].trim();

    this.filters = tokens.slice(1).map(word => {
      return __WEBPACK_IMPORTED_MODULE_1__filter__["a" /* default */].get(word.trim());
    });

    if (token.indexOf('(') < 0) {
      this.type = 'p';
      this.name = token;
      this.args.push(__WEBPACK_IMPORTED_MODULE_0__token__["a" /* default */].get(token));
    } else {
      // force mode to '[' when type is !p
      this.mode = '[';
      this.type = 'm';

      let matches = token.match(/([^(]+)\(([^)]*)\)/);

      this.name = matches[1].trim();
      this.fn = __WEBPACK_IMPORTED_MODULE_0__token__["a" /* default */].get(this.name);

      this.args = Expr.tokenize(matches[2]);
    }
  }

  get constant () {
    return this.type !== 'm' && this.vpaths.length !== this.args.length;
  }

  get vpaths () {
    if (!this._vpaths) {
      let paths = [];
      this.args.forEach(arg => {
        if (arg.type === 'v' && paths.indexOf(arg.name) === -1) {
          paths.push(arg);
        }
      });
      this._vpaths = paths;
    }

    return this._vpaths;
  }

  invoke (context, otherArgs) {
    if (this.type === 'p') {
      let val = this.args[0].value(context, otherArgs);
      return this.filters.reduce((val, filter) => filter.invoke(val), val);
    }

    let args = this.args.map(arg => {
      return arg.value(context, otherArgs);
    });

    return this.fn.invoke(args, context, context.__templateHost);
  }
}

/* harmony default export */ __webpack_exports__["a"] = Expr;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return slotName; });
const SLOT_SUPPORTED = (() => {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    'HTMLUnknownElement' in window &&
    !(document.createElement('slot') instanceof window.HTMLUnknownElement)
  );
})();

function slotName (element) {
  return SLOT_SUPPORTED ? element.name : element.getAttribute('name');
}




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return fix; });
function fix (template) {
  if (!template.content && window.HTMLTemplateElement && window.HTMLTemplateElement.decorate) {
    window.HTMLTemplateElement.decorate(template);
  }
  return template;
};

function needFixImportNode () {
  // console.log('needFixImportNode?');
  if (document.__importNode) {
    // already fixed
    return false;
  }
  let template = document.createElement('template');
  template.innerHTML = '<template>i</template>';
  let imported = document.importNode(template.content, true);
  return imported.firstChild.content.firstChild.textContent !== 'i';
}

if (needFixImportNode()) {
  // console.log('fixed importNode');
  document.__importNode = document.importNode;
  document.importNode = function (node, deep) {
    if (!deep) {
      return document.__importNode(node, deep);
    }

    let sourceTpls = [].slice.call(node.querySelectorAll('template'));
    let imported = document.__importNode(node, deep);
    [].forEach.call(imported.querySelectorAll('template'), (child, i) => {
      child.innerHTML = sourceTpls[i].innerHTML;
    });

    return imported;
  };
}




/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let _matcher;
let _level = 0;
let _id = 0;
let _handlers = {};
let _delegatorInstances = {};

function _addEvent (delegator, type, callback) {
    // blur and focus do not bubble up but if you use event capturing
    // then you will get them
  let useCapture = type === 'blur' || type === 'focus';
  delegator.element.addEventListener(type, callback, useCapture);
}

function _cancel (evt) {
  evt.preventDefault();
  evt.stopPropagation();
}

/**
 * returns function to use for determining if an element
 * matches a query selector
 *
 * @returns {Function}
 */
function _getMatcher (element) {
  if (_matcher) {
    return _matcher;
  }

  if (element.matches) {
    _matcher = element.matches;
    return _matcher;
  }

  if (element.webkitMatchesSelector) {
    _matcher = element.webkitMatchesSelector;
    return _matcher;
  }

  if (element.mozMatchesSelector) {
    _matcher = element.mozMatchesSelector;
    return _matcher;
  }

  if (element.msMatchesSelector) {
    _matcher = element.msMatchesSelector;
    return _matcher;
  }

  if (element.oMatchesSelector) {
    _matcher = element.oMatchesSelector;
    return _matcher;
  }

    // if it doesn't match a native browser method
    // fall back to the delegator function
  _matcher = Delegator.matchesSelector;
  return _matcher;
}

/**
 * determines if the specified element matches a given selector
 *
 * @param {Node} element - the element to compare against the selector
 * @param {string} selector
 * @param {Node} boundElement - the element the listener was attached to
 * @returns {void|Node}
 */
function _matchesSelector (element, selector, boundElement) {
    // no selector means this event was bound directly to this element
  if (selector === '_root') {
    return boundElement;
  }

    // if we have moved up to the element you bound the event to
    // then we have come too far
  if (element === boundElement) {
    return;
  }

    // if this is a match then we are done!
  if (_getMatcher(element).call(element, selector)) {
    return element;
  }

    // if this element did not match but has a parent we should try
    // going up the tree to see if any of the parent elements match
    // for example if you are looking for a click on an <a> tag but there
    // is a <span> inside of the a tag that it is the target,
    // it should still work
  if (element.parentNode) {
    _level++;
    return _matchesSelector(element.parentNode, selector, boundElement);
  }
}

function _addHandler (delegator, event, selector, callback) {
  if (!_handlers[delegator.id]) {
    _handlers[delegator.id] = {};
  }

  if (!_handlers[delegator.id][event]) {
    _handlers[delegator.id][event] = {};
  }

  if (!_handlers[delegator.id][event][selector]) {
    _handlers[delegator.id][event][selector] = [];
  }

  _handlers[delegator.id][event][selector].push(callback);
}

function _removeHandler (delegator, event, selector, callback) {
    // if there are no events tied to this element at all
    // then don't do anything
  if (!_handlers[delegator.id]) {
    return;
  }

    // if there is no event type specified then remove all events
    // example: Delegator(element).off()
  if (!event) {
    for (let type in _handlers[delegator.id]) {
      if (_handlers[delegator.id].hasOwnProperty(type)) {
        _handlers[delegator.id][type] = {};
      }
    }
    return;
  }

    // if no callback or selector is specified remove all events of this type
    // example: Delegator(element).off('click')
  if (!callback && !selector) {
    _handlers[delegator.id][event] = {};
    return;
  }

    // if a selector is specified but no callback remove all events
    // for this selector
    // example: Delegator(element).off('click', '.sub-element')
  if (!callback) {
    delete _handlers[delegator.id][event][selector];
    return;
  }

    // if we have specified an event type, selector, and callback then we
    // need to make sure there are callbacks tied to this selector to
    // begin with.  if there aren't then we can stop here
  if (!_handlers[delegator.id][event][selector]) {
    return;
  }

    // if there are then loop through all the callbacks and if we find
    // one that matches remove it from the array
  for (let i = 0; i < _handlers[delegator.id][event][selector].length; i++) {
    if (_handlers[delegator.id][event][selector][i] === callback) {
      _handlers[delegator.id][event][selector].splice(i, 1);
      break;
    }
  }
}

function _handleEvent (id, e, type) {
  if (!_handlers[id][type]) {
    return;
  }

  let target = e.target || e.srcElement;
  let selector;
  let match;
  let matches = {};
  let i = 0;
  let j = 0;

    // find all events that match
  _level = 0;
  for (selector in _handlers[id][type]) {
    if (_handlers[id][type].hasOwnProperty(selector)) {
      match = _matchesSelector(target, selector, _delegatorInstances[id].element);

      if (match && Delegator.matchesEvent(type, _delegatorInstances[id].element, match, selector === '_root', e)) {
        _level++;
        _handlers[id][type][selector].match = match;
        matches[_level] = _handlers[id][type][selector];
      }
    }
  }

    // stopPropagation() fails to set cancelBubble to true in Webkit
    // @see http://code.google.com/p/chromium/issues/detail?id=162270
  e.stopPropagation = function () {
    e.cancelBubble = true;
  };

  for (i = 0; i <= _level; i++) {
    if (matches[i]) {
      for (j = 0; j < matches[i].length; j++) {
        if (matches[i][j].call(matches[i].match, e) === false) {
          Delegator.cancel(e);
          return;
        }

        if (e.cancelBubble) {
          return;
        }
      }
    }
  }
}

let id = 0;
function nextId () {
  return id++;
}

const aliases = new Map();
const aliasesDefaultTranslator = name => ([ name ]);
const aliasesTranslators = {
  transitionend (name) {
    let el = document.createElement('fakeelement');
    let transitions = {
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'transition': 'transitionend',
    };

    for (let t in transitions) {
      if (el.style[t] !== undefined) {
        return [transitions[t]];
      }
    }
  },
};

function _aliases (name) {
  let theAliases;
  if (aliases.has(name)) {
    theAliases = aliases.get(name);
  } else {
    let translator = aliasesTranslators[name] || aliasesDefaultTranslator;
    theAliases = translator(name);
    aliases.set(name, theAliases);
  }

  return theAliases;
}

/**
 * binds the specified events to the element
 *
 * @param {string|Array} events
 * @param {string} selector
 * @param {Function} callback
 * @param {boolean=} remove
 * @returns {Object}
 */
function _bind (events, selector, callback, remove) {
    // fail silently if you pass null or undefined as an alement
    // in the Delegator constructor
  if (!this.element) {
    return;
  }

  if (!(events instanceof Array)) {
    events = [events];
  }

  if (!callback && typeof (selector) === 'function') {
    callback = selector;
    selector = '_root';
  }

  if (selector instanceof window.HTMLElement) {
    let id;
    if (selector.hasAttribute('bind-event-id')) {
      id = selector.getAttribute('bind-event-id');
    } else {
      id = nextId();
      selector.setAttribute('bind-event-id', id);
    }
    selector = `[bind-event-id="${id}"]`;
  }

  let id = this.id;
  let i;

  function _getGlobalCallback (type) {
    return function (e) {
      _handleEvent(id, e, type);
    };
  }

  for (i = 0; i < events.length; i++) {
    _aliases(events[i]).forEach(alias => {
      // console.info('> ' + events[i] + ':' + alias);
      if (remove) {
        _removeHandler(this, alias, selector, callback);
        return;
      }

      if (!_handlers[id] || !_handlers[id][alias]) {
        Delegator.addEvent(this, alias, _getGlobalCallback(alias));
      }

      _addHandler(this, alias, selector, callback);
    });
  }

  return this;
}

/**
 * Delegator object constructor
 *
 * @param {Node} element
 */
function Delegator (element, id) {
  this.element = element;
  this.id = id;
}

/**
 * adds an event
 *
 * @param {string|Array} events
 * @param {string} selector
 * @param {Function} callback
 * @returns {Object}
 */
Delegator.prototype.on = function (events, selector, callback) {
  return _bind.call(this, events, selector, callback);
};

/**
 * removes an event
 *
 * @param {string|Array} events
 * @param {string} selector
 * @param {Function} callback
 * @returns {Object}
 */
Delegator.prototype.off = function (events, selector, callback) {
  return _bind.call(this, events, selector, callback, true);
};

Delegator.prototype.once = function (events, selector, callback) {
  if (!callback && typeof (selector) === 'function') {
    callback = selector;
    selector = '_root';
  }

  const proxyCallback = (...args) => {
    this.off(events, selector, proxyCallback);
    return callback(...args);
  };

  return this.on(events, selector, proxyCallback);
};

Delegator.prototype.fire = function (type, detail, options) {
  options = options || {};
  detail = detail || {};

  let evt;
  let bubbles = options.bubbles === undefined ? true : options.bubbles;
  let cancelable = Boolean(options.cancelable);

  switch (type) {
    case 'click':
      evt = new window.Event(type, {
        bubbles: bubbles,
        cancelable: cancelable,
        // XXX is it ok to have detail here?
        detail: detail,
      });

      // XXX check if without this works on every browsers
      // evt = document.createEvent('HTMLEvents');
      // evt.initEvent(type, true, false);
      break;
    default:
      evt = new window.CustomEvent(type, {
        bubbles: Boolean(bubbles),
        cancelable: cancelable,
        detail: detail,
      });
      break;
  }

  this.element.dispatchEvent(evt);

  return evt;
};

Delegator.matchesSelector = function () {};
Delegator.cancel = _cancel;
Delegator.addEvent = _addEvent;
Delegator.aliases = _aliases;
Delegator.matchesEvent = function () {
  return true;
};

function eventHelper (element) {
  // only keep one Delegator instance per node to make sure that
  // we don't create a ton of new objects if you want to delegate
  // multiple events from the same node
  //
  // for example: eventHelper(document).on(...
  for (let key in _delegatorInstances) {
    if (_delegatorInstances[key].element === element) {
      return _delegatorInstances[key];
    }
  }

  _id++;
  _delegatorInstances[_id] = new Delegator(element, _id);

  return _delegatorInstances[_id];
}

/* harmony default export */ __webpack_exports__["a"] = eventHelper;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


class AttributeAccessor extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  constructor (node, name) {
    super(node, name.slice(0, -1));
  }

  set (value) {
    if (value) {
      if (value !== this.node.getAttribute(this.name)) {
        this.node.setAttribute(this.name, value);
      }
    } else {
      this.node.removeAttribute(this.name);
    }
  }

  get () {
    return this.node.getAttribute(this.name);
  }
}

/* harmony default export */ __webpack_exports__["a"] = AttributeAccessor;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


class ClassAccessor extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
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

/* harmony default export */ __webpack_exports__["a"] = ClassAccessor;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


class HTMLAccessor extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  set (value = '') {
    this.node.innerHTML = value;
  }

  get () {
    return this.node.innerHTML;
  }
}

/* harmony default export */ __webpack_exports__["a"] = HTMLAccessor;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_inflector__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(0);



class PropertyAccessor extends __WEBPACK_IMPORTED_MODULE_1__base__["a" /* default */] {
  constructor (node, name) {
    super();

    this.node = node;
    this.name = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_inflector__["a" /* camelize */])(name);
  }
}

/* harmony default export */ __webpack_exports__["a"] = PropertyAccessor;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


class StyleAccessor extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  set (value = '') {
    this.node.style[this.name] = value;
  }

  get () {
    throw new Error('Unimplemented');
  }
}

/* harmony default export */ __webpack_exports__["a"] = StyleAccessor;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


class TextAccessor extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  constructor (node) {
    super(node, 'textContent');
  }

  set (value = '') {
    if (value !== this.node.textContent) {
      this.node.textContent = value;
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = TextAccessor;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(0);


class ValueAccessor extends __WEBPACK_IMPORTED_MODULE_0__base__["a" /* default */] {
  constructor (node) {
    super(node, 'value');
  }

  set (value = '') {
    if (document.activeElement !== this.node) {
      super.set(value);
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = ValueAccessor;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Filter {
  constructor (name, callback, otherArgs) {
    this.name = name;
    this.callback = callback;
    this.otherArgs = otherArgs;
  }

  invoke (val) {
    let args = [val];
    [].push.apply(args, this.otherArgs);
    return this.callback.apply(null, args);
  }

  static put (name, callback) {
    registry[name] = callback;
  }

  static get (name) {
    let segments = name.split(':');
    let args = segments.splice(1);
    let key = segments.pop();

    if (key in registry === false) {
      throw new Error(`Filter "${name}" not found.`);
    }

    return new Filter(key, registry[key], args);
  }
}

const registry = {
  required: val => {
    if (val === undefined || val === null || val === '') {
      throw new Error('Value is required');
    }
    return val;
  },
  string: val => String(val),
  number: val => Number(val),
  boolean: val => Boolean(val),
  default: (val, defVal) => (val || defVal),
  upper: val => String.prototype.toUpperCase.call(val || ''),
  lower: val => String.prototype.toLowerCase.call(val || ''),
  not: val => !val,
  slice: (val, begin, end) => Array.prototype.slice.call(val || [], begin, end),
  json: (val, indent) => JSON.stringify(val, null, Number(indent)),
  consoleTrace: val => console.trace(val),
  consoleLog: val => console.log(val),
  consoleInfo: val => console.info(val),
  consoleWarn: val => console.warn(val),
  consoleError: val => console.error(val),
  currency: val => (val || 0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
};

/* harmony default export */ __webpack_exports__["a"] = Filter;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var camelized = {};

function camelize (dash) {
  var mapped = camelized[dash];
  if (mapped) {
    return mapped;
  }
  if (dash.indexOf('-') < 0) {
    camelized[dash] = dash;
  } else {
    camelized[dash] = dash.replace(/-([a-z])/g,
      function (m) {
        return m[1].toUpperCase();
      }
    );
  }

  return camelized[dash];
}

/* harmony default export */ __webpack_exports__["a"] = camelize;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var dashified = {};

function dashify (camel) {
  var mapped = dashified[camel];
  if (mapped) {
    return mapped;
  }
  dashified[camel] = camel.replace(/([a-z][A-Z])/g,
    function (g) {
      return g[0] + '-' + g[1].toLowerCase();
    }
  );

  return dashified[camel];
}

/* unused harmony default export */ var _unused_webpack_default_export = dashify;


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dashify__ = __webpack_require__(17);
/* unused harmony reexport dashify */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__camelize__ = __webpack_require__(16);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__camelize__["a"]; });




/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const CACHE = {};

class Token {
  static get CACHE () {
    return CACHE;
  }

  static get (name) {
    if (name in CACHE) {
      return CACHE[name];
    }

    let token = new Token(name);
    CACHE[name] = token;
    return token;
  }

  constructor (name) {
    this.name = name;
    this.contextName = '';
    this.baseName = '';
    this._value = null;
    this.type = 'v';

    if (!this.name.match(/^[a-zA-Z_]/)) {
      try {
        this._value = JSON.parse(this.name);
        this.type = 's';
        return;
      } catch (err) {
      }
    }

    if (this.type === 'v') {
      let nameSegments = this.name.split('.');
      this.baseName = nameSegments.pop();
      this.contextName = nameSegments.join('.');
    }
  }

  value (...contexts) {
    if (this.type === 's') {
      return this._value;
    }

    for (let context of contexts) {
      if (!context) {
        continue;
      }

      let val = typeof context.get === 'function' ? context.get(this.name) : context[this.name];
      if (val !== undefined) {
        return val;
      }
    }
  }

  invoke (args, ...contexts) {
    if (contexts.length === 0) {
      throw new Error(`Cannot invoke method ${this.name} of undefined context`);
    }

    if (this.type === 's') {
      let [ context ] = contexts;
      throw new Error(`Method is not eligible, ${context.__templateHost.nodeName || '$anonymous'}#${this.name}`);
    }

    for (let context of contexts) {
      if (!context) {
        continue;
      }

      if (typeof context.get === 'function') {
        let ctx = this.contextName ? context.get(this.contextName) : context;
        if (typeof ctx[this.baseName] === 'function') {
          return ctx[this.baseName](...args);
        }
      } else if (typeof context[this.name] === 'function') {
        return context[this.name].apply(context, args);
      }
    }

    let [ context ] = contexts;
    throw new Error(`Method is not eligible, ${context.__templateHost.nodeName || '$anonymous'}#${this.name}`);
  }
}

/* harmony default export */ __webpack_exports__["a"] = Token;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_event_helper__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__expr__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__binding__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__accessor__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__annotation__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_template__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_slot__ = __webpack_require__(5);










const nextId = (function () {
  let id = 0;
  return function () {
    return id++;
  };
})();

function T (template, host, marker) {
  this.__templateInitialize(template, host, marker);
  this.__templateRender();
}

T.prototype = {
  get $ () {
    return this.__templateHost.getElementsByTagName('*');
  },

  $$ (selector) {
    return this.querySelector(selector);
  },

  promised (eventName, selector) {
    return new Promise(resolve => {
      if (selector) {
        this.once(eventName, selector, resolve);
      } else {
        this.once(eventName, resolve);
      }
    });
  },

  on () {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_event_helper__["a" /* default */])(this.__templateHost).on(...arguments);
  },

  off () {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_event_helper__["a" /* default */])(this.__templateHost).off(...arguments);
  },

  once () {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_event_helper__["a" /* default */])(this.__templateHost).once(...arguments);
  },

  all (obj) {
    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        this.set(i, obj[i]);
      }
    }
  },

  get (path) {
    let object = this;

    this.__templateGetPathAsArray(path).some(segment => {
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
    path = this.__templateGetPathAsArray(path);

    let oldValue = this.get(path);

    if (value === oldValue) {
      return;
    }

    let object = this;

    path.slice(0, -1).forEach(segment => {
      if (!object) {
        return;
      }
      if (object[segment] === undefined || object[segment] === null) {
        object[segment] = {};
      }

      object = object[segment];
    });

    let property = path.slice(-1).pop();

    object[property] = value;

    this.notify(path, value);
  },

  push (path, ...values) {
    path = this.__templateGetPathAsArray(path);

    let object = this;

    path.slice(0, -1).forEach(segment => {
      if (!object) {
        return;
      }
      if (object[segment] === undefined || object[segment] === null) {
        object[segment] = {};
      }

      object = object[segment];
    });

    let property = path.slice(-1).pop();

    if (!Array.isArray(object[property])) {
      object[property] = [];
    }

    object[property] = object[property].slice();
    let result = object[property].push(...values);
    this.notify(path, object[property]);

    // let index = object[property].length;
    // let removed = [];
    // let addedCount = values.length;
    // let result = object[property].push(...values);
    //
    // object = object[property];
    //
    // this.notifySplices(path, [
    //   { index, removed, addedCount, object, type: 'splice' },
    // ]);

    return result;
  },

  pop (path) {
    path = this.__templateGetPathAsArray(path);

    let object = this;

    path.slice(0, -1).forEach(segment => {
      if (!object) {
        return;
      }
      if (object[segment] === undefined || object[segment] === null) {
        object[segment] = {};
      }

      object = object[segment];
    });

    let property = path.slice(-1).pop();

    if (!Array.isArray(object[property])) {
      object[property] = [];
    }

    object[property] = object[property].slice();
    let result = object[property].pop();
    this.notify(path, object[property]);

    // let index = object[property].length;
    // let addedCount = 0;
    // let result = object[property].pop();
    // let removed = [ result ];
    //
    // object = object[property];
    //
    // this.notifySplices(path, [
    //   { index, removed, addedCount, object, type: 'splice' },
    // ]);

    return result;
  },

  splice (path, index, removeCount, ...values) {
    path = this.__templateGetPathAsArray(path);

    let object = this;

    path.slice(0, -1).forEach(segment => {
      if (!object) {
        return;
      }
      if (object[segment] === undefined || object[segment] === null) {
        object[segment] = {};
      }

      object = object[segment];
    });

    let property = path.slice(-1).pop();

    if (!Array.isArray(object[property])) {
      object[property] = [];
    }

    object[property] = object[property].slice();
    let result = object[property].splice(index, removeCount, ...values);
    this.notify(path, object[property]);

    // let addedCount = values.length;
    // let result = object[property].splice(...values);
    // let removed = result;
    //
    // object = object[property];
    //
    // this.notifySplices(path, [
    //   { index, removed, addedCount, object, type: 'splice' },
    // ]);

    return result;
  },

  notify (path, value) {
    path = this.__templateGetPathAsString(path);

    if (!this.__templateReady) {
      if (this.__templateNotifyOnReady.indexOf(path) === -1) {
        this.__templateNotifyOnReady.push(path);
      }
      return;
    }

    let binding = this.__templateGetBinding(path);
    if (binding) {
      if (value === undefined) {
        value = this.get(path);
      }

      binding.walkEffect('set', value);
    }
  },

  // notifySplices (path, splices) {
  //   path = this.__templateGetPathAsString(path);
  //
  //   if (!this.__templateReady) {
  //     if (this.__templateNotifyOnReady.indexOf(path) === -1) {
  //       this.__templateNotifyOnReady.push(path);
  //     }
  //     return;
  //   }
  //
  //   let binding = this.__templateGetBinding(path);
  //   if (binding) {
  //     binding.walkEffect('splice', splices);
  //   }
  // },

  __templateInitialize (template, host, marker) {
    this.__templateId = nextId();
    this.__templateBindings = {};
    this.__templateHost = host || (template ? template.parentElement : null);
    this.__templateMarker = marker;

    this.__templateReady = false;
    this.__templateNotifyOnReady = [];

    if (!template) {
      return;
    }

    // do below only if template is exists
    this.__template = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__helpers_template__["a" /* fix */])(template);
    this.__templateChildNodes = [];

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
      this.__templateMarker = document.createComment(`marker-${this.__templateId}`);
      this.__templateHost.appendChild(this.__templateMarker);
    }
  },

  __templateRender (contentFragment) {
    this.__templateReady = true;

    this.__templateNotifyOnReady.forEach(key => {
      this.notify(key, this.get(key));
    });
    this.__templateNotifyOnReady = [];

    if (!this.__template) {
      return;
    }

    let fragment = this.__templateFragment;
    this.__templateFragment = null;

    if (contentFragment && contentFragment instanceof window.DocumentFragment) {
      // try {
      [].forEach.call(fragment.querySelectorAll('slot'), slot => {
        let name = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__helpers_slot__["a" /* slotName */])(slot);
        let parent = slot.parentElement || fragment;
        let marker = document.createComment(`slot ${name}`);

        parent.insertBefore(marker, slot);
        parent.removeChild(slot);

        if (name) {
          let node = contentFragment.querySelectorAll(`[slot="${name}"]`);
          [].forEach.call(node, (node) => {
            parent.insertBefore(node, marker);
          });
        } else {
          parent.insertBefore(contentFragment, marker);
        }
      });
    }

    this.__templateMarker.parentElement.insertBefore(fragment, this.__templateMarker);
  },

  __templateUninitialize () {
    this.__templateChildNodes.forEach(node => {
      node.parentElement.removeChild(node);
    });
  },

  __templateGetPathAsArray (path) {
    // if (!path) {
    //   throw new Error(`Unknown path ${path} to set to ${this.is}`);
    // }

    if (typeof path !== 'string') {
      return path;
    }

    return path.split('.');
  },

  __templateGetPathAsString (path) {
    if (typeof path === 'string') {
      return path;
    }

    return path.join('.');
  },

  __parseAnnotations () {
    this.__templateChildNodes = [ ...this.__templateFragment.childNodes ];

    let len = this.__templateChildNodes.length;

    for (let i = 0; i < len; i++) {
      let node = this.__templateChildNodes[i];

      switch (node.nodeType) {
        case window.Node.ELEMENT_NODE:
          this.__parseElementAnnotations(node);
          break;
        case window.Node.TEXT_NODE:
          this.__parseTextAnnotations(node);
          break;
      }
    }
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
    let expr = __WEBPACK_IMPORTED_MODULE_1__expr__["a" /* default */].getFn(attrValue, [], true);

    this.on(eventName, element, evt => {
      expr.invoke(context, { evt });
    });
  },

  __parseAttributeAnnotations (element) {
    // clone attributes to array first then foreach because we will remove
    // attribute later if already processed
    // this hack to make sure when attribute removed the attributes index doesnt shift.
    let annotated = false;

    let len = element.attributes.length;

    for (let i = 0; i < len; i++) {
      let attr = element.attributes[i];

      let attrName = attr.name;

      if (attrName === 'id' || attrName === 'class' || attrName === 'style') {
        continue;
      }

      if (attrName.indexOf('(') === 0) {
        this.__parseEventAnnotations(element, attrName);
      } else {
        // bind property annotation
        annotated = this.__templateAnnotate(__WEBPACK_IMPORTED_MODULE_1__expr__["a" /* default */].get(attr.value), __WEBPACK_IMPORTED_MODULE_3__accessor__["a" /* default */].get(element, attrName)) || annotated;
      }
    }

    return annotated;
  },

  __parseElementAnnotations (element) {
    let annotated = false;

    // when element already has template model it means it already parsed, skip
    // parsing that element
    if (element.__templateModel) {
      return annotated;
    }

    element.__templateModel = this;

    if (element.attributes && element.attributes.length) {
      annotated = this.__parseAttributeAnnotations(element) || annotated;
    }

    if (element.childNodes && element.childNodes.length) {
      let childNodes = [].slice.call(element.childNodes);
      let childNodesLength = childNodes.length;

      for (let i = 0; i < childNodesLength; i++) {
        annotated = this.__parseNodeAnnotations(childNodes[i]) || annotated;
      }
    }

    [].forEach.call(element.getElementsByTagName('slot'), slot => {
      [].forEach.call(slot.childNodes, node => {
        annotated = this.__parseNodeAnnotations(node) || annotated;
      });
    });

    return annotated;
  },

  __parseNodeAnnotations (node) {
    switch (node.nodeType) {
      case window.Node.TEXT_NODE:
        return this.__parseTextAnnotations(node);
      case window.Node.ELEMENT_NODE:
        return this.__parseElementAnnotations(node);
    }
  },

  __parseTextAnnotations (node) {
    let expr = __WEBPACK_IMPORTED_MODULE_1__expr__["a" /* default */].get(node.textContent);
    let accessor = __WEBPACK_IMPORTED_MODULE_3__accessor__["a" /* default */].get(node);
    return this.__templateAnnotate(expr, accessor);
  },

  __templateAnnotate (expr, accessor) {
    if (expr.type === 's') {
      return false;
    }

    if (expr.constant) {
      let val = expr.invoke(this);
      accessor.set(val);
      return false;
    }

    // annotate every paths
    let annotation = new __WEBPACK_IMPORTED_MODULE_4__annotation__["a" /* default */](this, expr, accessor);

    // TODO when the annotation to specific model, expr and accessor already exist
    // do not reannotate, see repeat@_itemsChanged
    // if (expr && expr.name === '_itemsChanged') {
    //   console.log(annotation);
    // }

    if (expr.type === 'm') {
      this.__templateGetBinding(expr.fn.name).annotate(annotation);
    }

    expr.vpaths.forEach(arg => this.__templateGetBinding(arg.name).annotate(annotation));

    return true;
  },

  __templateGetBinding (path) {
    let segments = path.split('.');
    let bindings;
    let binding;

    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];

      bindings = binding ? binding.paths : this.__templateBindings;

      if (!bindings[segment]) {
        bindings[segment] = new __WEBPACK_IMPORTED_MODULE_2__binding__["a" /* default */](this, segment);
      }

      binding = bindings[segment];
    }

    return binding;
  },
};

// new version will not export filter token and css modules
// T.Filter = Filter;
// T.Accessor = Accessor;
// T.Token = Token;
// T.Css = Css;

window.T = T;

/* harmony default export */ __webpack_exports__["default"] = T;


/***/ })
/******/ ]);
//# sourceMappingURL=t.js.map