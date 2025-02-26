const Joi = require('joi');

const deliverableSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Enter a valid Deliverable name.',
      'string.empty': 'Deliverable name cannot be empty.',
      'any.required': 'Deliverable name is required.',
      'string.min': 'Deliverable name must be at least 3 characters long.',
      'string.max': 'Deliverable name must be less than or equal to 100 characters long.',
    }),

  status: Joi.string()
    .valid('todo', 'progress', 'completed')
    .required()
    .messages({
      'any.only': 'Status must be one of the following: todo, progress, Completed.',
      'any.required': 'Status is required.',
    }),

  startDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Start Date must be a valid date.',
      'date.less': 'Start Date must be in the past.',
      'any.required': 'Start Date is required.',
    }),

  expectedFinish: Joi.date()
    .greater(Joi.ref('startDate'))
    .required()
    .messages({
      'date.base': 'Expected Finish Date must be a valid date.',
      'date.greater': 'Expected Finish Date must be after Start Date.',
      'any.required': 'Expected Finish Date is required.',
    }),

  // description: Joi.string()
  //   .optional()
  //   .required()
  //   .messages({
  //     'string.base': 'Description must be a string.',
  //     'any.required': 'Desciption is required.',
  //   }),

  // phaseId: Joi.string()
  //   .guid({ version: ['uuidv4'] })
  //   .required()
  //   .messages({
  //     'string.guid': 'Phase ID must be a valid UUID.',
  //     'any.required': 'Phase ID is required.',
  //   }),
});

const validateDeliverable = (data) => {
  return deliverableSchema.validate(data, { abortEarly: false });
};

module.exports = validateDeliverable;
