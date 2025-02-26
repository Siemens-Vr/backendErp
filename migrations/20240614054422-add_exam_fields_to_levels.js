'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({ schema: 'students', tableName: 'Levels' }, 'exam_dates', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn({ schema: 'students', tableName: 'Levels' },'exam_quotation_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({ schema: 'students', tableName: 'Levels' }, 'exam_dates');
    await queryInterface.removeColumn({ schema: 'students', tableName: 'Levels' }, 'exam_quotation_number');
  },
};