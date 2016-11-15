'use strict';

const faker = require('faker');

const MAX_USERS = 20;

module.exports = function(req, res) {
  const numberOfUsers = Math.round(Math.random() * MAX_USERS);
  const users = [];
  for (let i = 0; i <= numberOfUsers; i++) {
    users.push({
      userId: i,
      name: faker.name.findName(),
      email: faker.internet.email()
    })
  }
  res.json(users);
};
