const Token = require('./token');

class Expr {
  constructor (value, unwrapped) {
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

    let token = value;
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
    let f = typeof context.get === 'function' ? context.get(this.name) : context[this.name];

    if (this.type === 'p') {
      return f;
    }

    if (typeof f !== 'function') {
      throw new Error(`Method is not eligible, ${context.nodeName}#${this.name}`);
    }

    let args = this.args.map(arg => {
      return arg.value(context, otherArgs);
    });

    return f.apply(context, args);
  }
}

function get (value, unwrapped) {
  // FIXME implement cache
  return new Expr(value, unwrapped);
}

function getFn (value, args, unwrapped) {
  return get(value.indexOf('(') === -1 ? (value + '(' + args.join(', ') + ')') : value, unwrapped);
}

function rawTokenize (str) {
  let count = 0;
  let tokens = [];

  while (str && count++ < 10) {
    let matches = str.match(/^\s*("[^"]*"|'[^']*'|[^,]+),?/);

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
