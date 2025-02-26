const Joi = require('joi');

const supplierSchema = Joi.object({
  suppliers: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid supplier name.',
      'string.empty': 'Supplier name cannot be empty.',
      'any.required': 'Supplier name is required.',
    }),

  itemDescription: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid description.',
      'string.empty': 'Description cannot be empty.',
      'any.required': 'Description is required.',
    }),

  amountClaimed: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Amount must be a valid number.',
      'number.positive': 'Amount must be a positive number.',
      'any.required': 'Amount is required.',
    }),

  approver: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid approver.',
      'string.empty': 'Approver cannot be empty.',
      'any.required': 'Approver is required.',
    }),

  dateTakenToApprover: Joi.date()
    .required()
    .messages({
      'date.base': 'Enter a valid date for date taken to approver.',
      'date.empty': 'Date taken to approver cannot be empty.',
      'any.required': 'Date taken to approver is required.',
    }),

  dateTakenToFinance: Joi.date()
    .required()
    .messages({
      'date.base': 'Enter a valid date for date taken to finance.',
      'date.empty': 'Date taken to finance cannot be empty.',
      'any.required': 'Date taken to finance is required.',
    }),

  type: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid type.',
      'string.empty': 'Type cannot be empty.',
      'any.required': 'Type is required.',
    }),

  PvNo: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Enter a valid PvNo.',
    }),

  claimNumber: Joi.string()
    .allow(null, '')
    .messages({
      'string.base': 'Enter a valid claim number.',
    }),

  accounted: Joi.string()
    .valid('Yes', 'No')
    .allow(null, '')
    .messages({
      'string.base': 'Enter a valid accounted value.',
      'any.only': 'Accounted must be one of [Yes, No].',
    }),

  dateAccounted: Joi.date()
    .allow(null, '')
    .messages({
      'date.base': 'Enter a valid date for date accounted.',
    }),

    project: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Project.',
      'string.empty': 'Project cannot be empty.',
      'any.required': 'Project is required.',
    }),
});

const validateSupplier = (supplier) => {
  return supplierSchema.validate(supplier, { abortEarly: false });
};

module.exports = validateSupplier;
