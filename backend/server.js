const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const path = require('path'); // Required for image uploads
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- 1. MIDDLEWARE (MUST BE AT THE TOP) ---
app.use(express.json()); // Allows us to accept JSON data
app.use(cors()); // Allows frontend to communicate with backend

// --- 2. STATIC FOLDERS ---
// This makes the 'uploads' folder accessible to the browser for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. MOUNT ROUTERS ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hostels', require('./routes/hostelRoutes'));
app.use('/api/daily-performance', require('./routes/dailyPerformanceRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes')); // Uncomment when you create this file
app.use('/api/menus', require('./routes/menuRoutes')); // Plural 'menus' matches Frontend
app.use('/api/reviews', require('./routes/reviewRoutes'));

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});