(fn => {
  if (typeof T === 'function') {
    return fn(chai.assert, T.Expr);
  }
  module.exports = fn(require('assert'), require('../src/expr'));
})((assert, Expr, expr) => {
  describe('Expr', () => {
    describe('#invoke()', () => {
      it('return value of property expr', () => {
        let ex = new Expr('{{ foo }}');

        let context = {
          foo: 'bar',
        };

        assert.equal(ex.invoke(context), 'bar');
      });

      it('return value of method expr', () => {
        let ex = new Expr('{{ fnFoo(bar) }}');

        let context = {
          fnFoo: function (x) {
            return 'fooed ' + x;
          },

          bar: 'bar',
        };

        assert.equal(ex.invoke(context), 'fooed bar');
      });
    });
  });

  describe('Expr.expr()', () => {
    let ex = Expr.get('{{ foo }}');

    it('return expr instance', () => assert(ex instanceof Expr));
    it('has value', () => assert.equal(ex.value, '{{ foo }}'));
    it('has name', () => assert.equal(ex.name, 'foo'));
    it('has mode', () => assert.equal(ex.mode, '{'));
  });
});
