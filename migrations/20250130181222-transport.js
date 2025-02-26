// Migration file: YYYYMMDD_create_travel_requests.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable({schema: 'projects',  tableName:'Transport', }, {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
        unique:true,
        allowNull:false
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
      destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      travelPeriod: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      travelers: {
        type: Sequelize.JSONB, // Array of travelers
        allowNull: true,
      },
   
      dateOfRequest: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateReceived: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approver: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approvalDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },    
      document: {
        type: Sequelize.STRING, // Path or URL to the document
        allowNull: true,
      },
      documentName:{
        type: Sequelize.STRING, 
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING, // Travel type (e.g., business, personal)
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
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      allowance: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      beneficiary: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable({schema: 'projects' , tableName:'Transport'});
  },
};
