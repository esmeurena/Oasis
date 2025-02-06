'use strict';
console.log(1);

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");
console.log(2);
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;   define your schema in options object
}
console.log(3);
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        startDate: "MM-DD-YYYY",
        endDate: "MM-DD-YYYY"
      },
      {
        spotId:1,
        startDate: "2025-10-12",
        endDate: "2026-10-12"
      },
      {
        spotId: 2,
        startDate: "2025-10-12",
        endDate: "2026-10-12"
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Airbnb Name', 'Airbnb Second Name', 'Airbnb Third Name'] }
    }, {});
  }
};