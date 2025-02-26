'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update 'amountClaimed' column
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" }, 
      "amountClaimed",
      {
        type: Sequelize.FLOAT,
        allowNull: true,
     
      }
    );

    // Update 'approver' column
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "approver",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    // Update 'dateTakenToApprover' column
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "dateTakenToApprover",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

    // Update 'dateTakenToFinance' column
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "dateTakenToFinance",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

    // Update 'type' column
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "type",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert 'amountClaimed' column to allowNull: false
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "amountClaimed",
      {
        type: Sequelize.FLOAT,
        allowNull: false,
    
      }
    );

    // Revert 'approver' column to allowNull: false
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "approver",
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );

    // Revert 'dateTakenToApprover' column to allowNull: false
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "dateTakenToApprover",
      {
        type: Sequelize.DATE,
        allowNull: false,
      }
    );

    // Revert 'dateTakenToFinance' column to allowNull: false
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "dateTakenToFinance",
      {
        type: Sequelize.DATE,
        allowNull: false,
      }
    );

    // Revert 'type' column to allowNull: false
    await queryInterface.changeColumn(
      { schema: "projects", tableName: "Suppliers" },
      "type",
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    );
  },
};
