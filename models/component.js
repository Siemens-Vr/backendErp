'use strict';
const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Component extends Model {
    static associate(models) {
      Component.hasMany(models.BorrowedComponent, {
        foreignKey: 'componentUUID',
        sourceKey: 'uuid'
      });
      Component.hasMany(models.ComponentsQuantity, {
        foreignKey: 'componentUUID',
        sourceKey: 'uuid',
        as: 'ComponentsQuantities'
      });
    }
  }
  Component.init({
    uuid: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    componentName: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true
    },
    componentType: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true
    },
    modelNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
  
    partNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remainingQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrowedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    condition: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    conditionDetails: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'Component',
    schema: 'equipments',

  });

  return Component;
};
