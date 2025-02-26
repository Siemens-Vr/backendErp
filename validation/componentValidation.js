const Joi = require('joi');

const componentSchema = Joi.object({
  uuid: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional()
    .messages({
      'string.base': 'UUID must be valid.',
      'string.guid': 'UUID must be a valid UUID.',
    }),

  componentName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Component name.',
      'any.required': 'Component name is required.',
    }),

  componentType: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Component type.',
      'any.required': 'Component type is required.',
    }),

  modelNumber: Joi.string()
    .optional()
    .messages({
      'string.base': 'Enter a valid Model number.',
    }),

  description: Joi.string()
    .optional()
    .messages({
      'string.base': 'Enter a valid Description.',
    }),

  partNumber: Joi.string()
    .optional()
    .messages({
      'string.base': 'Enter a valid Part number.',
    }),

  totalQuantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Total quantity must be valid.',
      'number.integer': 'Total quantity must be an integer.',
      'number.min': 'Total quantity must be at least 0.',
    }),

  remainingQuantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Remaining quantity must be valid.',
      'number.integer': 'Remaining quantity must be an integer.',
      'number.min': 'Remaining quantity must be at least 0.',
    }),

  borrowedQuantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Borrowed quantity must valid.',
      'number.integer': 'Borrowed quantity must be an integer.',
      'number.min': 'Borrowed quantity must be at least 0.',
    }),

  status: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Status must be valid.',
    }),

  condition: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Condition must be valid.',
    }),

  conditionDetails: Joi.string()
    .optional()
    .messages({
      'string.base': 'Condition details must be valid.',
    }),

});

const validateComponent = (data) => {
  return componentSchema.validate(data, { abortEarly: false });
};

module.exports = validateComponent;
