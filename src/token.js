class Token {
  static get (name) {
    if (!Token.CACHE[name]) {
      Token.CACHE[name] = new Token(name);
    }
    return Token.CACHE[name];
  }

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
    context = context || window;

    if (this.type === 's') {
      return this._value;
    }

    let val = valueOf(context, this.name);
    if (typeof val !== 'undefined') {
      return val;
    }

    val = valueOf(others, this.name);
    if (typeof val !== 'undefined') {
      return val;
    }

    return;
  }
}

function valueOf (context, key) {
  if (context) {
    return typeof context.get === 'function' ? context.get(key) : context[key];
  }
}

Token.CACHE = {};

export default Token;
