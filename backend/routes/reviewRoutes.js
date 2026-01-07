const express = require('express');
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

// --- THE FIX IS HERE ---
// We changed '/' to '/:id' so it captures the ID from the URL
// URL: /api/reviews/65a... (The ID is passed here)

router.route('/:id')
  .get(getReviews)                        // GET reviews for a Hostel
  .post(protect, authorize('Student'), addReview) // POST a review for a Hostel
  .delete(protect, deleteReview);         // DELETE a specific review

module.exports = router;