const Joi = require('joi');

const componentsQuantitySchema = Joi.object({
  uuid: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional()
    .messages({
      'string.base': 'UUID must be valid.',
      'string.guid': 'UUID must be a valid UUID.',
    }),

  componentUUID: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.base': 'Component UUID must be valid.',
      'string.guid': 'Component UUID must be a valid UUID.',
      'any.required': 'Component UUID is required.',
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Enter a valid Quantity.',
      'number.integer': 'Quantity must be an integer.',
      'number.min': 'Quantity must be at least 0.',
      'any.required': 'Quantity is required.',
    }),

});

const validateComponentsQuantity = (data) => {
  return componentsQuantitySchema.validate(data, { abortEarly: false });
};

module.exports = validateComponentsQuantity;
