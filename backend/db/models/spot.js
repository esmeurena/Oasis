'use strict';
const { Model, Validator} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "cascade"
      }),
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "cascade",
        hooks: true
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "cascade",
        hooks: true
      });

      Spot.belongsTo(models.User, {
        as: "Owner",
        foreignKey: "userId",
        onDelete: "cascade"
      });
    }
  }
  Spot.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,100]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,30]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,30]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,30]
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate:{
        min:-90,
        max:90
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min:-180,
        max:180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,50]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,256]
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate:{
        min:0
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
    modelName: 'Spot'
  });
  return Spot;
};