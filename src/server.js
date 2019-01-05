'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const _app = express();

_app.use(logger('dev'));
_app.use(bodyParser.json());

module.exports = function(scenariosPath, app = _app, handle404 = true) {
  const scenarios = require(scenariosPath);

  // route mapper: turns scenarios into routes
  app.map = require('./route-parser');

  console.info('[mockizen] Adding routes');

  // apply `headers`
  app.use(function(req, res, next) {
    if (scenarios.headers && typeof scenarios.headers === 'object') {
      res.set(scenarios.headers);
    }
    next();
  });

  // add scenario routes
  const basePath = path.resolve(scenariosPath, '..') + path.sep;
  app.map(app, basePath, scenarios.routes);

  if (handle404) {
    // catch 404s
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // handle errors
    app.use(function(err, req, res) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.json({ Error: err.message });
    });
  }

  return app;
};
