const Joi = require('joi');

const facilitatorSchema = Joi.object({


  firstName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': 'First name must be valid.',
      'string.empty': 'First name cannot be empty.',
      'any.required': 'First name is required.',
    }),

  lastName: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Last name must be valid.',
      'string.empty': 'Last name cannot be empty.',
      'any.required': 'Last name is required.',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be valid.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'other') 
    .insensitive()
    .required()
    .messages({
      'string.base': 'Gender must be valid.',
      'any.required': 'Gender is required.',
    }),

  specification: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.base': 'Specification must be valid.',
      'string.max': 'Specification must be less than or equal to 100 characters long.',
    }),

  idNo: Joi.string()
    .required()
    .messages({
      'string.base': 'ID Number must be valid.',
      'any.required': 'ID Number is required.',
    }),

  phoneNo: Joi.string()
    .pattern(/^(?:\+254|0)?7[0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a 10-digit number.',
      'any.required': 'Phone Number is required.',
    }),
    project: Joi.string()
    // .required()
    .messages({
      'string.base': 'ID Number must be valid.',
      'any.required': 'ID Number is required.',
    }),
});

const validateFacilitator = (data) => {
  return facilitatorSchema.validate(data, { abortEarly: false });
};

module.exports = validateFacilitator;
