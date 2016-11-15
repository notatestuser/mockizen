'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

// route mapper: turns config.json into routes
app.map = require('./route-parser');

module.exports = function(scenarios, scenariosPath) {
  console.info('Building routes');

  // apply `headers`
  app.use(function(req, res, next) {
    if (scenarios.headers && typeof scenarios.headers === 'object') {
      res.set(scenarios.headers);
    }
    next();
  });

  // add scenario `routes`
  app.map(app, path.resolve(scenariosPath, '..'), scenarios.routes);

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

  return app;
};
