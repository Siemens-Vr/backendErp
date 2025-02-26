'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        schema: 'projects',
        tableName: 'SubFolders',
      },
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: false,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        folderName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
    
        folderId: {
          type: Sequelize.UUID,
          allowNull:true,
          references: {
            model: 'Folders',
            key: 'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        subFolderId:{
          type:Sequelize.UUID,
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
          type: Sequelize.UUID,
          references: {
            model: 'Projects',
            key: 'uuid'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable({
      schema: 'projects',
      tableName: 'SubFolders',
    });
  },
};
