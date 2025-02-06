'use strict';
console.log(1);
const { Booking } = require('../models');
const bcrypt = require("bcryptjs");
console.log(2);
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
console.log(3);
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId:1,
        userId:2,
        startDate: "11-0-YYYY",
        endDate: "11-15-2025"
      },
      {
        spotId:2,
        userId:2,
        startDate: "10-12-2026",
        endDate: "12-10-2026"
      },
      {
        spotId: 1,
        userId:1,
        startDate: "10-10-2025",
        endDate: "11-07-2025"
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

