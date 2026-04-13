const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/leaves
router.get('/', leaveController.getAllLeaves);

// POST /api/leaves
router.post(
  '/',
  [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student_id is required'),
    body('from_date').isDate().withMessage('Valid from_date (YYYY-MM-DD) is required'),
    body('to_date')
      .isDate().withMessage('Valid to_date (YYYY-MM-DD) is required')
      .custom((to, { req }) => {
        if (new Date(to) < new Date(req.body.from_date)) {
          throw new Error('to_date must be on or after from_date');
        }
        return true;
      }),
  ],
  validate,
  leaveController.requestLeave
);

// PATCH /api/leaves/:id/status
router.patch(
  '/:id/status',
  [
    body('status')
      .isIn(['Approved', 'Rejected', 'Pending'])
      .withMessage('Status must be Approved, Rejected, or Pending'),
  ],
  validate,
  leaveController.updateLeaveStatus
);

module.exports = router;
