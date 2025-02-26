'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaffDocument extends Model {
    static associate({ Staff, Folder, SubFolder }) {
      this.belongsTo(Staff, {
        foreignKey: 'staffId',
        as: 'staff',
      });
      this.belongsTo(Folder, {
        foreignKey: 'folderId',
        as: 'folder',
      });
      this.belongsTo(SubFolder, {
        foreignKey: 'subFolderId',
        as: 'subFolder',
      });
    }
  }

  StaffDocument.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    staffId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Staff',
        key: 'uuid',
      },
    },
    folderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Folders',
        key: 'uuid',
      },
    },
    subFolderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'SubFolders',
        key: 'uuid',
      },
    },
    documentPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'StaffDocument',
    schema: 'students',
  });

  return StaffDocument;
};