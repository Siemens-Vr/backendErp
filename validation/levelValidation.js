const Joi = require('joi');

const levelSchema = Joi.object({
  levelName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Level name.',
      'string.empty': 'Level name cannot be empty.',
      'any.required': 'Level name is required.',
    }),

  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Enter a valid Start date.',
      'date.iso': 'Start date must be a valid ISO date format.',
      'any.required': 'Start date is required.',
    }),

  endDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Enter a valid End date.',
      'date.iso': 'End date must be a valid ISO date format.',
      'any.required': 'End date is required.',
    }),

  exam_dates: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Enter a valid Exam date.',
      'date.iso': 'Exam date must be a valid ISO date format.',
    }),

  exam_quotation_number: Joi.string()
    .allow(null)
    .messages({
      'string.base': 'Enter a valid Exam quotation number.',
      'string.empty': 'Exam quotation number cannot be empty.',
    }),

  cohortId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.base': 'Enter a valid Cohort ID.',
      'string.guid': 'Cohort ID must be a valid UUID.',
      'any.required': 'Cohort ID is required.',
    }),
    facilitators: Joi
  .required()
});



const validateLevel = (data) => {
  return levelSchema.validate(data, { abortEarly: false });
};

module.exports = validateLevel;
