'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn({ schema: 'students', tableName: 'StudentLevels' }, 'cohortId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Cohorts', 
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn({ schema: 'students', tableName: 'StudentLevels' }, 'fee', {
      type: Sequelize.FLOAT,
      allowNull: true, // You can set this to false if it's a required field
    });

    await queryInterface.addColumn({ schema: 'students', tableName: 'StudentLevels' }, 'examResults', {
      type: Sequelize.STRING, // You can use JSONB to store exam results flexibly
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('StudentLevels', 'cohortUuid');
    await queryInterface.removeColumn('StudentLevels', 'feePayment');
    await queryInterface.removeColumn('StudentLevels', 'examResults');
  }
};
