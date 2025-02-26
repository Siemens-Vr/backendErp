'use strict';
const {Sequelize, DataTypes}  =  require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    await queryInterface.createTable({schema: 'students', tableName: 'Levels'}, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement:true,
      },
      uuid: {
        allowNull: true,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),
      },
      levelName: {
        type: Sequelize.STRING
      },
      startDate:{
        type:Sequelize.DATEONLY,
        allowNull:false
      },
      endDate:{
        type:Sequelize.DATEONLY,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      cohortId: {
        type: DataTypes.UUID,
        references: {
          model: 'Cohorts',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull:false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({schema: 'students', tableName: 'Levels'});
  }
};