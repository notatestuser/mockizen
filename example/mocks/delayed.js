'use strict';

const DELAY_MS = 1000;

module.exports = function(req, res) {
  const start = new Date().getTime();
  setTimeout(() => {
    const end = new Date().getTime();
    res.json({ delayMs: end - start });
  }, DELAY_MS);
};
