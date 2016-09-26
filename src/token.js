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

  value (context) {
    context = context || GLOBAL;

    if (this.type === 's') {
      return this._value;
    }

    return context[this.name];
  }
}

function get (name) {
  // FIXME implement cache
  return new Token(name);
}

module.exports = Token;
module.exports.get = get;
