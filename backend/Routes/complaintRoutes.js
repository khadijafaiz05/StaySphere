const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/complaints
router.get('/', complaintController.getAllComplaints);

// GET /api/complaints/pending
router.get('/pending', complaintController.getPendingComplaints);

// GET /api/complaints/student/:id
router.get('/student/:id', complaintController.getStudentComplaints);

// POST /api/complaints
router.post(
  '/',
  [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student_id is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description')
      .notEmpty().withMessage('Description is required')
      .isLength({ min: 5 }).withMessage('Description must be at least 5 characters'),
  ],
  validate,
  complaintController.addComplaint
);

// PATCH /api/complaints/:id/resolve
router.patch('/:id/resolve', complaintController.resolveComplaint);

module.exports = router;
