const Joi = require('joi');

const cohortSchema = Joi.object({
  id: Joi.number()
    .integer()
    .optional()
    .messages({
      'number.base': 'ID must be valid.',
      'number.integer': 'ID must be an integer.',
    }),

  uuid: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional()
    .messages({
      'string.base': 'UUID must be valid.',
      'string.guid': 'UUID must be a valid UUID.',
    }),

  cohortName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Cohort name.',
      'any.required': 'Cohort name is required.',
    }),

  startDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Start date must be a valid date.',
      'any.required': 'Start date is required.',
    }),

  endDate: Joi.date()
    .required()
    .greater(Joi.ref('startDate'))
    .messages({
      'date.base': 'End date must be a valid date.',
      'date.greater': 'End date must be after start date.',
      'any.required': 'End date is required.',
    }),
});

const validateCohort = (data) => {
  return cohortSchema.validate(data, { abortEarly: false });
};

module.exports = validateCohort;
