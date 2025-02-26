const Joi = require('joi');

const studentSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid first name.',
      'string.empty': 'First name cannot be empty',
      'any.required': 'First name is required.',
    }),
  
  lastName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid last name.',
      'string.empty': 'Last name cannot be empty',
      'any.required': 'Last name is required.',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Enter a valid email.',
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required.',
    }),

  phone: Joi.string()
    .pattern(/^(?:\+254|0)?7[0-9]{8}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Phone number must be a 10-digit number.',
      'string.empty': 'Phone number cannot be empty',
    }),

  regNo: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Registration Number.',
      'string.empty': 'Registration number cannot be empty',
    }),

  kcseNo: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid KCSE number',
      'string.empty': 'KCSE number cannot be empty',
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other')
    .allow(null, '')
    .messages({
      'string.base': 'Enter a valid Gender.',
      'string.empty': 'Gender cannot be empty',
      'any.only': 'Gender must be one of [Male, Female, Other].',
    }),

  feePayment: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Enter a valid Fee payment.',
      'string.empty': 'Fee payment cannot be empty',
    }),

  examResults: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Enter a valid Exam results.',
      'string.empty': 'Exam results cannot be empty',
    }),
    level: Joi.string()
    .required()
   


});
const validateStudent = (student) => {
    return studentSchema.validate(student, { abortEarly: false });
  };

module.exports = validateStudent;

