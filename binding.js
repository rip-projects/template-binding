class Binding {
  constructor (context, model) {
    this.context = context;
    this.model = model;
    this.paths = {};
    this.annotations = [];
  }

  annotate (annotation) {
    if (this.isAnnotated(annotation)) {
      return;
    }

    this.annotations.push(annotation);
  }

  isAnnotated ({ model, expr }) {
    let annotation = this.annotations.find(annotation => annotation.model === model && annotation.expr === expr);
    return Boolean(annotation);
  }

  walkEffect (type, value) {
    this.annotations.forEach(annotation => {
      annotation.effect(type, value/* , this.model */);
    });

    Object.keys(this.paths).forEach(i => {
      this.paths[i].walkEffect(type, value);
    });
  }
}

export default Binding;
