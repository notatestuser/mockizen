const path = require('path');

const verbose = process.env.NODE_ENV != 'test';

function makePath(base, p) {
  return path.resolve(base, p);
}

module.exports = function mapper(app, basePath, a, route) {
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        mapper(app, basePath, a[key], route + key);
        break;
      // get: 204
      case 'number':
        const statusCode = a[key];
        app[key](route, function (req, res) {
          res.sendStatus(statusCode);
        });
        break;
      // get: "./mocks/file.json"
      case 'string':
        if (verbose) console.log('%s %s', key, route);
        if (a[key].match(/\.json$/)) {
          const json = require(makePath(basePath, a[key]));
          app[key](route, function (req, res) {
            res.json(json);
          });
        } else if (a[key].match(/\.js$/)) {
          app[key](route, require(makePath(basePath, a[key])));
        } else {
          throw new Error('Unsupported file extension :(');
        }
        break;
      // todo: handle other cases
      default:
        throw new Error('Unknown value type ' + typeof a[key]);
    }
  }
};
