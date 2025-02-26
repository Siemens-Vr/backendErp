'use strict';
const { Sequelize, DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryInterface.createTable(
      { schema: 'users', tableName: 'Users' },
      {
        uuid: {
          primaryKey: true,
          allowNull: false,
          type: DataTypes.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        idNumber: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        dateJoined: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        isDefaultPassword: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        type: {
          type: Sequelize.ENUM('Staff', 'Admin'),
          allowNull: false,
          defaultValue: 'Staff',
        },
        role: {
          type: Sequelize.ENUM('Admin', 'Project', 'Student', 'Equipment', 'Staff'),
          allowNull: false,
          defaultValue: 'Staff',
        },
        isApproved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        resetPasswordToken: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        resetPasswordExpiresAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('NOW()'),
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ schema: 'users', tableName: 'Users' });
  },
};
