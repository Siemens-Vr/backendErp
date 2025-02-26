// Migration file: YYYYMMDD_create_travel_requests.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable({schema: 'projects',  tableName:'Report', }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
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
      document: {
        type: Sequelize.STRING, // Path or URL to the document
        allowNull: true,
      },
      documentName:{
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
    await queryInterface.dropTable({schema: 'projects' , tableName:'Report'});
  },
};
