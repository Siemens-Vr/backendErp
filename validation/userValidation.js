const Joi = require('joi');

const userSchema = Joi.object({
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
    .messages({
      'string.base': 'Enter a valid Email.',
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cannot be empty.',
    }),

  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'Enter a valid Password.',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
    }),
    confirm_password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'Enter a valid Password.',
      'string.empty': 'Password cannot be empty.',
      'any.required': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
    }),
});
const validateUser = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};

module.exports = validateUser;
