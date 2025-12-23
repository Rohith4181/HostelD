const mongoose = require('mongoose');

const dailyPerformanceSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  studentCount: {
    type: Number,
    required: [true, 'Please add the number of students present']
  },
  breakfastImage: {
    type: String, // URL from Cloudinary
    required: [true, 'Please upload breakfast photo']
  },
  lunchImage: {
    type: String, 
    required: [true, 'Please upload lunch photo']
  },
  dinnerImage: {
    type: String, 
    required: [true, 'Please upload dinner photo']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound Index: Ensures unique combination of Hostel + Date
dailyPerformanceSchema.index({ hostel: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyPerformance', dailyPerformanceSchema);