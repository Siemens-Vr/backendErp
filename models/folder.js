'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Folder extends Model {
    static associate({ Project,SubFolder, Document}) {
      this.belongsTo(Project, {
        foreignKey: {
          name: 'projectId',
          allowNull: false
        },
        as: 'project',
        onDelete: 'CASCADE', 
      });
      this.hasMany(SubFolder, {
        foreignKey: 'folderId',
        as: 'subFolders',
        onDelete: 'CASCADE',
      });
      this.hasMany(Document, {
        foreignKey: 'folderId',
        as: 'documents',
        onDelete: 'CASCADE',
      });
    }
  }

  Folder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      folderName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'unique_folder_name_per_project',
          msg: 'Folder name must be unique within the project',
        },
      },
      // description: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Projects'
          },
          key: 'uuid'
        }
      },
      // phaseId: {
      //   type: DataTypes.UUID,
      //   allowNull: true,
      //   references: {
      //     model: {
      //       schema: 'projects',
      //       tableName: 'Phases'
      //     },
      //     key: 'uuid'
      //   }
      // },
      
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Folder',
      schema: 'projects',
      tableName: 'Folders',
      timestamps: true,
    }
  );

  return Folder;
};