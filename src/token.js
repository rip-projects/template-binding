const GLOBAL = global || window;

class Token {
  constructor (name) {
    this.name = name;
    try {
      let value = JSON.parse(this.name);
      this.type = 's';
      this._value = value;
    } catch (err) {
      this.type = 'v';
      this._value = null;
    }
  }

  value (context, others) {
    context = context || GLOBAL;

    if (this.type === 's') {
      return this._value;
    }

    if (context && this.name in context) {
      return context[this.name];
    }

    if (others && this.name in others) {
      return others[this.name];
    }

    return;
  }
}

function get (name) {
  // FIXME implement cache
  return new Token(name);
}

module.exports = Token;
module.exports.get = get;
