const Joi = require('joi');

const staffSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid First name.',
      'string.empty': 'First name cannot be empty.',
      'any.required': 'First name is required.',
    }),

  lastName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Last name.',
      'string.empty': 'Last name cannot be empty.',
      'any.required': 'Last name is required.',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'string.empty':"Email cannot be empty",
      'any.required': 'Email is required.',
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'other')
    .required()
    .messages({
      'string.base': 'Enter a valid Gender.',
      'string.empty':"Gender cannot be empty",
      'any.required': 'Gender is required.',
    }),

  project: Joi.string()
    .optional()
    .messages({
      'string.base': 'Enter a valid Project.',
    }),

  idNo: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'Enter a valid ID number.',
      'number.empty':"ID Number cannot be empty",
      'any.required': 'ID number is required.',
    }),

    phoneNo: Joi.string()
    .pattern(/^(?:\+254|0)?7[0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a 10-digit number.',
      'any.required': 'Phone Number is required.',
    }),

  startDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Start date must be a valid date.',
      'date.empty':"Start date cannot be empty",
      'any.required': 'Start date is required.',
    }),

  leaveDays: Joi.number()
    .integer()
    .allow(null, '')
    .messages({
      'number.base': 'Leave days must be a valid date.',
    }),

});
const validateStaff = (staff) => {
    return staffSchema.validate(staff, { abortEarly: false });
  };

module.exports = validateStaff;
