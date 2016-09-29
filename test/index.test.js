(fn => {
  if (typeof T === 'function') {
    return fn(chai.assert, T, window.Event);
  }
  module.exports = fn(require('assert'), require('../src'));
})((assert, T, Event) => {
  if (typeof window === 'undefined') return;

  describe('T', () => {
    before(() => {
      console.log('before');
    });

    /* globals sandbox1, tpl1 */
    it('basic template', () => {
      var tpl = new T(tpl1);
      tpl.bar = 'bar';
      tpl.render();
      assert.equal(sandbox1.textContent.trim(), 'Foo bar baz');
      tpl.set('bar', 'bar-too');
      assert.equal(sandbox1.textContent.trim(), 'Foo bar-too baz');
    });

    /* globals sandbox2, tpl2 */
    it('template with deep model', () => {
      var tpl = new T(tpl2);
      tpl.user = {
        name: 'superman',
        occupation: 'superhero',
      };
      tpl.render();
      assert.equal(sandbox2.textContent.trim().split('\n')[0], 'Name: superman');
      tpl.set('user.name', 'clark kent');
      assert.equal(sandbox2.textContent.trim().split('\n')[0], 'Name: clark kent');
      tpl.set('user', {
        name: 'batman',
        occupation: 'hero',
      });
      assert.equal(sandbox2.textContent.trim().split('\n')[0], 'Name: batman');
    });

    /* globals sandbox3, tpl3 */
    it('two-way binding', () => {
      var tpl = new T(tpl3);
      tpl.render();
      tpl.set('user.name', 'foo');
      assert.equal(sandbox3.textContent.trim(), 'Hello foo!');
      sandbox3.querySelector('input').value = 'bar';
      sandbox3.querySelector('input').dispatchEvent(new Event('input'));
      assert.equal(sandbox3.textContent.trim(), 'Hello bar!');
    });

    /* globals sandbox4, tpl4 */
    it('event binding', () => {
      var tpl = new T(tpl4);
      tpl.tapCount = 0;
      tpl.tapped = () => tpl.set('tapCount', tpl.tapCount + 1);
      tpl.render();
      sandbox4.querySelector('a').dispatchEvent(new Event('click'));
      assert.equal(sandbox4.querySelector('div').textContent.trim(), '1 times');
    });

    /* globals sandbox5, tpl5 */
    it('attribute binding', () => {
      var tpl = new T(tpl5);
      tpl.render();
      tpl.set('foo', 'foo');
      tpl.set('bar', 'bar');
      assert.equal(sandbox5.querySelector('div').foo, 'foo');
      assert.notEqual(sandbox5.querySelector('div').bar, 'bar');
      assert.equal(sandbox5.querySelector('div').getAttribute('bar'), 'bar');
      assert.notEqual(sandbox5.querySelector('div').getAttribute('foo'), 'foo');
    });

    it('computed binding', () => {
      var tpl = new T();
      tpl.addComputedProperty('fullName', '__compute(firstName, lastName)');
      tpl.__compute = function (firstName, lastName) {
        return firstName + ' ' + lastName;
      };

      tpl.set('firstName', 'foo');
      tpl.set('lastName', 'bar');

      assert.equal(tpl.get('fullName'), 'foo bar');
    });
  });
});
