class Binding {
  constructor (context, model) {
    this.context = context;
    this.model = model;
    this.paths = {};
    this.annotations = [];
  }

  walkEffect (value) {
    this.annotations.forEach(function (annotation) {
      try {
        annotation.effect(value);
      } catch (err) {
        console.error('Error caught while walk effect annotation: ' + annotation.expr.value + '\n' + err.stack);
      }
    });

    Object.keys(this.paths).forEach(i => this.paths[i].walkEffect(value ? value[i] : undefined));
  }
}

module.exports = Binding;
