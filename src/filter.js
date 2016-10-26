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
    return new Filter(key, registry[key], args);
  }
}

const registry = {
  required: (val) => {
    if (val === undefined || val === null || val === '') {
      throw new Error('Value is required');
    }
    return val;
  },
  upper: (val) => String.prototype.toUpperCase.call(val || ''),
  lower: (val) => String.prototype.toLowerCase.call(val || ''),
  not: (val) => !val,
  slice: (val, begin, end) => Array.prototype.slice.call(val || [], begin, end),
};

module.exports = Filter;
