'use strict';

const path = require('path');
const dirty = require('dirty');

const sessionStores = new Map();  // Map => { Str => Map }
const persistentStores = new Map();  // Map => { Str => PersistentStore }

const verbose = process.env.NODE_ENV === 'test';

class PersistentStore {
  static makeStorePath(basePath) {
    return path.resolve(basePath, './store.db');
  }

  constructor(storeFile) {
    this.store = dirty(storeFile);
    if (verbose) {
      console.info('created a new PersistentStore: %s', storeFile);
    }
  }

  has(key) {
    return typeof this.store.get(key) !== 'undefined';
  }

  get(key) {
    return this.store.get(key);
  }

  set(key, val, cb) {
    return this.store.set(key, val, cb);
  }

  update(key, updater, cb) {
    return this.store.update(key, updater, cb);
  }
}

class SessionStore extends Map {
  constructor() {
    super();
    if (verbose) {
      console.info('created a new SessionStore');
    }
  }

  has(key) {
    return super.has(key);
  }

  get(key) {
    return super.get(key);
  }

  set(key, val, cb) {
    const retval = super.set(key, val);
    cb && cb();
    return retval;
  }

  update(key, updater, cb) {
    return super.set(key, updater(super.get(key)), cb);
  }
}

class StoreFactory {
  static getSessionStore(basePath) {
    if (sessionStores.has(basePath)) {
      return sessionStores.get(basePath);
    }
    const newStore = new SessionStore();
    sessionStores.set(basePath, newStore);
    return newStore;
  }

  static getPersistentStore(basePath) {
    const storeFile = PersistentStore.makeStorePath(basePath);
    if (persistentStores.has(storeFile)) {
      return persistentStores.get(storeFile);
    }
    const newStore = new PersistentStore(storeFile);
    persistentStores.set(storeFile, newStore);
    return newStore;
  }
}

module.exports = StoreFactory;
