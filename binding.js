class Binding {
  constructor (context, model) {
    this.context = context;
    this.model = model;
    this.paths = {};
    this.annotations = [];
  }

  annotate (annotation) {
    this.annotations.push(annotation);
  }

  walkEffect (value) {
    this.annotations.forEach(annotation => {
      annotation.effect(value/* , this.model */);
    });

    Object.keys(this.paths).forEach(i => {
      this.paths[i].walkEffect(value ? value[i] : undefined);
    });
  }
}

export default Binding;
