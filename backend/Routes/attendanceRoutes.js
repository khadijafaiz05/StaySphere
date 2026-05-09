const express = require('express');
const router = express.Router();
const ctrl = require('../Controllers/attendanceController');
const { auth, adminOnly } = require('./middleware');

router.get('/', auth, adminOnly, ctrl.getAllLogs);
router.get('/:studentId', auth, ctrl.getStudentLogs);
router.post('/checkin', auth, adminOnly, ctrl.checkIn);
router.put('/checkout/:logId', auth, adminOnly, ctrl.checkOut);

module.exports = router;