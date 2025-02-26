'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable the "uuid-ossp" extension for generating UUIDs
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    
    // Create the 'Subjects' table in the 'applicants' schema
    await queryInterface.createTable(
      { tableName: 'Subjects', schema: 'applicants' },
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          unique: true,
        },
        student_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'StudentInfos',
              schema: 'applicants',
            },
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        subject_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        grade: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
  
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Drop the 'Subjects' table from the 'applicants' schema
    await queryInterface.dropTable({ tableName: 'Subjects', schema: 'applicants' });
  }
};
