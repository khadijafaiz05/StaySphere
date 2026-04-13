const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/fees
router.get('/', feeController.getAllFees);

// GET /api/fees/total-payments
router.get('/total-payments', feeController.getTotalPayments);

// POST /api/fees
router.post(
  '/',
  [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student_id is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('due_date').isDate().withMessage('Valid due_date (YYYY-MM-DD) is required'),
  ],
  validate,
  feeController.addFee
);

// POST /api/fees/payment
router.post(
  '/payment',
  [
    body('fee_id').isInt({ min: 1 }).withMessage('Valid fee_id is required'),
    body('amount_paid').isFloat({ min: 0 }).withMessage('Amount paid must be a positive number'),
    body('payment_date').isDate().withMessage('Valid payment_date (YYYY-MM-DD) is required'),
  ],
  validate,
  feeController.makePayment
);

module.exports = router;
