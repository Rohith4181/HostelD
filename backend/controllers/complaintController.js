const Complaint = require('../models/Complaint');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Student Only)
exports.createComplaint = async (req, res) => {
  try {
    const { hostel, category, description, isAnonymous } = req.body;

    const complaint = await Complaint.create({
      student: req.user.id,
      hostel,
      category,
      description,
      isAnonymous
    });

    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get complaints for a specific hostel
// @route   GET /api/complaints/hostel/:hostelId
// @access  Private (DWO Only)
exports.getComplaintsByHostel = async (req, res) => {
  try {
    // 1. Fetch complaints and populate student details
    const complaints = await Complaint.find({ hostel: req.params.hostelId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    // 2. Anonymity Filter
    // We modify the result before sending it to the DWO
    const sanitizedComplaints = complaints.map(complaint => {
      const compObj = complaint.toObject(); // Convert Mongoose doc to plain object
      
      if (compObj.isAnonymous) {
        compObj.student = { name: "Anonymous Student", email: "Hidden" };
      }
      return compObj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedComplaints.length,
      data: sanitizedComplaints
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private (DWO Only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expects 'Resolved' or 'Dismissed'

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
        return res.status(404).json({ success: false, error: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};