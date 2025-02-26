'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentLevels extends Model {
    static associate(models) {
      this.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

        // Association to Levels
        this.belongsTo(models.Level, {
          foreignKey: 'levelId',
          as: 'level',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
    }
  }

  StudentLevels.init({
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    levelId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Levels',
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    cohortId:{
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Cohort',
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',

    },
    fee:{
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    examResults:{
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'StudentLevels',
    schema: 'students',
  });

  return StudentLevels;
};
