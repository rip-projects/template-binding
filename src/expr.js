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

    if (type === 's') {
      return;
    }

    let tokens = value.split('|');
    let token = tokens[0].trim();

    this.filters = tokens.slice(1).map(word => {
      return Filter.get(word.trim());
    });

    if (token.indexOf('(') < 0) {
      this.type = 'p';
      this.name = token;
      this.args.push(Token.get(token));
    } else {
      // force mode to '[' when type is !p
      this.mode = '[';
      this.type = 'm';

      let matches = token.match(/([^(]+)\(([^)]*)\)/);

      this.name = matches[1].trim();

      this.args = tokenize(matches[2]);
    }
  }

  get constant () {
    return this.vpaths.length !== this.args.length;
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
  return rawTokenize(str).map(token => Token.get(token));
}

module.exports = Expr;
module.exports.getFn = getFn;
module.exports.get = get;
module.exports.rawTokenize = rawTokenize;
module.exports.tokenize = tokenize;
