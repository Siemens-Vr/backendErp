const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Report extends Model {
    static associate({Project}) {
      this.belongsTo(Project, {
        foreignKey: 'projectId',
        as: 'project',
      });
  
    }

  }

  Report.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'uuid',
        },
      },
      document: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      documentName:{
        type: DataTypes.STRING, 
        allowNull: true,
      },

    },
    {
      sequelize,
      schema: 'projects',
      tableName: 'Report',
      modelName: 'Report',
      timestamps: true,
    }
  );

  return Report;
};
