const Token = require('./token');

class Expr {
  constructor (value) {
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

    let token = value.slice(2, -2).trim();
    this.mode = value[0];

    if (value.indexOf('(') < 0) {
      this.type = 'p';
      this.name = token;
      this.args.push(new Token(token));
    } else {
      this.type = 'm';

      let matches = token.match(/([^(]+)\(([^)]+)\)/);

      this.name = matches[1].trim();

      this.args = tokenize(matches[2]);
    }
  }

  get annotatedArgs () {
    if (!this._annotatedArgs) {
      let annotatedArgs = [];
      this.args.forEach(arg => {
        if (arg.type === 'v' && annotatedArgs.indexOf(arg.name) === -1) {
          annotatedArgs.push(arg);
        }
      });
      this._annotatedArgs = annotatedArgs;
    }

    return this._annotatedArgs;
  }

  invoke (context) {
    if (this.type === 'p') {
      return context[this.name];
    }

    let args = this.args.map(arg => {
      return arg.value(context);
    });
    return context[this.name].apply(context, args);
  }
}

function get (value) {
  // FIXME implement cache
  return new Expr(value);
}

function rawTokenize (str) {
  let count = 0;
  let tokens = [];

  do {
    let matches = str.match(/^\s*("[^"]*"|'[^']*'|[^,]+),?/);

    str = str.substr(matches[0].length);
    tokens.push(matches[1].trim());
  } while (str && count++ < 10);

  return tokens;
}

function tokenize (str) {
  return rawTokenize(str).map(token => new Token(token));
}

module.exports = Expr;
module.exports.get = get;
module.exports.rawTokenize = rawTokenize;
module.exports.tokenize = tokenize;
