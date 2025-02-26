'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable the "uuid-ossp" extension for generating UUIDs
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    
    // Create the 'PaymentDetails' table in the 'applicants' schema
    await queryInterface.createTable(
      { tableName: 'PaymentDetails', schema: 'applicants' },
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
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
        invoice_code: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        mpesa_code: {
          type: Sequelize.STRING,
          allowNull: true,
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
    // Drop the 'PaymentDetails' table from the 'applicants' schema
    await queryInterface.dropTable({ tableName: 'PaymentDetails', schema: 'applicants' });
  }
};
