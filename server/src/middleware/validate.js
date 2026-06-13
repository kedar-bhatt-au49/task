const { body, query, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({ error: messages.join('; ') });
  }
  next();
};

const addWordRules = [
  body('word')
    .trim()
    .notEmpty().withMessage('Word is required')
    .isString().withMessage('Word must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('Word must be between 1 and 100 characters')
    .matches(/^[a-zA-Z\s\-']+$/).withMessage('Word can only contain letters, spaces, hyphens, and apostrophes'),
  handleValidationErrors,
];

const reviewWordRules = [
  param('id')
    .notEmpty().withMessage('Word ID is required')
    .isMongoId().withMessage('Invalid word ID format'),
  body('gotItRight')
    .notEmpty().withMessage('gotItRight is required')
    .isBoolean().withMessage('gotItRight must be a boolean'),
  handleValidationErrors,
];

const devModeRules = [
  body('enabled')
    .notEmpty().withMessage('enabled is required')
    .isBoolean().withMessage('enabled must be a boolean'),
  handleValidationErrors,
];

const searchQueryRules = [
  query('search')
    .optional()
    .isString().withMessage('Search must be a string')
    .isLength({ max: 200 }).withMessage('Search too long'),
  handleValidationErrors,
];

module.exports = { addWordRules, reviewWordRules, devModeRules, searchQueryRules };
