'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      { schema: 'students', tableName: 'Students' },
       'idNo'
      );
  },

  down: async (queryInterface, Sequelize) => {
    // Usually, you would add the column back in the down migration.
    // However, if you drop a primary key column, recreating it exactly as it was can be complex.
    await queryInterface.addColumn(
      { schema: 'students', tableName: 'Students' },
       'idNo', 
       {
      type:Sequelize.INTEGER,
      allowNull:true,
      unique:true
    });
  }
};