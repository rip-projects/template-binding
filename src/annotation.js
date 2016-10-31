class Annotation {
  constructor (model, expr, accessor) {
    this.model = model;
    this.expr = expr;
    this.accessor = accessor;
  }

  effect (value) {
    if (this.accessor) {
      let value = this.expr.invoke(this.model);
      // FIXME implement composite annotation
      this.accessor.set(value);
    } else {
      this.expr.invoke(this.model);
    }
  }
}

export default Annotation;
