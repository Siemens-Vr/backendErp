'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ComponentsQuantity extends Model {
    static associate(models) {
      // Define association here
      ComponentsQuantity.belongsTo(models.Component, {
        foreignKey: 'componentUUID',
        targetKey: 'uuid',
        as: 'Component'
      });
    }
  }
  ComponentsQuantity.init({
    uuid: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    componentUUID: {
      type: DataTypes.UUID,
      references: {
        model: 'Components',
        key: 'uuid'
      },
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'ComponentsQuantity',
    schema: 'equipments',
  });
  return ComponentsQuantity;
};
