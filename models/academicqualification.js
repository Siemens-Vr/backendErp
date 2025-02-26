'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AcademicQualification extends Model {
    static associate(models) {
      // Define associations here
      AcademicQualification.belongsTo(models.StudentInfo, {
        foreignKey: 'student_id',
        targetKey: 'uuid',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  AcademicQualification.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    qualification_name: {
      type: DataTypes.STRING,
    },
    award_attained: {
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
    modelName: 'AcademicQualification',
    tableName: 'AcademicQualifications',
    schema: 'applicants',
    timestamps: true,
  });

  return AcademicQualification;
};
