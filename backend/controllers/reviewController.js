const Review = require('../models/Review');
const Hostel = require('../models/Hostel');

// @desc    Get reviews for a hostel
// @route   GET /api/reviews/:id  (ID = Hostel ID)
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    // CHANGE: Use req.params.id instead of hostelId
    const reviews = await Review.find({ hostel: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

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
// @route   POST /api/reviews/:id  (ID = Hostel ID)
// @access  Private (Student)
exports.addReview = async (req, res) => {
  try {
    // CHANGE: Use req.params.id
    req.body.hostel = req.params.id;
    req.body.user = req.user.id;

    const existingReview = await Review.findOne({
      hostel: req.params.id,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this hostel' });
    }

    const review = await Review.create(req.body);

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

    if (stats.length > 0) {
      // CHANGE: Use req.params.id
      await Hostel.findByIdAndUpdate(req.params.id, {
        averageRating: stats[0].averageRating,
        numOfReviews: stats[0].numOfReviews
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id  (ID = Review ID)
// @access  Private (Owner only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const hostelId = review.hostel;
    await review.deleteOne();

    const stats = await Review.aggregate([
      { $match: { hostel: hostelId } },
      {
        $group: {
          _id: '$hostel',
          averageRating: { $avg: '$rating' },
          numOfReviews: { $sum: 1 }
        }
      }
    ]);

    await Hostel.findByIdAndUpdate(hostelId, {
      averageRating: stats.length > 0 ? stats[0].averageRating : 0,
      numOfReviews: stats.length > 0 ? stats[0].numOfReviews : 0
    });

    res.status(200).json({ success: true, data: {} });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};