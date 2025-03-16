'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/21040976/pexels-photo-21040976/free-photo-of-wooden-hut-on-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        preview: true
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/463734/pexels-photo-463734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        preview: true
      },
      {
        spotId: 3,
        url: "https://images.pexels.com/photos/2180425/pexels-photo-2180425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        preview: true
      },
      {
        spotId: 4,
        url: "https://images.pexels.com/photos/179845/pexels-photo-179845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        preview: true
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // name: { [Op.in]: ['Airbnb Name', 'Airbnb Second Name', 'Airbnb Third Name'] }
    }, {});
  }
};