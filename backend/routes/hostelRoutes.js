const express = require('express');
const { 
    getAllHostels, 
    getHostel, 
    createHostel, 
    getUnassignedWardens,
    deleteHostel 
} = require('../controllers/hostelController');

const { protect, authorize } = require('../middleware/authMiddleware');

// --- CHANGE: Import the new Cloudinary helper from utils ---
// (Make sure you created the 'utils/upload.js' file as we discussed)
const upload = require('../utils/upload'); 

const router = express.Router();

router.route('/').get(getAllHostels);

router.route('/wardens/unassigned')
    .get(protect, authorize('DWO'), getUnassignedWardens);

// Use the new 'upload' here. It will automatically send the 'coverImage' to Cloudinary.
router.route('/')
    .post(protect, authorize('DWO'), upload.single('coverImage'), createHostel);

router.route('/:id')
    .get(getHostel)
    .delete(protect, authorize('DWO'), deleteHostel);

module.exports = router;