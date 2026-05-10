const express = require('express');
const router = express.Router();
const { login, getMe } = require('../Controllers/authController');
const { auth } = require('./middleware');

router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;
