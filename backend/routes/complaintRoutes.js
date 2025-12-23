const express = require('express');
const { 
    createComplaint, 
    getComplaintsByHostel, 
    updateComplaintStatus 
} = require('../controllers/complaintController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Submit Complaint (Student Only)
router.route('/').post(protect, authorize('Student'), createComplaint);

// 2. Get Complaints (Allow DWO, Warden, AND Student to see them)
// We removed '/hostel' from the path to match the Frontend
router.route('/:hostelId')
    .get(protect, authorize('DWO', 'Warden', 'Student'), getComplaintsByHostel);

// 3. Update Status (Allow DWO AND Warden to resolve)
router.route('/:id')
    .put(protect, authorize('DWO', 'Warden'), updateComplaintStatus);

module.exports = router;