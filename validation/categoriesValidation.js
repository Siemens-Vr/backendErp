const Joi = require('joi');

const categorySchema = Joi.object({
  category: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Category.',
      'any.required': 'Category is required.',
      'string.empty': 'Category cannot be empty.',
    }),
});

const validateCategory = (data) => {
  return categorySchema.validate(data, { abortEarly: false });
};

module.exports = validateCategory;
