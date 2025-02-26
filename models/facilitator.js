'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Facilitator extends Model {
    static associate({ LevelFacilitators, Level }) {
      // Association to Levels through LevelFacilitators
      this.belongsToMany(Level, {
        through: LevelFacilitators, // Ensure the correct join model is used
        foreignKey: 'facilitatorId',
        otherKey: 'levelId',
        as: 'levels',
      });

      // Direct association with LevelFacilitators (for eager loading, if needed)
      this.hasMany(LevelFacilitators, {
        foreignKey: 'facilitatorId',
        as: 'levelFacilitators',
      });
    }
  }

  Facilitator.init({
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      gender:{
        type: DataTypes.STRING,
        allowNull: false},
      idNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      phoneNo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    
  }, {
    sequelize,
    modelName: 'Facilitator',
    schema: 'students',
  });

  return Facilitator;
};
