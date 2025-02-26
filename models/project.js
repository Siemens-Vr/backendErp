'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate({ Assignee, Phase, Document }) {
      this.hasMany(Assignee, {
        foreignKey: 'projectId',
        as: 'assignees',
      });
      this.hasMany(Phase, {
        foreignKey: 'projectId',
        as: 'phases',
      });
      this.hasMany(Document, {
        foreignKey: 'projectId',
        as: 'documents',
      });
    }
  }

  Project.init({
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    funding: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
    modelName: 'Project',
    schema: 'projects',
  });

  return Project;
};
