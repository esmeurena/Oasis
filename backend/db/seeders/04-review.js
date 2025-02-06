'use strict';

console.log("Seeding Reviews...");

const { Review } = require('../models');
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "Amazing place! Had a wonderful stay.",
        stars: 5
      },
      {
        spotId: 2,
        userId: 3,
        review: "Decent stay, but could be cleaner.",
        stars: 3
      },
      {
        spotId: 3,
        userId: 1,
        review: "Great experience, will come back again.",
        stars: 4
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkDelete(options, {
   //   review: { [Op.in]: ["Amazing place! Had a wonderful stay.", "Decent stay, but could be cleaner.", "Great experience, will come back again."] }
    }, {});
  }
};