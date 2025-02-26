// models/budgetItem.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BudgetItem extends Model {
    static associate(models) {
      this.belongsTo(models.Phase, { foreignKey: 'phaseId' });
    }
  }
  BudgetItem.init({
    phaseBudgetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estimatedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    actualAmount: DataTypes.DECIMAL(10, 2),
    supplierName: DataTypes.STRING,
    purchaseDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BudgetItem',
    schema: 'projects',
  });
  return BudgetItem;
};