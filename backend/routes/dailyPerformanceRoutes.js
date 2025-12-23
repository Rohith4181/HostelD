const express = require('express');
const { createDailyPerformance, getHostelDailyPerformance } = require('../controllers/dailyPerformanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Ensure this imports Multer

const router = express.Router();

router.route('/')
  .post(
    protect, 
    authorize('Warden'), 
    // IMPORTANT: This configuration must match Frontend names exactly
    upload.fields([
      { name: 'breakfast', maxCount: 1 },
      { name: 'lunch', maxCount: 1 },
      { name: 'dinner', maxCount: 1 }
    ]), 
    createDailyPerformance
  );

router.route('/:hostelId')
  .get(getHostelDailyPerformance);

module.exports = router;