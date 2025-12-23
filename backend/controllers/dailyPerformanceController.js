const DailyPerformance = require('../models/DailyPerformance');

// @desc    Upload daily performance data
// @route   POST /api/daily-performance
// @access  Private (Warden)
exports.createDailyPerformance = async (req, res) => {
  try {
    const { studentCount, remarks, latitude, longitude, hostel } = req.body;

    // 1. Construct Image Paths
    // The Frontend sends files named 'breakfast', 'lunch', 'dinner'
    // But the Database Schema expects 'breakfastImage', 'lunchImage', 'dinnerImage'
    const breakfastImg = req.files?.breakfast 
      ? `${req.protocol}://${req.get('host')}/uploads/${req.files.breakfast[0].filename}` 
      : null;
      
    const lunchImg = req.files?.lunch 
      ? `${req.protocol}://${req.get('host')}/uploads/${req.files.lunch[0].filename}` 
      : null;
      
    const dinnerImg = req.files?.dinner 
      ? `${req.protocol}://${req.get('host')}/uploads/${req.files.dinner[0].filename}` 
      : null;

    // 2. Create Database Entry
    const dailyData = await DailyPerformance.create({
      hostel: hostel, 
      warden: req.user.id,
      studentCount: studentCount, // Ensure this matches Schema name
      remarks: remarks || '',
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      // MAP THE NAMES HERE:
      breakfastImage: breakfastImg,
      lunchImage: lunchImg,
      dinnerImage: dinnerImg,
      date: Date.now() // Explicitly set the date to fix "Path `date` is required"
    });

    res.status(201).json({ success: true, data: dailyData });

  } catch (err) {
    console.error("Upload Error:", err); // This helps debug in terminal
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get data for a specific hostel
// @route   GET /api/daily-performance/:hostelId
// @access  Public
exports.getHostelDailyPerformance = async (req, res) => {
    try {
        const data = await DailyPerformance.find({ hostel: req.params.hostelId }).sort({ date: -1 });
        res.status(200).json({ success: true, count: data.length, data: data });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};