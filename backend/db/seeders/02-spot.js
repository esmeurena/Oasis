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
        name: 'Esme\'s Escape',
        description: 'You will never want to leave this beautiful San Diego paradise! Plenty to do and plenty to see!',
        price: 750.45,
      },
      {
        userId: 2,
        address: '1234 Second St',
        city: 'Tampa',
        state: 'Florida',
        country: 'USA',
        lat: 12.44,
        lng: -12.44,
        name: 'Harold\'s Happy House',
        description: 'Very hot in this state, but there are many beautiful views.',
        price: 23.55,
      },
      {
        userId: 3,
        address: '12345 Third St',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 12.54,
        lng: -12.54,
        name: 'Anthony\'s Adventure',
        description: 'It\'s always foggy year-round! Perfect for thrill-seekers!',
        price: 25.65,
      },
      {
        userId: 2,
        address: '12345 Third St',
        city: 'Juneau',
        state: 'Alaska',
        country: 'USA',
        lat: 12.54,
        lng: -12.54,
        name: 'Harold\'s Holiday',
        description: 'Coldest state of America! Beaches are to freeze for!',
        price: 1234.65,
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

