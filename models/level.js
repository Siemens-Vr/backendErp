'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Level extends Model {
    static associate({ Cohort, Student, StudentLevels, LevelFacilitators, Facilitator }) {
      // Association to Cohort
      this.belongsTo(Cohort, {
        foreignKey: 'cohortId',
      });

      // Association to Facilitators through LevelFacilitators
      this.belongsToMany(Facilitator, {
        through: LevelFacilitators, // Ensure the model name is correct
        foreignKey: 'levelId',
        otherKey: 'facilitatorId',
        as: 'facilitators',
      });

      // Association to Students through StudentLevels
      this.belongsToMany(Student, {
        through: StudentLevels, // Ensure the model name is correct
        foreignKey: 'levelId',
        otherKey: 'studentId',
        as: 'students',
      });

      // Direct association to StudentLevels for eager loading
      this.hasMany(StudentLevels, {
        foreignKey: 'levelId',
        as: 'studentLevels',
      });
    }
  }

  Level.init({
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    levelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    exam_dates: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    exam_quotation_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cohortId: {
      type: DataTypes.UUID,
      references: {
        model: 'Cohorts',
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Level',
    schema: 'students',
  });

  return Level;
};
