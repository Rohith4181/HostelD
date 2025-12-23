const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  category: {
    type: String,
    enum: ['Hygiene', 'Food', 'Harassment', 'Infrastructure', 'Other'],
    required: [true, 'Please select a category']
  },
  description: {
    type: String,
    required: [true, 'Please describe the issue'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved', 'Dismissed'],
    default: 'Open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);