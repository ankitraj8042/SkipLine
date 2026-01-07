const { body, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

// Queue creation validation
const validateQueueCreation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Queue name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Queue name must be between 2-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('organizationType')
    .notEmpty().withMessage('Organization type is required')
    .isIn(['clinic', 'shop', 'college', 'restaurant', 'bank', 'government', 'other'])
    .withMessage('Invalid organization type'),
  
  body('maxCapacity')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Max capacity must be between 1-1000'),
  
  body('estimatedTimePerPerson')
    .optional()
    .isInt({ min: 1, max: 120 }).withMessage('Estimated time must be between 1-120 minutes'),
  
  body('organizerName')
    .trim()
    .notEmpty().withMessage('Organizer name is required'),
  
  body('organizerEmail')
    .trim()
    .notEmpty().withMessage('Organizer email is required')
    .isEmail().withMessage('Please enter a valid organizer email'),
  
  handleValidationErrors
];

// Join queue validation
const validateJoinQueue = [
  body('userName')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  
  body('userPhone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  
  body('userEmail')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Notes cannot exceed 200 characters'),
  
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateLogin,
  validateQueueCreation,
  validateJoinQueue,
  validateObjectId,
  handleValidationErrors
};
