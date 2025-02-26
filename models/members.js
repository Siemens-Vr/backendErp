// models/member.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
      this.belongsToMany(models.Project, { through: 'ProjectMembers', foreignKey: 'memberId' });
    }
  }
  Member.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: DataTypes.STRING,
    role: DataTypes.STRING,
    department: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Member',
    schema: 'projects',
  });
  return Member;
};
