const Hostel = require('../models/Hostel');
const User = require('../models/User');

// @desc    Get all hostels
// @route   GET /api/hostels
// @access  Public
exports.getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().populate('warden', 'name contactNumber');
    res.status(200).json({ success: true, count: hostels.length, data: hostels });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single hostel
// @route   GET /api/hostels/:id
// @access  Public
exports.getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('warden', 'name contactNumber');
    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found' });
    }
    res.status(200).json({ success: true, data: hostel });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new hostel
// @route   POST /api/hostels
// @access  Private (DWO)
exports.createHostel = async (req, res) => {
  try {
    // 1. Handle Image Upload path
    let coverImagePath = '';
    if (req.file) {
      coverImagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // 2. Create Hostel
    const hostel = await Hostel.create({
      ...req.body,
      coverImage: coverImagePath
    });

    res.status(201).json({ success: true, data: hostel });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get wardens who don't have a hostel yet
// @route   GET /api/hostels/wardens/unassigned
// @access  Private (DWO)
exports.getUnassignedWardens = async (req, res) => {
  try {
    // 1. Find all Wardens
    const allWardens = await User.find({ role: 'Warden' });

    // 2. Find all Hostels to see which Wardens are taken
    const hostels = await Hostel.find();
    const assignedWardenIds = hostels.map(h => h.warden.toString());

    // 3. Filter the list
    const unassigned = allWardens.filter(w => !assignedWardenIds.includes(w._id.toString()));

    res.status(200).json({ success: true, count: unassigned.length, data: unassigned });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (DWO)
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ success: false, error: 'Hostel not found' });
    }

    await hostel.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};