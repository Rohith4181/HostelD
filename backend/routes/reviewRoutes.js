const express = require('express');
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/:hostelId')
  .get(getReviews)
  .post(protect, authorize('Student'), addReview);

module.exports = router;