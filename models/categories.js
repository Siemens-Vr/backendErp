'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Categories.init({
    category: {
      type: DataTypes.STRING
    },
    uuid: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue:Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'Categories',
    schema: 'equipments',
  });
  return Categories;
};