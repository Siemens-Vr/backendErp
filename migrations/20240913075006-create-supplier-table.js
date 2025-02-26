'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({schema: 'projects', tableName:  'Suppliers' }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      suppliers: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amountClaimed: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      approver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateTakenToApprover: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateTakenToFinance: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PvNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      claimNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accounted: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateAccounted: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({schema: 'projects', tableName:  'Suppliers' });
  }
};