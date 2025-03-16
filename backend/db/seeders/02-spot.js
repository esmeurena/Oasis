'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        userId: 1,
        address: '123 First St',
        city: 'San Diego',
        state: 'California',
        country: 'USA',
        lat: 12.34,
        lng: -12.34,
        name: 'Airbnb 1',
        description: 'Airbnb 1 Description',
        price: 123.45,
      },
      {
        userId: 2,
        address: '1234 Second St',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        lat: 12.44,
        lng: -12.44,
        name: 'Airbnb 2',
        description: 'Airbnb 2 Description',
        price: 123.55,
      },
      {
        userId: 3,
        address: '12345 Third St',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 12.54,
        lng: -12.54,
        name: 'Airbnb 3',
        description: 'Airbnb 3 Description',
        price: 123.65,
      },
      {
        userId: 2,
        address: '12345 Third St',
        city: 'Seattle',
        state: 'Washington',
        country: 'USA',
        lat: 12.54,
        lng: -12.54,
        name: 'Airbnb 4',
        description: 'Airbnb 4 Description',
        price: 123.65,
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = ['Spots', "Owner"];
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // name: { [Op.in]: ['Airbnb Name', 'Airbnb Second Name', 'Airbnb Third Name'] }
    }, {});
  }
};

