'use strict';

const debug = require('debug')('paloma-router');
const pathToRegexp = require('path-to-regexp');
const validator = require('./validate');
const compose = require('koa-compose');

module.exports = function (route) {
  const method = route.method.toUpperCase();
  const path = route.path;
  const re = pathToRegexp(path);
  const validate = route.validate;

  let controller = Array.isArray(route.controller) ? route.controller : [route.controller];

  controller = controller.map(controllerName => {
    if ('string' === typeof controllerName) {
      return this.controller(controllerName);
    }
    if ('function' === typeof controllerName) {
      return controllerName;
    }
    throw new TypeError('`controller` only support function or name of controller.');
  });

  if (validate) {
    controller.unshift(validator(validate));
  }
  controller = compose(controller);

  return (ctx, next) => {
    ctx.params = {};
    if (!matches(ctx, method)) return next();

    const m = re.exec(ctx.path);
    if (m) {
      const args = m.slice(1).map(decode);
      re.keys.forEach((pathRe, index) => {
        ctx.params[pathRe.name] = args[index];
      });
      debug('%s %s matches %s %j', ctx.method, path, ctx.path, args);
      return controller(ctx, next);
    }

    // miss
    return next();
  };
};

/**
 * Decode value.
 */

function decode(val) {
  if (val) return decodeURIComponent(val);
}

/**
 * Check request method.
 */

function matches(ctx, method) {
  if (!method) return true;
  if (ctx.method === method) return true;
  if (method === 'GET' && ctx.method === 'HEAD') return true;
  return false;
}
