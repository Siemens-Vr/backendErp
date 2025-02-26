'use strict';
const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Procurement extends Model {
    static associate({Project}) {
      this.belongsTo(Project, {
        foreignKey: 'projectId',
  
      });
  
    }
  }

  Procurement.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      uuid: {
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'uuid',
        },
      },
      itemName:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      suppliers: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemDescription: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amountClaimed: {
        type: DataTypes.FLOAT,
        allowNull: true,
        //unique: true, 
        validate: {
          isFloat: true,
        },
      },
      approver: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateTakenToApprover: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateTakenToFinance: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      document:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      documentName:{
        type: DataTypes.STRING, 
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      PvNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      claimNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accounted: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateAccounted: {
        type: DataTypes.DATE,
        allowNull: true,
      },
     
      invoiceDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
   

      paymentDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
  
      approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
  
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Procurement',
      schema: 'projects',
    }
  );

  return Procurement;
};