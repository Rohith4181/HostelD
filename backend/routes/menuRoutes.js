const express = require('express');
const { getMenu, updateMenu, deleteMenu } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware'); // Import Auth Middleware

const router = express.Router();

// Public Route: View Menu
router.get('/:hostelId', getMenu);

// Protected Routes: Add/Edit/Delete (Warden Only)
router.post('/', protect, updateMenu);
router.delete('/:hostelId', protect, deleteMenu);

module.exports = router;