'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Items.init({
    suppliers: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amountClaimed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    claimAnt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateClaimed: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pvNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Items',
    schema: 'equipments',
  });
  return Items;
};
