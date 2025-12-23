const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['Student', 'Warden', 'DWO'],
    required: true
  },
  contactNumber: {
    type: String,
    // Required only if the role is Warden, strictly speaking, 
    // but useful for all. Making it optional for now to avoid friction.
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Note: The "Secret Code" validation (WARDEN_SECURE_2025) will be handled 
// in the Controller logic during the Sign-Up process, not stored in the Schema.

module.exports = mongoose.model('User', userSchema);