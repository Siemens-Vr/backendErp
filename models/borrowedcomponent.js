'use strict';
const {
  Model
} = require('sequelize');
const {Sequelize, DataTypes}  =  require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class BorrowedComponent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      BorrowedComponent.belongsTo(models.Component, {
        foreignKey: 'componentUUID',
        targetKey: 'uuid',
        as: 'component'
      });
    
    }
  }
  BorrowedComponent.init({
    uuid: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue:Sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    fullName:{
      type:DataTypes.STRING,
      allowNull:false
    },
    borrowerContact: 
    {
      type:DataTypes.STRING,
      allowNull:false,

    },
    borrowerID: 
    {
      type:DataTypes.STRING,
      allowNull:false,

    },
    departmentName: 
    {
      type:DataTypes.STRING,
      allowNull:false,

    },
   
    componentUUID: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: 'Components', // Name of the table
        key: 'uuid'
      }
    },
    quantity:{
      type: Sequelize.INTEGER,
      allowNull:false


    },
    dateOfIssue: 
    {
      type:DataTypes.DATE,
      allowNull:false,

    },

    expectedReturnDate: 
    {
      type:DataTypes.DATE,
      allowNull:false,

    },
    actualReturnDate:
    {
      type:DataTypes.DATE,
      allowNull:true,

    },
    purpose: 
    {
      type:DataTypes.TEXT,
      allowNull:false,

    },
    reasonForBorrowing: 
    {
      type:DataTypes.TEXT,
      allowNull:false,

    },
  }, {
    sequelize,
    modelName: 'BorrowedComponent',
    schema: 'equipments',
  });
  return BorrowedComponent;
};