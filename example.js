'use strict';

const Paloma = require('paloma');
const app = new Paloma();

app.controller('indexCtrl', function (ctx, next) {
  ctx.body = 'This is index page';
});

// or:
// app.controller('indexCtrl', async function (ctx, next) {
//   ctx.body = await Promise.resolve('This is index page2');
// });
app.controller('404Ctrl', function (ctx, next) {
  ctx.body = 'Not Found: ' + ctx.path;
});

app.route({
  method: 'GET',
  path: '/',
  controller: 'indexCtrl'
});

app.route({
  method: 'GET',
  path: '/(.+)',
  controller: '404Ctrl'
});

app.listen(3000, () => {
  console.log('listening on 3000');
});
