'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Week extends Model {
    static associate({ Facilitator, Level, Material }) {
      // Facilitator can have many weeks
      this.belongsTo(Facilitator, {
        foreignKey: 'facilitatorId',
        as: 'facilitator',
      });

      // Level can have many weeks
      this.belongsTo(Level, {
        foreignKey: 'levelId',
        as: 'level',
      });

      // One week can have many materials
      this.hasMany(Material, {
        foreignKey: 'weekId',
        as: 'materials',
      });
    }
  }

  Week.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    uuid: {
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weekname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facilitatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // levelId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    // },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Week',
    schema: 'materials',
  });

  return Week;
};
