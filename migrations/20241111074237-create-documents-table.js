'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({ schema: 'projects', tableName: 'Documents' }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
      folderId: {
        type: Sequelize.UUID,
        references: {
          model: 'Folders',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subFolderId: {
        type: Sequelize.UUID,
        references: {
          model: 'SubFolders',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      documentPath: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documentName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'projects', tableName: 'Documents' });
  }
};
