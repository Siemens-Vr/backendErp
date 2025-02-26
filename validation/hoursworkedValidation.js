const Joi = require('joi');

const hoursWorkedSchema = Joi.object({
  day: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Enter a valid date for the day.',
      'date.iso': 'Day must be a valid ISO date format.',
      'any.required': 'Day is required.',
    }),

  hours: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Enter a valid number of hours.',
      'number.integer': 'Hours must be an integer.',
      'number.min': 'Hours cannot be negative.',
      'any.required': 'Hours are required.',
    }),
});

const validateHoursWorked = (data) => {
  return hoursWorkedSchema.validate(data, { abortEarly: false });
};

module.exports = validateHoursWorked;
