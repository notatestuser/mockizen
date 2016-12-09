const fs = require('fs');
const vm = require('vm');

const verbose = process.env.NODE_ENV === 'test';

module.exports = function(filePath, fileType) {
  let lastMTime = null;
  let isUpdating = null;
  let middleware = null;

  function createMiddleware(data) {
    switch(fileType) {
      case 'json':
        return function(req, res) {
          res.json(JSON.parse(data));
        };
      case 'js':
        const sandbox = { module: {}, require };
        vm.runInNewContext(data, sandbox);
        return sandbox.module.exports;
    }
  }

  function updateFile(cb) {
    if (isUpdating) return;
    isUpdating = true;
    fs.stat(filePath, function(err, stat) {
      if (err) throw err;
      if (lastMTime && stat.mtime.getTime() === lastMTime.getTime()) {
        if (verbose) console.log('no update needed: %s',
            filePath, fileType);
        isUpdating = false;
        cb && cb();
        return;
      }
      if (verbose) console.log('updating file: %s (%s) (%s, %s)', filePath, fileType,
          stat.mtime.getTime(), lastMTime && lastMTime.getTime());
      lastMTime = stat.mtime;
      fs.readFile(filePath, 'utf8', function(_err, data) {
        if (_err) throw _err;
        middleware = createMiddleware(data);
        isUpdating = false;
        cb && cb();
      });
    });
  }

  updateFile();  // first cache

  return function(/* req, res, ... */) {
    const that = this;
    const args = arguments;
    updateFile(function() {
      middleware.apply(that, args);
    });
  };
};
