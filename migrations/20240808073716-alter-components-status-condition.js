'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn({ schema: 'equipments', tableName: 'Components' },'status', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.changeColumn({ schema: 'equipments', tableName: 'Components' }, 'condition', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn({ schema: 'equipments', tableName: 'Components' }, 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });

    await queryInterface.changeColumn({ schema: 'equipments', tableName: 'Components' }, 'condition', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  }
};
