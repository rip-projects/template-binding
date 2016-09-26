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
}

module.exports = Binding;
