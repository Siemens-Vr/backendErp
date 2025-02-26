const Joi = require('joi');

const leaveSchema = Joi.object({
  days: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.base': 'Enter a valid date for days.',
      'date.iso': 'Days must be a valid ISO date format.',
    }),

  staffUUID: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required()
    .messages({
      'string.base': 'Enter a valid Staff UUID.',
      'string.guid': 'Staff UUID must be a valid UUID.',
      'any.required': 'Staff UUID is required.',
    }),
});

const validateLeave = (data) => {
  return leaveSchema.validate(data, { abortEarly: false });
};

module.exports = validateLeave;
