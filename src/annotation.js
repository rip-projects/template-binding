class Annotation {
  constructor (model, expr, accessor) {
    this.model = model;
    this.expr = expr;
    this.accessor = accessor;
  }

  effect (value) {
    if (this.accessor) {
      // FIXME implement composite annotation
      // FIXME implement filtered annotation
      // FIXME implement function type annotation
      this.accessor.set(this.expr.invoke(this.model));
    } else {
      this.expr.invoke(this.model);
    }
  }
}

module.exports = Annotation;
