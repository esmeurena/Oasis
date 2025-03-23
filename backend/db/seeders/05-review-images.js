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
        url: 'https://images.pexels.com/photos/31238719/pexels-photo-31238719/free-photo-of-modern-minimalist-bedroom-interior-design.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        reviewId: 2,
        url: 'https://images.pexels.com/photos/31267709/pexels-photo-31267709/free-photo-of-modern-kitchen-interior-with-dark-cabinets.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        reviewId: 3,
        url: 'https://images.pexels.com/photos/31238718/pexels-photo-31238718/free-photo-of-modern-bathroom-with-double-sinks-and-shower.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        reviewId: 4,
        url: 'https://images.pexels.com/photos/31234945/pexels-photo-31234945/free-photo-of-modern-open-concept-living-and-dining-room.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        reviewId: 5,
        url: 'https://images.pexels.com/photos/31236100/pexels-photo-31236100/free-photo-of-cozy-indoor-setting-with-monstera-plant-and-lamp.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
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