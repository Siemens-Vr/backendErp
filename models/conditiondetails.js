'use strict';
const { Sequelize, Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConditionDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ConditionDetails.belongsTo(models.Component, {
        foreignKey: 'componentId',
        targetKey: 'uuid',
        as: 'component'
      });
    }
  }
  ConditionDetails.init({
    uuid: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      require: true
    },
   
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      require: true
    },
    componentId: {
      type: DataTypes.UUID,
      references: {
        model: 'Components',
        key: 'uuid'
      },
      allowNull: false
    },
   
  }, {
    sequelize,
    modelName: 'ConditionDetails',
    schema: 'equipments',
  });
  return ConditionDetails;
};