// validations/itemsValidation.js

const Joi = require('joi');

const itemSchema = Joi.object({
  suppliers: Joi.string().required().messages({
    'string.base': 'Enter a valid supplier name',
    'string.empty': 'Supplier name cannot be empty',
    'any.required': 'Supplier name is required'
  }),
  itemDescription: Joi.string().required().messages({
    'string.base': 'Enter a valid item description',
    'string.empty': 'Item description cannot be empty',
    'any.required': 'Item description is required'
  }),
  amountClaimed: Joi.number().integer().required().messages({
    'number.base': 'Enter a valid amount claimed',
    'number.integer': 'Amount claimed must be an integer',
    'any.required': 'Amount claimed is required'
  }),
  claimAnt: Joi.string().required().messages({
    'string.base': 'Enter a valid claimant name',
    'string.empty': 'Claimant name cannot be empty',
    'any.required': 'Claimant name is required'
  }),
  dateClaimed: Joi.date().required().messages({
    'date.base': 'Enter a valid date claimed',
    'any.required': 'Date claimed is required'
  }),
  pvNo: Joi.number().integer().required().messages({
    'number.base': 'Enter a valid PV number',
    'number.integer': 'PV number must be an integer',
    'any.required': 'PV number is required'
  })
});

const validateItem = (item) => {
  return itemSchema.validate(item, { abortEarly: false });
};

module.exports = validateItem;
