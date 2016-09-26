class Annotation {
  constructor (expr, target) {
    this.expr = expr;
    this.target = target;
  }

  effect(value) {
    this.target.textContent = value;
  }
}

module.exports = Annotation;
