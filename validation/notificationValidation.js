const Joi = require('joi');

// Define the validation schema for the Notification model
const notificationSchema = Joi.object({
  message: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter a valid Notification Message.',
      'string.empty': 'Message cannot be empty.',
      'any.required': 'Message is required.',
    }),
  
  isRead: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isRead must be a boolean.',
    }),
});

const validateNotification = (notification) => {
    return notificationSchema.validate(notification, { abortEarly: false });
  };
  
  module.exports = validateNotification;