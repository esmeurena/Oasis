'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId:1,
        userId:2,
        startDate: "2025-11-01",
        endDate: "2025-11-10"
      },
      {
        spotId:2,
        userId:2,
        startDate: "2026-10-12",
        endDate: "2026-10-14"
      },
      {
        spotId: 1,
        userId:1,
        startDate: "2025-10-10",
        endDate: "2025-10-12"
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // name: { [Op.in]: ['Airbnb Name', 'Airbnb Second Name', 'Airbnb Third Name'] }
    }, {});
  }
};

