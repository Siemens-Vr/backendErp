const Joi = require('joi');

const projectSchema = Joi.object({
  
    name: Joi.string()
      .min(3)
      .max(500)
      .required()
      .messages({
        'string.base': 'Enter a valid Project name.',
        'string.empty': 'Project name cannot be empty.',
        'any.required': 'Project name is required.',
        'string.min': 'Project name must be at least 3 characters long.',
        'string.max': 'Project name must be less than or equal to 100 characters long.',
      }),
  
    description: Joi.string()
      .allow('')
      .required()
      .messages({
        'string.base': 'Description must be a string.',
        'string.empty': 'Description cannot be empty.',
        'any.required': 'Description  is required.',
      }),
  
    status: Joi.string()
      .valid('todo', 'progress', 'completed')
      .required()
      .messages({
        'any.only': 'Status must be one of: todo, progress, completed.',
        'any.required': 'Status is required.',
      }),
  
    budget: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.base': 'Budget must be a valid number.',
        'number.min': 'Budget cannot be negative.',
      }),
  
    funding: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.base': 'Funding must be a valid number.',
        'number.min': 'Funding cannot be negative.',
      }),
  
    startDate: Joi.date()
      .required()
      .messages({
        'date.base': 'Start Date must be a valid date.',
        'date.less': 'Start Date must be in the past.',
        'any.required': 'Start Date is required.',
      }),
  
    endDate: Joi.date()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.base': 'End Date must be a valid date.',
        'date.greater': 'End Date must be after Start Date.',
        'any.required': 'End Date is required.',
      }),
  
    // documentPath: Joi.string()
    //   .optional()
    //   .messages({
    //     'string.base': 'Document path must be a string.',
    //   }),
      
  });
  
  const validateProject = (data) => {
    return projectSchema.validate(data, { abortEarly: false });
  };
  
  module.exports = validateProject;
  