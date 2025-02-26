'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({ schema: 'students', tableName: 'Staffs' }, 'leaveDays', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

 
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({ schema: 'students', tableName: 'Staffs' },  'leaveDays');
  },
};