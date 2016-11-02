class Binding {
  constructor (context, model) {
    this.context = context;
    this.model = model;
    this.paths = {};
    this.annotations = [];
  }

  walkEffect (value) {
    this.annotations.forEach(annotation => {
      // try {
      annotation.effect(value, this.model);
      // } catch (err) {
      //   console.error(`Error caught while walk effect annotation: ${annotation.expr ? annotation.expr.value : '#unknown'}\n ${err.stack}`);
      // }
    });

    Object.keys(this.paths).forEach(i => {
      this.paths[i].walkEffect(value ? value[i] : undefined);
    });
  }
}

export default Binding;
