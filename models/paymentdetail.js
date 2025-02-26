'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PaymentDetail extends Model {
    static associate(models) {
      // Define associations here
      PaymentDetail.belongsTo(models.StudentInfo, {
        foreignKey: 'student_id',
        targetKey: 'uuid',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  PaymentDetail.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    invoice_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mpesa_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'PaymentDetail',
    tableName: 'PaymentDetails',
    schema: 'applicants',
    timestamps: true,
  });

  return PaymentDetail;
};
