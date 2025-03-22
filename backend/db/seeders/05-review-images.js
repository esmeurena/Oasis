'use strict';

const { ReviewImage } = require('../models');
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'water.com'
      },
      {
        reviewId: 2,
        url: 'water2.com'
      },
      {
        reviewId: 3,
        url: 'water3.com'
      },
      {
        reviewId: 4,
        url: 'water4.com'
      },
      {
        reviewId: 5,
        url: 'water5.com'
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {
   //   review: { [Op.in]: ["Amazing place! Had a wonderful stay.", "Decent stay, but could be cleaner.", "Great experience, will come back again."] }
    }, {});
  }
};