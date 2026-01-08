const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load Models
const User = require('./models/User');
const Hostel = require('./models/Hostel');
const Menu = require('./models/Menu');
const Review = require('./models/Review');
const Complaint = require('./models/Complaint');
const DailyPerformance = require('./models/DailyPerformance');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Import Data
const importData = async () => {
  try {
    // ---------------------------------------------------------
    // 1. FIX: Drop the Users collection to remove old indexes
    // ---------------------------------------------------------
    try {
      await User.collection.drop();
      console.log('User Collection & Indexes Dropped...'.blue);
    } catch (e) {
      if (e.code === 26) {
        console.log('User collection did not exist, skipping...'.grey);
      } else {
        throw e;
      }
    }

    // Do the same for Hostels (as you had before)
    try {
      await Hostel.collection.drop(); 
      console.log('Hostel Collection & Indexes Dropped...'.blue);
    } catch (e) {
      if (e.code === 26) { 
        console.log('Hostel collection did not exist, skipping...'.grey);
      } else {
        throw e;
      }
    }

    await Menu.deleteMany();
    await Review.deleteMany();
    await Complaint.deleteMany();
    await DailyPerformance.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // 2. Create Users (Password: 123456)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const users = await User.create([
      {
        name: 'District Officer (DWO)',
        email: 'dwo@admin.com',
        password: hashedPassword,
        role: 'DWO'
      },
      {
        name: 'Ramesh Warden',
        email: 'warden@hostel.com',
        password: hashedPassword,
        role: 'Warden',
        contactNumber: '9988776655'
      },
      {
        name: 'Suresh Student',
        email: 'student@college.com',
        password: hashedPassword,
        role: 'Student'
      }
    ]);

    console.log('Users Created...'.green);

    // 3. Create a Hostel (Assigned to Ramesh Warden)
    const hostel = await Hostel.create({
      name: 'BC Welfare Boys Hostel, Ameerpet',
      district: 'Hyderabad',
      state: 'Telangana',
      address: 'Lane No 5, Satyam Theatre Road, Ameerpet, Hyderabad', 
      warden: users[1]._id, 
      latitude: 17.4375,
      longitude: 78.4482,
      coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
      averageRating: 4,
      numOfReviews: 1
    });

    console.log('Hostel Created...'.green);

    // 4. Create a Menu for that Hostel
    await Menu.create({
      hostel: hostel._id,
      weeklyMenu: [
        { day: 'Monday', breakfast: 'Idli', lunch: 'Rice & Dal', dinner: 'Veg Curry' },
        { day: 'Tuesday', breakfast: 'Upma', lunch: 'Sambar Rice', dinner: 'Egg Curry' },
      ]
    });

    console.log('Menu Created...'.green);

    // 5. Create a Review
    await Review.create({
      hostel: hostel._id,
      user: users[2]._id, // The Student
      rating: 4,
      comment: 'Food is good but water problem in morning.'
    });

    console.log('Review Created...'.green);

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Run the function
importData();