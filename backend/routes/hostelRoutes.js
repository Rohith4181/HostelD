const express = require('express');
const { 
    getAllHostels, 
    getHostel, 
    createHostel, 
    getUnassignedWardens,
    deleteHostel // <--- Import the new function
} = require('../controllers/hostelController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/').get(getAllHostels);

router.route('/wardens/unassigned')
    .get(protect, authorize('DWO'), getUnassignedWardens);

router.route('/')
    .post(protect, authorize('DWO'), upload.single('coverImage'), createHostel);

// Update this section for DELETE
router.route('/:id')
    .get(getHostel)
    .delete(protect, authorize('DWO'), deleteHostel); // <--- Add this line

module.exports = router;