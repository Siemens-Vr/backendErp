'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the UUID extension (only for PostgreSQL)
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Add the UUID column to studentLevels table
    return queryInterface.addColumn({ schema: 'students', tableName: 'StudentLevels' }, 'uuid', {
      allowNull: true, // Set to true, you can change this based on your use case
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'), // Generate UUID automatically
      primaryKey: true, // Set UUID as primary key
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the UUID column during rollback
    return queryInterface.removeColumn({ schema: 'students', tableName: 'StudentLevels' }, 'uuid');
  }
};
