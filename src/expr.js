const Token = require('./token');
const Filter = require('./filter');

class Expr {
  constructor (value, mode, type) {
    // define base properties
    this.mode = mode;
    this.type = type;
    this.name = '';
    this.args = [];
    this.filters = [];
    this.value = value;
    // this.unwrapped = Boolean(unwrapped);

    // TODO support expr with function or others
    // let valType = typeof value;
    // if (valType === 'function') {
    //   this.type = 'm';
    //   return;
    // } else if (valType !== 'string') {
    //   // validate args
    //   return;
    // }

    // cleanse value
    // value = value.trim();

    if (type === 's') {
      return;
    }

    let tokens = value.split('|');
    let token = tokens[0].trim();

    this.filters = tokens.slice(1).map(word => {
      return Filter.get(word.trim());
    });

    // if (!this.unwrapped) {
    //   if (value[0] !== '[' && value[0] !== '{') {
    //     return;
    //   }
    //   token = value.slice(2, -2).trim();
    //   this.mode = value[0];
    // }

    if (token.indexOf('(') < 0) {
      this.type = 'p';
      this.name = token;
      this.args.push(new Token(token));
    } else {
      // force mode to '[' when type is !p
      this.mode = '[';
      this.type = 'm';

      let matches = token.match(/([^(]+)\(([^)]*)\)/);

      this.name = matches[1].trim();

      this.args = tokenize(matches[2]);
    }
  }

  get annotatedPaths () {
    if (!this._annotatedPaths) {
      let annotatedPaths = [];
      this.args.forEach(arg => {
        if (arg.type === 'v' && annotatedPaths.indexOf(arg.name) === -1) {
          annotatedPaths.push(arg);
        }
      });
      this._annotatedPaths = annotatedPaths;
    }

    return this._annotatedPaths;
  }

  invoke (context, otherArgs) {
    if (this.type === 'p') {
      let val = typeof context.get === 'function' ? context.get(this.name) : context[this.name];
      return this.filters.reduce((val, filter) => filter.invoke(val), val);
    }

    let fn = context.__templateHost[this.name];
    if (typeof fn !== 'function') {
      throw new Error(`Method is not eligible, ${context.__templateHost.nodeName || '$anonymous'}#${this.name}`);
    }

    let args = this.args.map(arg => {
      return arg.value(context, otherArgs);
    });

    return fn.apply(context, args);
  }
}

Expr.CACHE = {
  '[s': new Expr('', '[', 's'),
};

function _get (value, mode, type) {
  let key = value + mode + type;
  let expr = Expr.CACHE[key];

  if (!expr) {
    expr = new Expr(value, mode, type);
    if (type !== 's') {
      Expr.CACHE[key] = expr;
    }
  }

  return expr;
}

function get (value, unwrapped) {
  value = (value || '').trim();

  if (unwrapped) {
    return _get(value, '[', 'v');
  }

  let mode = value[0];
  if (mode === '[' || mode === '{') {
    value = value.slice(2, -2).trim();
    return _get(value, mode, 'v');
  }

  return _get(value, '[', 's');
}

function getFn (value, args, unwrapped) {
  // if (typeof value === 'function') {
  //   return get(value, unwrapped);
  // }
  return get(value.indexOf('(') === -1 ? (value + '(' + args.join(', ') + ')') : value, unwrapped);
}

function rawTokenize (str) {
  let count = 0;
  let tokens = [];

  while (str && count++ < 10) {
    let matches = str.match(/^\s*("[^"]*"|[^,]+),?/);

    str = str.substr(matches[0].length);
    tokens.push(matches[1].trim());
  }

  return tokens;
}

function tokenize (str) {
  return rawTokenize(str).map(token => new Token(token));
}

module.exports = Expr;
module.exports.getFn = getFn;
module.exports.get = get;
module.exports.rawTokenize = rawTokenize;
module.exports.tokenize = tokenize;
