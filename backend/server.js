const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static folder for images (Optional now that we use Cloudinary, but good to keep)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MOUNT ROUTERS ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hostels', require('./routes/hostelRoutes'));
app.use('/api/daily-performance', require('./routes/dailyPerformanceRoutes'));

// ✅ FIXED: This line is now active!
app.use('/api/complaints', require('./routes/complaintRoutes')); 

app.use('/api/menus', require('./routes/menuRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes')); 

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});