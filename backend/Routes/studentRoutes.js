const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');
const { body, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/students
router.get('/', studentController.getAllStudents);

// GET /api/students/search?name=...
router.get(
  '/search',
  [query('name').notEmpty().withMessage('Name query parameter is required')],
  validate,
  studentController.searchStudentByName
);

// GET /api/students/:id
router.get('/:id', studentController.getStudentById);

// POST /api/students
router.post(
  '/',
  [
    body('user_id').isInt({ min: 1 }).withMessage('Valid user_id is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone')
      .notEmpty().withMessage('Phone is required')
      .matches(/^[0-9+\-\s]{7,15}$/).withMessage('Enter a valid phone number'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  validate,
  studentController.createStudent
);

// PUT /api/students/:id
router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone')
      .notEmpty().withMessage('Phone is required')
      .matches(/^[0-9+\-\s]{7,15}$/).withMessage('Enter a valid phone number'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  validate,
  studentController.updateStudent
);

// DELETE /api/students/:id
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
