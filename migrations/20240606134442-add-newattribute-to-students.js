'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      { schema: 'students', tableName: 'Students' }, 
      'gender',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      { schema: 'students', tableName: 'Students' }, 
      'gender'
    );
  }
};
