(fn => {
  if (typeof T === 'function') {
    return fn(chai.assert, T, window.fixture);
  }
  module.exports = fn(require('assert'), require('../src'), require('../lib/fixture'));
})((assert, T, fixture) => {
  /* globals sandbox1, tpl1 */
  describe('T', function () {
    if (!process.env.COVERAGE) {
      this.timeout(15000);

      it('basic template', done => {
        fixture(`
          <div id="sandbox1" class="sandbox">
            <template id="tpl1">
              Foo <span>[[bar]]</span> baz
            </template>
          </div>
        `)
        .inject('js', './js/t.js')
        .evaluate(() => {
          var tpl = new T(tpl1);
          tpl.bar = 'bar';
          tpl.__templateRender();

          let result = [];

          result.push(sandbox1.textContent.trim());

          tpl.set('bar', 'bar-too');

          result.push(sandbox1.textContent.trim());

          return result;
        })
        .end()
        .then(result => {
          assert(result, 'Result not found');
          assert.equal(result[0], 'Foo bar baz');
          assert.equal(result[1], 'Foo bar-too baz');
        })
        .then(done, err => {
          console.error(err.stack);
          done(new Error(err));
        });
      });

      /* globals sandbox2, tpl2 */
      it('template with deep model', done => {
        fixture(`
          <div id="sandbox2" class="sandbox">
            <template id="tpl2">
              <p>Name: <span>[[user.name]]</span></p>
              <p>Occupation: <span>[[user.occupation]]</span></p>
            </template>
          </div>
          `)
          .inject('js', './js/t.js')
          .evaluate(() => {
            var tpl = new T(tpl2);
            tpl.user = {
              name: 'superman',
              occupation: 'superhero',
            };
            tpl.__templateRender();
            let result = [];
            result.push(sandbox2.textContent.trim().split('\n')[0]);
            tpl.set('user.name', 'clark kent');
            result.push(sandbox2.textContent.trim().split('\n')[0]);
            tpl.set('user', {
              name: 'batman',
              occupation: 'hero',
            });
            result.push(sandbox2.textContent.trim().split('\n')[0]);
            return result;
          })
          .end()
          .then(result => {
            assert(result, 'Result not found');
            assert.equal(result[0], 'Name: superman');
            assert.equal(result[1], 'Name: clark kent');
            assert.equal(result[2], 'Name: batman');
          })
          .then(done, err => {
            console.error(err.stack);
            done(new Error(err));
          });
      });

      /* globals sandbox3, tpl3 */
      it('two-way binding', done => {
        fixture(`
          <div id="sandbox3" class="sandbox">
            <template id="tpl3">
              <input type="text" value="{{ user.name }}">
              Hello <span>[[user.name]]</span>!
            </template>
          </div>
          `)
          .inject('js', './js/t.js')
          .evaluate(() => {
            let result = [];
            var tpl = new T(tpl3);
            tpl.__templateRender();
            tpl.set('user.name', 'foo');
            result.push(sandbox3.textContent.trim());
            sandbox3.querySelector('input').value = 'bar';
            sandbox3.querySelector('input').dispatchEvent(new window.Event('input'));
            result.push(sandbox3.textContent.trim());
            return result;
          })
          .end()
          .then(result => {
            assert(result, 'Result not found');
            assert.equal(result[0], 'Hello foo!');
            assert.equal(result[1], 'Hello bar!');
          })
          .then(done, err => {
            console.error(err.stack);
            done(new Error(err));
          });
      });

      /* globals sandbox4, tpl4 */
      it('event binding', done => {
        fixture(`
          <div id="sandbox4" class="sandbox">
            <template id="tpl4">
              <a href="#" (tap)="tapped">tap me</a>

              <div class="result">
                <span>[[tapCount]]</span> times
              </div>
            </template>
          </div>
          `)
          .inject('js', './js/t.js')
          .evaluate(() => {
            let result = [];
            var tpl = new T(tpl4);
            tpl.tapCount = 0;
            tpl.tapped = () => tpl.set('tapCount', tpl.tapCount + 1);
            tpl.__templateRender();
            sandbox4.querySelector('a').dispatchEvent(new window.Event('click'));
            result.push(sandbox4.querySelector('div').textContent.trim());
            return result;
          })
          .end()
          .then(result => {
            assert(result, 'Result not found');
            assert.equal(result[0], '1 times');
          })
          .then(done, err => {
            console.error(err.stack);
            done(new Error(err));
          });
      });

      /* globals sandbox5, tpl5 */
      it('attribute binding', done => {
        fixture(`
          <div id="sandbox5" class="sandbox">
            <template id="tpl5">
              <div foo="[[foo]]" bar$="[[bar]]"></div>
            </template>
          </div>
          `)
          .inject('js', './js/t.js')
          .evaluate(() => {
            let result = [];
            var tpl = new T(tpl5);
            tpl.__templateRender();
            tpl.set('foo', 'foo');
            tpl.set('bar', 'bar');
            result.push(sandbox5.querySelector('div').foo);
            result.push(sandbox5.querySelector('div').bar);
            result.push(sandbox5.querySelector('div').getAttribute('bar'));
            result.push(sandbox5.querySelector('div').getAttribute('foo'));
            return result;
          })
          .end()
          .then(result => {
            assert(result, 'Result not found');
            assert.equal(result[0], 'foo');
            assert.notEqual(result[1], 'bar');
            assert.equal(result[2], 'bar');
            assert.notEqual(result[3], 'foo');
          })
          .then(done, err => {
            console.error(err.stack);
            done(new Error(err));
          });
      });
    }

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
