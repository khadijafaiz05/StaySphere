const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/attendance
router.get('/', attendanceController.getAllLogs);

// POST /api/attendance/entry
router.post(
  '/entry',
  [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student_id is required'),
    body('entry_time').notEmpty().withMessage('entry_time is required'),
  ],
  validate,
  attendanceController.logEntry
);

// PATCH /api/attendance/:id/exit
router.patch(
  '/:id/exit',
  [body('exit_time').notEmpty().withMessage('exit_time is required')],
  validate,
  attendanceController.logExit
);

module.exports = router;
