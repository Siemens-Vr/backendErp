'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SubFolder extends Model {
    static associate({ Project, Folder,Document }) {
      // Define association to Project model
      this.belongsTo(Project, {
        foreignKey: {
          name: 'projectId',
          allowNull: false
        },
        as: 'project',
        onDelete: 'CASCADE'
      });
      this.belongsTo(Folder, {
        foreignKey: {
          name: 'folderId',
          allowNull: false
        },
        as: 'parentFolder',
        onDelete: 'CASCADE'
      });
      this.hasMany(Document, {
        foreignKey: 'subFolderId',
        as: 'documents',
        onDelete: 'CASCADE',
      });

    }
  }

  SubFolder.init(
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
        allowNull: false,
      },
      folderName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
     
      folderId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Folders'
          },
          key: 'uuid'
        }
      },
      subFolderId:{
        type:DataTypes.UUID,
        allowNull:true,
        references: {
          model: {
            schema: 'projects',
            tableName: 'SubFolders'
          },
          key: 'uuid'
        }
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            schema: 'projects',
            tableName: 'Projects'
          },
          key: 'uuid'
        }
      },
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
      modelName: 'SubFolder',
      schema: 'projects',
      tableName: 'SubFolders',
      timestamps: true,
    }
  );

  return SubFolder;
};