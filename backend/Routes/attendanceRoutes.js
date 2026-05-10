const express = require('express');
const router = express.Router();
const ctrl = require('../Controllers/attendanceController');
const { auth, adminOnly } = require('./middleware');

// GET /api/attendance          — admin: all logs
router.get('/', auth, adminOnly, ctrl.getAllLogs);

// GET /api/attendance/:studentId  — student: own logs
router.get('/:studentId', auth, ctrl.getStudentLogs);

// POST /api/attendance/checkin    — admin: check a student in
router.post('/checkin', auth, adminOnly, ctrl.checkIn);

// PUT /api/attendance/checkout/:logId  — admin: check a student out
router.put('/checkout/:logId', auth, adminOnly, ctrl.checkOut);

module.exports = router;
