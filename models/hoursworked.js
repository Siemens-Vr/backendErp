'use strict';
const {
  Model,
  Sequelize // Import Sequelize to use its data types
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HoursWorked extends Model {
    static associate(models) {
      // Define association with Facilitators model
      this.belongsTo(models.Facilitator, {
        foreignKey: 'facilitatorUUID', // Assuming 'facilitatorUUID' is the foreign key in HoursWorked
        targetKey: 'uuid', // Assuming 'uuid' is the primary key in Facilitators
      });
    }
  }

  HoursWorked.init({
    day: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    facilitatorUUID: {
      type: DataTypes.UUID,
      references: {
        model: 'Facilitators',
        key: 'uuid'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull:false
    },
    levelUUID: {
      type: DataTypes.UUID,
      references: {
        model: 'Levels',
        key: 'uuid'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'HoursWorked',
    schema: 'students',
  });

  return HoursWorked;
};
