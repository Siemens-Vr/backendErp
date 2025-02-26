'use strict';
const { Sequelize, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with Facilitators model
      this.belongsTo(models.Staff, {
        foreignKey: 'staffUUID', // Assuming 'facilitatorUUID' is the foreign key in HoursWorked
        targetKey: 'uuid', 
        as:'leaves'// Assuming 'uuid' is the primary key in Facilitators
      });
    }
  }
  Leave.init({
    days:{ 
      type: DataTypes.DATE,
      allowNull:true
    },
    staffUUID:{
      type:Sequelize.UUID,
      allowNull:false,
      defaultValue:Sequelize.literal('uuid_generate_v4()'),
    }
  }, {
    sequelize,
    modelName: 'Leave',
    schema: 'students',
  });
  return Leave;
};
