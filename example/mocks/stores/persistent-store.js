/* global getPersistentStore: true */

'use strict';

const store = getPersistentStore();

module.exports = function(req, res) {
  if (! store.has('store-test')) {
    const randomNum = Number.parseInt(Math.random() * 100, 10);
    store.set('store-test', randomNum);
  }
  res.json({
    number: store.get('store-test'),
    info: 'This number always remains the same. It is stored on disk.',
  });
};
