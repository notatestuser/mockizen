'use strict';

const faker = require('faker');

module.exports = function generate() {
  return {
    name: faker.name.findName(),
    email: faker.internet.email()
  };
};
