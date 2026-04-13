const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/visitors
router.get('/', visitorController.getAllVisitors);

// POST /api/visitors
router.post(
  '/',
  [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student_id is required'),
    body('visitor_name').notEmpty().withMessage('Visitor name is required'),
    body('entry_time').notEmpty().withMessage('entry_time is required'),
  ],
  validate,
  visitorController.addVisitor
);

// PATCH /api/visitors/:id/exit
router.patch(
  '/:id/exit',
  [body('exit_time').notEmpty().withMessage('exit_time is required')],
  validate,
  visitorController.recordExit
);

// DELETE /api/visitors/:id
router.delete('/:id', visitorController.deleteVisitor);

module.exports = router;
