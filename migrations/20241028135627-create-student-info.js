'use strict';
const passport = require('passport');
const {Sequelize, DataTypes} = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable({ tableName: 'StudentInfos', schema: 'applicants' }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
      },
      passport_photo:{
        type: Sequelize.STRING
      },
      nationality: {
        type: Sequelize.STRING,
      },
      identification_type: {
        type: Sequelize.STRING,
      },
  
      nationalId_birthCertificate_passport: {
        type: Sequelize.STRING,
      },
      full_name: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING,
      },
      alternate_phone_no: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
      },
      postal_address_no: {
        type: Sequelize.STRING
      },
      postal_town: {
        type: Sequelize.STRING
      },
      county_of_birth: {
        type: Sequelize.STRING
      },
      county_of_residence: {
        type: Sequelize.STRING
      },
      preferred_intake: {
        type: Sequelize.STRING,
      },
      preferred_study_mode: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable({ tableName: 'StudentInfos', schema: 'applicants' });
  }
};