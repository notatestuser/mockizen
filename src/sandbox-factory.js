'use strict';

const path = require('path');
const StoreFactory = require('./store-factory');

module.exports = function createSandbox(filePath, basePath) {
  const newRequire = function require(modPath) {
    let resolved = modPath;
    if (path.parse(modPath).dir !== '') {
      resolved = path.resolve(basePath, modPath);
    }
    return module.require(resolved);
  };
  const sandbox = {
    __dirname: path.parse(filePath).dir,
    require: newRequire,
    module: {
      exports: {},
      require: newRequire,
    },
    console: {
      log: (line) => {
        console.log.apply(console, [
          `(log: ${path.relative(basePath, filePath)}) ${line}`
        ].concat(
          Array.prototype.slice.call(arguments, 1)
        ))
      }
    },
    getSessionStore: () =>
      StoreFactory.getSessionStore(basePath),
    getPersistentStore: () =>
      StoreFactory.getPersistentStore(basePath),
  };
  return sandbox;
};
