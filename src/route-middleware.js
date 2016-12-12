const path = require('path');
const fs = require('fs');
const vm = require('vm');

const verbose = process.env.NODE_ENV === 'test';

module.exports = function(filePath, fileType, basePath) {
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
        const newRequire = function(modPath) {
          let resolved = modPath;
          if (path.parse(modPath).dir !== '') {
            resolved = path.resolve(basePath, modPath);
          }
          return module.require(resolved);
        };
        const sandbox = {
          module: {
            exports: {},
            require: newRequire,
          },
          require: newRequire
        };
        vm.runInNewContext(data, sandbox);
        return sandbox.module.exports;
    }
  }

  function updateFile(cb) {
    if (isUpdating) {
      cb && cb();
      return;
    }
    isUpdating = true;
    fs.stat(filePath, function(err, stat) {
      if (err) {
        if (cb) cb(err);
        else throw err; // unhandled
        return;
      }
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
        if (_err) {
          if (cb) cb(_err);
          else throw _err; // unhandled
          return;
        }
        middleware = createMiddleware(data);
        isUpdating = false;
        cb && cb();
      });
    });
  }

  function handleError(res, err) {
    res.status(500).json({
      ok: false,
      error: err.message || err,
      file: filePath,
    });
    return;
  }

  updateFile();  // first cache

  return function(req, res) {
    const that = this;
    const args = arguments;
    updateFile(function(err) {
      if (err) {
        handleError(res, err);
        return;
      }
      try {
        middleware.apply(that, args);
      } catch (_err) {
        handleError(res, _err);
        return;
      }
    });
  };
};
