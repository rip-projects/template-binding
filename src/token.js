const CACHE = new Map();

class Token {
  static get CACHE () {
    return CACHE;
  }

  static get (name) {
    if (CACHE.has(name)) {
      return CACHE.get(name);
    }

    let token = new Token(name);
    CACHE.set(name, token);
    return token;
  }

  constructor (name) {
    this.name = name;
    try {
      this._value = JSON.parse(this.name);
      this.type = 's';
    } catch (err) {
      this._value = null;
      this.type = 'v';
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

export default Token;
