'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate({ Week, Video, Image, File }) {
      // Each material belongs to a specific week
      this.belongsTo(Week, {
        foreignKey: 'weekId',
        as: 'week',
      });

      // Material has many videos, images, and files
      this.hasMany(Video, {
        foreignKey: 'materialId',
        as: 'videos',
      });
      this.hasMany(Image, {
        foreignKey: 'materialId',
        as: 'images',
      });
      this.hasMany(File, {
        foreignKey: 'materialId',
        as: 'files',
      });
    }
  }

  Material.init({
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
    // weekId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    // },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
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
    modelName: 'Material',
    schema: 'materials',
  });

  return Material;
};
