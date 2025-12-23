const Menu = require('../models/Menu');

// @desc    Get menu for a specific hostel
// @route   GET /api/menus/:hostelId
// @access  Public
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ hostel: req.params.hostelId });

    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menu not found for this hostel' });
    }

    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};