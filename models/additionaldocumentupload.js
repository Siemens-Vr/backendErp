'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AdditionalDocumentUpload extends Model {
    static associate(models) {
      // Define associations here
      AdditionalDocumentUpload.belongsTo(models.StudentInfo, {
        foreignKey: 'student_id',
        targetKey: 'uuid',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  AdditionalDocumentUpload.init({
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
    document_name: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.BLOB,
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
    modelName: 'AdditionalDocumentUpload',
    tableName: 'AdditionalDocumentUploads',
    schema: 'applicants',
    timestamps: true,
  });

  return AdditionalDocumentUpload;
};
