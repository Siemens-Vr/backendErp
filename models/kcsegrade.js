'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class KcseGrade extends Model {
    static associate(models) {
      // Define associations here
      KcseGrade.belongsTo(models.StudentInfo, {
        foreignKey: 'student_id',
        targetKey: 'uuid',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  KcseGrade.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    kcse_index: {
      type: DataTypes.STRING,
    },
    kcse_year: {
      type: DataTypes.STRING,
    },
    preferred_campus: {
      type: DataTypes.STRING,
    },
    kcse_mean_grade: {
      type: DataTypes.STRING,
    },
    kcse_certificate:{
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'KcseGrade',
    tableName: 'KcseGrades',
    schema: 'applicants',
    timestamps: true,
  });

  return KcseGrade;
};
