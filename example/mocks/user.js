'use strict';

console.log('console.log works!', { data: 'data' });

module.exports = function(req, res) {
  res.json({
    userId: req.params.id,
    name: 'Joe Bloggs',
    email: 'joe@gmail.com'
  });
};
