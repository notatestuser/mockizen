'use strict';

const path = require('path');
const StoreFactory = require('./store-factory');

const GLOBALS_WHITELIST = {
  'encodeURI': true,
  'Date': true,
  'parseFloat': true,
  'Set': true,
  'Proxy': true,
  'Array': true,
  'Function': true,
  'Boolean': true,
  'unescape': true,
  'encodeURIComponent': true,
  'Symbol': true,
  'decodeURIComponent': true,
  'Promise': true,
  'isFinite': true,
  'decodeURI': true,
  'Error': true,
  'String': true,
  'Number': true,
  'isNaN': true,
  'RegExp': true,
  'Map': true,
  'parseInt': true,
  'Object': true,
  'escape': true,
  'Buffer': true,
  'clearImmediate': true,
  'clearInterval': true,
  'clearTimeout': true,
  'setImmediate': true,
  'setInterval': true,
  'setTimeout': true
};

module.exports = function createSandbox(filePath, basePath) {
  const newRequire = function require(modPath) {
    let resolved = modPath;
    if (path.parse(modPath).dir !== '') {
      resolved = path.resolve(basePath, modPath);
    }
    return module.require(resolved);
  };
  const base = Object
    .getOwnPropertyNames(global)
    .filter(name => GLOBALS_WHITELIST[name])
    .reduce((sbx, name) => {
      sbx[name] = global[name];
      return sbx;
    }, {});
  const sandbox = Object.assign(base, {
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
        ])
      }
    },
    getSessionStore: () =>
      StoreFactory.getSessionStore(basePath),
    getPersistentStore: () =>
      StoreFactory.getPersistentStore(basePath),
  });
  return sandbox;
};
