const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController'); // <--- Import logout
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout); // <--- Add this line

module.exports = router;