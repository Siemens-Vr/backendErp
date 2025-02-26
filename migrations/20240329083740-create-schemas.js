'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS students');
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS projects');
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS equipments');
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS applicants');
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS users');
    await queryInterface.sequelize.query('CREATE SCHEMA IF NOT EXISTS materials');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS students');
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS projects');
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS equipments');
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS applicants');
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS users');
    await queryInterface.sequelize.query('DROP SCHEMA IF EXISTS materials');
  }
};
