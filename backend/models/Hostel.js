const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hostel name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  district: {
    type: String,
    required: [true, 'Please add a district']
  },
  state: {
    type: String,
    required: [true, 'Please add a state']
  },
  // --- NEW FIELD ---
  address: {
    type: String,
    required: [true, 'Please add the full address']
  },
  // ----------------
  warden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  latitude: {
    type: Number,
    required: [true, 'Please add latitude']
  },
  longitude: {
    type: Number,
    required: [true, 'Please add longitude']
  },
  coverImage: {
    type: String, // Will now store the file path (e.g., /uploads/image.jpg)
    required: [true, 'Please upload a cover image']
  },
  averageRating: {
      type: Number,
      default: 0, // Default to 0 (No rating)
      // We removed the 'min: 1' rule so 0 is allowed now.
      max: [5, 'Rating must can not be more than 5']
    },
  numOfReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hostel', hostelSchema);