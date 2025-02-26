'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize, DataTypes) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    await queryInterface.createTable({schema: 'students', tableName: 'Staffs'}, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid:{
        type:Sequelize.UUID,
        allowNull:false,
        unique:true,
        defaultValue:Sequelize.literal('uuid_generate_v4()'),

      },
      firstName: {
        type:Sequelize.STRING,
        allowNull:false,
      },
      lastName: {
        type:Sequelize.STRING,
        allowNull:false,
      },
      gender:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      role:{

        type:Sequelize.STRING,
        allowNull:true,

      },
      idNo:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true,
      },
      phone:{
        type:Sequelize.INTEGER,
        allowNull:true,
      },
      startDate:{
        type:Sequelize.DATE,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({schema: 'students', tableName: 'Staffs'});
  }
};