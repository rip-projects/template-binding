/* globals chai */
(fn => {
  if (typeof window !== 'undefined') {
    window.fixture = fn(chai.assert);
    return;
  }
  process.env.COVERAGE = process.env.COVERAGE || process.env._.indexOf('istanbul') >= 0;
  module.exports = fn(require('assert'), require('nightmare'));
})((assert, Nightmare) => {
  function iframeFixture (template) {
    let html = `
      <html>
        <body>
          ${template}
        </body>
      </html>
    `;

    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // iframe.src = 'about:blank';
    document.body.appendChild(iframe);
    var win = iframe.contentWindow;
    var doc = win.document;
    doc.open();
    doc.writeln(html);
    doc.close();

    var fixturePromise = Promise.resolve();
    var innerPromise = Promise.resolve();

    fixturePromise.inject = (type, url) => {
      if (type === 'js') {
        innerPromise = innerPromise.then(() => {
          return new Promise((resolve, reject) => {
            try {
              var script = document.createElement('script');
              script.src = '.' + url;
              script.addEventListener('load', (evt) => {
                evt.stopImmediatePropagation();
                resolve();
              }, true);
              doc.head.appendChild(script);
            } catch (err) {
              reject(err);
            }
          });
        });
      } else {
        throw new Error('Unimplemented yet!');
      }
      return fixturePromise;
    };

    var evalId = 0;

    fixturePromise.evaluate = fn => {
      innerPromise = innerPromise.then(() => {
        var id = evalId++;
        var script = document.createElement('script');
        script.textContent = `
          var eval${id} = ${fn};
        `;
        doc.head.appendChild(script);

        return win[`eval${id}`]();
      });
      return fixturePromise;
    };

    fixturePromise.end = () => {
      return fixturePromise.then(() => innerPromise.then(retval => {
        iframe.parentElement.removeChild(iframe);
        return retval;
      }));
    };

    return fixturePromise;
  }

  function nightmareFixture (template) {
    let html = `
      <html>
        <body>
          ${template}
        </body>
      </html>
    `;

    return Nightmare()
    .on('console', (type, message) => console.info('>', type, message))
    .goto('about:blank')
    .evaluate(html => {
      document.writeln(html);
    }, html);
  }

  if (typeof window === 'undefined') {
    return nightmareFixture;
  }
  return iframeFixture;
});
