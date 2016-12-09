const path = require('path');
const createMiddleware = require('./route-middleware');

const verbose = process.env.NODE_ENV === 'test';

function makePath(base, p) {
  return path.resolve(base, p);
}

module.exports = function mapper(app, basePath, cfg, route) {
  route = route || '';
  for (var key in cfg) {
    switch (typeof cfg[key]) {
      // recurse; { '/path': { ... } }
      case 'object':
        mapper(app, basePath, cfg[key], route + key);
        break;
      // get: 204
      case 'number':
        const statusCode = cfg[key];
        app[key](route, function (req, res) {
          res.sendStatus(statusCode);
        });
        break;
      // get: "./mocks/file.json"
      case 'string':
        if (verbose) console.log('%s %s', key, route);
        const filePath = makePath(basePath, cfg[key]);
        let fileType;
        if (cfg[key].match(/\.json$/)) {
          fileType = 'json';
        } else if (cfg[key].match(/\.js$/)) {
          fileType = 'js';
        } else {
          throw new Error('Unsupported file extension :(');
        }
        const middleware = createMiddleware(filePath, fileType);
        app[key](route, middleware);
        break;
      // todo: handle other cases
      default:
        throw new Error('Unknown value type ' + typeof cfg[key]);
    }
  }
};
