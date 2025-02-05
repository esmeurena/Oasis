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
    //   {
    //     startDate: '2025-2-1',
    //     endDate: '2025-2-5'
    //   },
    //   {
    //     startDate: "2025-10-12",
    //     endDate: "2026-10-12"
    //   },
    //   {
    //     startDate: 2003-10-12,
    //     endDate: 2004-1-5
    //   },
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

