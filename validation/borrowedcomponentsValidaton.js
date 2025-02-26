const Joi = require('joi');

const borrowedComponentSchema = Joi.object({
  uuid: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional()
    .messages({
      'string.guid': 'UUID must be a valid UUID.',
    }),
  
  fullName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Enter valid Full Name.',
      'string.empty': 'Full Name cannot be empty.',
      'any.required': 'Full Name is required.',
      'string.min': 'Full Name must be at least 3 characters long.',
      'string.max': 'Full Name must be less than or equal to 100 characters long.',
    }),

  borrowerContact: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Enter valid Borrower Contact.',
      'string.empty': 'Borrower Contact cannot be empty.',
      'any.required': 'Borrower Contact is required.',
      'string.email': 'Borrower Contact must be a valid email.',
    }),

  borrowerID: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.base': 'Enter valid Borrower ID.',
      'string.empty': 'Borrower ID cannot be empty.',
      'any.required': 'Borrower ID is required.',
      'string.min': 'Borrower ID must be at least 5 characters long.',
      'string.max': 'Borrower ID must be less than or equal to 20 characters long.',
    }),

  departmentName: Joi.string()
    .required()
    .messages({
      'string.base': 'Enter valid Department Name.',
      'string.empty': 'Department Name cannot be empty.',
      'any.required': 'Department Name is required.',
    }),

  componentUUID: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional()
    .messages({
      'string.guid': 'Component UUID must be a valid UUID.',
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Enter valid Quantity.',
      'number.integer': 'Quantity must be an integer.',
      'number.min': 'Quantity must be at least 1.',
      'any.required': 'Quantity is required.',
    }),

  dateOfIssue: Joi.date()
    .less('now')
    .required()
    .messages({
      'date.base': 'Date of Issue must be a valid date.',
      'date.less': 'Date of Issue must be in the past.',
      'any.required': 'Date of Issue is required.',
    }),

  expectedReturnDate: Joi.date()
    .greater(Joi.ref('dateOfIssue'))
    .required()
    .messages({
      'date.base': 'Expected Return Date must be a valid date.',
      'date.greater': 'Expected Return Date must be after Date of Issue.',
      'any.required': 'Expected Return Date is required.',
    }),

  actualReturnDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Actual Return Date must be a valid date.',
    }),

  purpose: Joi.string()
    .required()
    .messages({
      'string.base': 'Purpose must be a string.',
      'string.empty': 'Purpose cannot be empty.',
      'any.required': 'Purpose is required.',
    }),

  reasonForBorrowing: Joi.string()
    .required()
    .messages({
      'string.base': 'Reason for Borrowing must be a string.',
      'string.empty': 'Reason for Borrowing cannot be empty.',
      'any.required': 'Reason for Borrowing is required.',
    }),
});

const validateBorrowedComponent = (data) => {
  return borrowedComponentSchema.validate(data, { abortEarly: false });
};

module.exports = validateBorrowedComponent;
