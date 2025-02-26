// validations/levelFacilitatorsValidation.js

const Joi = require('joi');

const levelFacilitatorSchema = Joi.object({
  specification: Joi.string().allow('').max(255).messages({
    'string.base': 'Specification must be valid',
    'string.max': 'Specification cannot exceed 255 characters'
  }),
  levelId: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': 'Level ID must be valid',
    'string.guid': 'Level ID must be a valid UUID v4',
    'any.required': 'Level ID is required'
  }),
  facilitatorId: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.base': 'Facilitator ID must be valid',
    'string.guid': 'Facilitator ID must be a valid UUID v4',
    'any.required': 'Facilitator ID is required'
  })
}).custom((value, helpers) => {
  if (!value.levelId && !value.facilitatorId) {
    return helpers.error('custom.bothIdsNull');
  }
  return value;
}, 'Check for both IDs being null').message({
  'custom.bothIdsNull': 'At least one of Level ID or Facilitator ID must be provided'
});

const validateLevelFacilitator = (levelFacilitator) => {
  return levelFacilitatorSchema.validate(levelFacilitator, { abortEarly: false });
};

module.exports = validateLevelFacilitator;