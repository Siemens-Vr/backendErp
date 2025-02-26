'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Sequelize, DataTypes}  =  require('sequelize')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable({schema: 'equipments', tableName: 'BorrowedComponents'}, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: true,
        type: DataTypes.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      borrowerContact: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      borrowerID: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      departmentName: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      quantity:{
        type: Sequelize.INTEGER,
        allowNull:false


      },
      dateOfIssue: {
        type: Sequelize.DATE,
        allowNull: false,

      },
      expectedReturnDate: {
        type: Sequelize.DATE,
        allowNull: false,

      },
      actualReturnDate: {
        type: Sequelize.DATE,
        allowNull: true,

      },
      purpose: {
        type: Sequelize.TEXT,
        allowNull: false,

      },
      reasonForBorrowing: {
        type: Sequelize.TEXT,
        allowNull: false,

      },
      componentUUID: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'Components', // Name of the table
          key: 'uuid'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
  await queryInterface.dropTable({schema: 'equipments', tableName: 'BorrowedComponents'});
  }
};