class Annotation {
  constructor (accessor) {
    this.accessor = accessor;
  }

  annotate (model) {
    let accessor = this.accessor;
    let expr = accessor.expr;

    this.model = model;

    expr.annotatedPaths.forEach(arg => model.__templateGetBinding(arg.name).annotations.push(this));

    if (expr.mode === '{') {
      let notifyCallback = evt => {
        evt.stopImmediatePropagation();
        model.set(accessor.expr.name, accessor.get());
      };

      accessor.changeEvents.forEach(name => model.addTargetedListener(name, accessor.node, notifyCallback));
    }
  }

  effect (value) {
    // FIXME implement composite annotation
    // FIXME implement filtered annotation
    // FIXME implement function type annotation
    this.accessor.set(value, this.model);
  }
}

function annotate (model, accessor) {
  if (accessor.expr.type === 's') {
    return false;
  }

  (new Annotation(accessor)).annotate(model);

  return true;
}

module.exports = Annotation;
module.exports.annotate = annotate;
