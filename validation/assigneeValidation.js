const Joi = require('joi');

const assigneeSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name cannot be empty.',
      'any.required': 'Name is required.',
      'string.min': 'Name must be at least 3 characters long.',
      'string.max': 'Name must be at most 100 characters long.',
    }),

  gender: Joi.string()
    .valid('Male', 'Female') 
    .optional()
    .messages({
      'string.base': 'Gender must be a string.',
      'any.only': 'Gender must be either Male, Female.',
    }),

  access: Joi.string()
    .required()
    .messages({
      'string.base': 'Access must be a string.',
      'string.empty': 'Access cannot be empty.',
      'any.required': 'Access is required.',
      'any.only': 'Access must be one of Read, Write, or Admin.',
    }),

  role: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Role must be a string.',
      'string.empty': 'Role cannot be empty.',
      'any.required': 'Role is required.',
      'string.min': 'Role must be at least 2 characters long.',
      'string.max': 'Role must be at most 50 characters long.',
    }),

  dateJoined: Joi.date()
    .required()
    .messages({
      'date.base': 'Date Joined must be a valid date.',
      'date.less': 'Date Joined must be in the past.',
      'any.required': 'Date Joined is required.',
    }),
    // projectId: Joi.string()
    // .guid({ version: ['uuidv4'] })
    // .required()
    // .messages({
    //   'string.guid': 'Project ID must be a valid UUID.',
    //   'any.required': 'Project ID is required.',
    // }),
});


const validateAssignee = (data) => {
  return assigneeSchema.validate(data, { abortEarly: false });
};

module.exports = validateAssignee;
