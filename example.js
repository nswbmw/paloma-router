'use strict';

const Paloma = require('paloma');
const app = new Paloma();

app.controller('indexCtrl', function (ctx, next) {
  ctx.body = 'This is index page';
});

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

app.listen(3000);
