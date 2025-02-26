'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class StudentInfo extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  StudentInfo.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    passport_photo: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
    },
    identification_type: {
      type: DataTypes.STRING,
    },
    nationalId_birthCertificate_passport: {
      type: DataTypes.STRING,
    },
    
    full_name: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    alternate_phone_no: {
      type: DataTypes.STRING,
    },
    email_address: {
      type: DataTypes.STRING,
    },
    postal_address_no: {
      type: DataTypes.STRING,
    },
    postal_town: {
      type: DataTypes.STRING,
    },
    county_of_birth: {
      type: DataTypes.STRING,
    },
    county_of_residence: {
      type: DataTypes.STRING,
    },
    preferred_intake: {
      type: DataTypes.STRING,
    },
    preferred_study_mode: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'StudentInfo',
    tableName: 'StudentInfos',
    schema: 'applicants',
    timestamps: true,
  });

  return StudentInfo;
};
