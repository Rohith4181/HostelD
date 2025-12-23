const Review = require('../models/Review');
const Hostel = require('../models/Hostel');

// @desc    Get reviews for a hostel
// @route   GET /api/reviews/:hostelId
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hostel: req.params.hostelId })
      .populate('user', 'name') // Get the reviewer's name
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add a review
// @route   POST /api/reviews/:hostelId
// @access  Private (Student)
exports.addReview = async (req, res) => {
  try {
    req.body.hostel = req.params.hostelId;
    req.body.user = req.user.id;

    // 1. Check if user already reviewed this hostel
    const existingReview = await Review.findOne({
      hostel: req.params.hostelId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this hostel' });
    }

    // 2. Create Review
    const review = await Review.create(req.body);

    // 3. Recalculate Average Rating for the Hostel using Aggregation
    const stats = await Review.aggregate([
      { $match: { hostel: review.hostel } },
      {
        $group: {
          _id: '$hostel',
          averageRating: { $avg: '$rating' },
          numOfReviews: { $sum: 1 }
        }
      }
    ]);

    // 4. Update Hostel with new stats
    if (stats.length > 0) {
      await Hostel.findByIdAndUpdate(req.params.hostelId, {
        averageRating: stats[0].averageRating,
        numOfReviews: stats[0].numOfReviews
      });
    }

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};