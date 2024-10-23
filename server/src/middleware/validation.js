const { body, validationResult } = require('express-validator');

exports.validateSignup = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['patient', 'doctor', 'admin']),
  body('firstName').if(body('role').equals('patient')).notEmpty(),
  body('lastName').if(body('role').equals('patient')).notEmpty(),
  body('dob').if(body('role').equals('patient')).notEmpty(),
  body('gender').if(body('role').equals('patient')).isIn(['male', 'female', 'other']),
  body('phoneNumber').if(body('role').equals('patient')).notEmpty(),
  body('emrSystem').if(body('role').equals('patient')).notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateSignin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];