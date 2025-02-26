const Joi = require('joi');

const documentValidation = Joi.object({
  documentPath: Joi.string().optional(),
});

module.exports = documentValidation;
