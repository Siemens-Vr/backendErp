const Joi = require('joi');
const validateDeliverable  = require('./deliverableValidation'); 

const phaseSchema = Joi.object({  
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.base': 'Enter a valid Phase name.',
        'string.empty': 'Phase name cannot be empty.',
        'any.required': 'Phase name is required.',
        'string.min': 'Phase name must be at least 3 characters long.',
        'string.max': 'Phase name must be less than or equal to 100 characters long.',
      }),
  
    status: Joi.string()
      .valid('todo', 'progress', 'completed')
      .required()
      .messages({
        'any.only': 'Status must be one of: todo, progress, Completed.',
        'any.required': 'Status is required.',
      }),
  
    startDate: Joi.date()
      .required()
      .messages({
        'date.base': 'Start Date must be a valid date.',
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
  
    // projectId: Joi.string()
    //   .guid({ version: ['uuidv4'] })
    //   .required()
    //   .messages({
    //     'string.guid': 'Project ID must be a valid UUID.',
    //     'any.required': 'Project ID is required.',
    //   }),
    deliverables: Joi.array()
    .items(validateDeliverable)  
    .optional(), 
  });
  
  const validatePhase = (data) => {
    return phaseSchema.validate(data, { abortEarly: false });
  };
  
  module.exports = validatePhase;
  