'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable({schema: 'projects', tableName:  'Procurements' }, {
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
      projectId: {
        type: Sequelize.UUID,
        references: {
          model: 'Projects',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      itemName:{
        type: Sequelize.STRING,
        allowNull: false,
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
        allowNull: true,
      },
      dateTakenToApprover: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateTakenToFinance: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      document:{
        type: Sequelize.STRING, 
        allowNull: true,
      },
      documentName:{
        type: Sequelize.STRING, 
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
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
      paymentDate:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      approvalDate:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      invoiceDate:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
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
    await queryInterface.dropTable({schema: 'projects', tableName:  'Procurements' });
  }
};