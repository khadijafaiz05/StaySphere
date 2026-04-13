const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/rooms
router.get('/', roomController.getAllRooms);

// GET /api/rooms/allocations
router.get('/allocations', roomController.getAllAllocations);

// GET /api/rooms/:id
router.get('/:id', roomController.getRoomById);

// POST /api/rooms/allocate
router.post(
  '/allocate',
  [
    body('student_id').isInt({ min: 1 }).withMessage('Valid student_id is required'),
    body('room_id').isInt({ min: 1 }).withMessage('Valid room_id is required'),
    body('allocation_date').isDate().withMessage('Valid allocation_date (YYYY-MM-DD) is required'),
  ],
  validate,
  roomController.allocateRoom
);

// DELETE /api/rooms/allocations/:allocation_id
router.delete('/allocations/:allocation_id', roomController.deallocateRoom);

module.exports = router;
