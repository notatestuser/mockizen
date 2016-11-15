'use strict';

module.exports = function(req, res) {
  res.json({
    userId: req.params.id,
    name: 'Joe Bloggs',
    email: 'joe@gmail.com'
  });
};
