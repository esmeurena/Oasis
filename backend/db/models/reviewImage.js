  'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReviewImage.belongsTo(models.Review,{
        foreignKey: "reviewId",
        onDelete: "cascade"
      })
    }
  }
  ReviewImage.init({
      reviewId:{ 
        type: DataTypes.INTEGER,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt:{
      type: DataTypes.DATE
    },
    updatedAt:{
      type: DataTypes.DATE
    }
    }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};