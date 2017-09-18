'use strict';

// require is relative from the dir containing scenarios.json
const fakeData = require('./_common/fake-data');

const MAX_USERS = 20;

module.exports = function(req, res) {
  const numberOfUsers = Math.round(Math.random() * MAX_USERS);
  const users = [];
  for (let i = 0; i <= numberOfUsers; i++) {
    const _fakeData = fakeData();
    users.push({
      userId: i,
      name: _fakeData.name,
      email: _fakeData.email,
    });
  }
  res.json(users);
};
