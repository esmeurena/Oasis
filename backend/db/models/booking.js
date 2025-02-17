'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE"
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE"
      });
    }
  }
  Booking.init({
    spotId:{
    type: DataTypes.INTEGER,
    allowNull:false
    },
    userId:{ 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isDate:true,
      }
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isDate:true,
      }
    },
    createdAt:{
      type: DataTypes.DATE
    },
    updatedAt:{
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Booking'
  });
  return Booking;
};