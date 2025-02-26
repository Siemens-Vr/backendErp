'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Subject extends Model {
    static associate(models) {
      // Define associations here
      Subject.belongsTo(models.KcseGrade, {
        foreignKey: 'student_id',
        targetKey: 'uuid',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  Subject.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
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
    subject_name: {
      type: DataTypes.STRING,
    },
    grade: {
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
    modelName: 'Subject',
    tableName: 'Subjects',
    schema: 'applicants',
    timestamps: true,
  });

  return Subject;
};
