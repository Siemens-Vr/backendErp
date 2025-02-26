'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LevelFacilitators extends Model {
    static associate({ Level, Facilitator }) {
      // Association with Level
      this.belongsTo(Level, {
        foreignKey: 'levelId',
        as: 'level', // Ensure 'as' matches usage in other places
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      // Association with Facilitator
      this.belongsTo(Facilitator, {
        foreignKey: 'facilitatorId',
        as: 'facilitator',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  LevelFacilitators.init({
    specification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    levelId: {
      type: DataTypes.UUID,
      references: {
        model: 'Levels',  // Correct reference model name
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
    facilitatorId: {
      type: DataTypes.UUID,
      references: {
        model: 'Facilitators', // Correct reference model name
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'LevelFacilitators',
    schema: 'students',
  });

  return LevelFacilitators;
};
