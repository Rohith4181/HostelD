const Menu = require('../models/Menu');
const Hostel = require('../models/Hostel');

// @desc    Get menu
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.findOne({ hostel: req.params.hostelId });
    if (!menu) return res.status(404).json({ success: false, error: 'Menu not found' });
    res.status(200).json({ success: true, data: menu });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create or Update Menu
exports.updateMenu = async (req, res) => {
  try {
    const { hostelId, weeklyMenu } = req.body;

    // 1. Role Check
    if (req.user.role !== 'Warden') {
      return res.status(403).json({ success: false, error: 'Access denied. Wardens only.' });
    }

    // 2. Security Check: Is this user the Warden of THIS hostel?
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ success: false, error: 'Hostel not found' });

    const hostelWardenId = hostel.warden._id ? hostel.warden._id.toString() : hostel.warden.toString();
    if (hostelWardenId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You are not authorized to edit this menu.' });
    }

    // 3. Upsert (Update if exists, Create if not)
    let menu = await Menu.findOne({ hostel: hostelId });

    if (menu) {
      menu.weeklyMenu = weeklyMenu;
      menu.lastUpdated = Date.now();
      await menu.save();
    } else {
      menu = await Menu.create({ hostel: hostelId, weeklyMenu });
    }

    res.status(200).json({ success: true, data: menu });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete Menu (NEW FEATURE)
// @route   DELETE /api/menus/:hostelId
// @access  Private (Warden Only)
exports.deleteMenu = async (req, res) => {
  try {
    const { hostelId } = req.params;

    // 1. Role Check
    if (req.user.role !== 'Warden') {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    // 2. Security Check
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) return res.status(404).json({ success: false, error: 'Hostel not found' });

    const hostelWardenId = hostel.warden._id ? hostel.warden._id.toString() : hostel.warden.toString();
    if (hostelWardenId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }

    // 3. Delete
    await Menu.findOneAndDelete({ hostel: hostelId });

    res.status(200).json({ success: true, data: {} });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};