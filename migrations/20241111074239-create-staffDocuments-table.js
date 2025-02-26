'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable({ schema: 'students', tableName: 'StaffDocuments' }, {
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
      staffId: {
        type: Sequelize.UUID,
        references: {
          model: 'Staffs',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      FolderId: {
        type: Sequelize.UUID,
        references: {
          schema: 'projects', // Ensure this schema exists
          model: {
            schema: 'projects', // Explicitly specify schema for the table
            tableName: 'Folders',
          },
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subFolderId: {
        type: Sequelize.UUID,
        references: {
          schema: 'projects', // Ensure this schema exists
          model: {
            schema: 'projects', // Explicitly specify schema for the table
            tableName: 'SubFolders',
          },
          key: 'uuid',
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
    await queryInterface.dropTable({ schema: 'students', tableName: 'StaffDocuments' });
  }
};
