const express = require('express');
const router = express.Router();
const ctrl = require('../Controllers/studentController');
const { auth, adminOnly } = require('./middleware');

router.get('/', auth, adminOnly, ctrl.getAllStudents);
router.get('/:id', auth, ctrl.getStudentById);
router.get('/:id/profile', auth, ctrl.getStudentProfile);
router.post('/', auth, adminOnly, ctrl.addStudent);
router.put('/:id', auth, adminOnly, ctrl.updateStudent);
router.delete('/:id', auth, adminOnly, ctrl.deleteStudent);

module.exports = router;