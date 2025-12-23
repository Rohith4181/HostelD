const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true,
    unique: true // Ensures a hostel only has one active menu configuration
  },
  weeklyMenu: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      breakfast: { 
        type: String, 
        required: true,
        default: 'Not Set' 
      },
      lunch: { 
        type: String, 
        required: true,
        default: 'Not Set' 
      },
      dinner: { 
        type: String, 
        required: true,
        default: 'Not Set' 
      }
    }
  ],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Menu', menuSchema);