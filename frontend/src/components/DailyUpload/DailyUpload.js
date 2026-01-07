import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';

// Material UI Components
import { 
  Box, Button, TextField, Typography, Alert, CircularProgress, Grid, Paper, Chip
} from '@mui/material';

// Icons
import { CameraAlt, CloudUpload, MyLocation, CheckCircle, PhotoCamera } from '@mui/icons-material';

import './DailyUpload.css';

const DailyUpload = ({ hostelId, hostelWardenId }) => {
  const { user } = useContext(AuthContext);
  
  const [studentCount, setStudentCount] = useState('');
  const [images, setImages] = useState({ breakfast: null, lunch: null, dinner: null });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState('Wait'); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // --- CRITICAL FIX: Robust Security Check ---
  // 1. Get the current user's ID securely
  const currentUserId = user?._id || user?.id;

  // 2. Check Role & ID Match (Converting both to String ensures they match)
  if (!user || user.role !== 'Warden' || String(currentUserId) !== String(hostelWardenId)) {
    return null; // Hide component if not the assigned warden
  }

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImages({ ...images, [e.target.name]: e.target.files[0] });
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    setLocationStatus('Loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus('Success');
      },
      () => {
        setError('GPS Access Denied. Please enable location services.');
        setLocationStatus('Error');
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');

    if (!location.lat) { setError('Please verify location first.'); return; }
    setUploading(true);

    const formData = new FormData();
    formData.append('hostel', hostelId);
    formData.append('studentCount', studentCount);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);
    if (images.breakfast) formData.append('breakfast', images.breakfast);
    if (images.lunch) formData.append('lunch', images.lunch);
    if (images.dinner) formData.append('dinner', images.dinner);

    try {
      await api.post('/daily-performance', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMessage('✅ Verified & Uploaded Successfully!');
      setUploading(false);
      setTimeout(() => window.location.reload(), 1500); 
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <Paper className="daily-upload-wrapper" elevation={0} sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, borderBottom: '2px solid #1976d2', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhotoCamera color="primary" />
          <Typography variant="h6" fontWeight="bold">Daily Data Entry</Typography>
        </Box>
        <Chip label="Today's Log" color="warning" size="small" sx={{ fontWeight: 'bold' }} />
      </Box>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={onSubmit}>
        
        {/* Step 1: Location */}
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3, border: '1px dashed #ccc' }}>
          <Typography variant="subtitle2" gutterBottom>STEP 1: LOCATION VERIFICATION</Typography>
          <Button
            fullWidth
            variant={locationStatus === 'Success' ? "contained" : "outlined"}
            color={locationStatus === 'Success' ? "success" : "primary"}
            onClick={getLocation}
            disabled={locationStatus === 'Success' || locationStatus === 'Loading'}
            startIcon={locationStatus === 'Success' ? <CheckCircle /> : <MyLocation />}
          >
            {locationStatus === 'Loading' ? 'Locating...' : locationStatus === 'Success' ? 'Location Verified' : 'Verify My Location'}
          </Button>
        </Box>

        {/* Step 2: Data Entry (Disabled until Location is verified) */}
        <Box sx={{ opacity: locationStatus !== 'Success' ? 0.5 : 1, pointerEvents: locationStatus !== 'Success' ? 'none' : 'auto' }}>
          
          <TextField
            fullWidth 
            label="Student Attendance Count" 
            type="number"
            value={studentCount} 
            onChange={(e) => setStudentCount(e.target.value)}
            required 
            sx={{ mb: 3 }}
            placeholder="Enter total students present"
          />

          <Typography variant="subtitle2" gutterBottom>Upload Meal Photos</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <Grid item xs={12} sm={4} key={meal}>
                <Button
                  variant="outlined" 
                  component="label" 
                  fullWidth 
                  startIcon={<CameraAlt />}
                  color={images[meal] ? "success" : "primary"}
                  sx={{ 
                    textTransform: 'capitalize', 
                    borderStyle: images[meal] ? 'solid' : 'dashed',
                    borderWidth: '2px'
                  }}
                >
                  {images[meal] ? "Photo Selected" : meal}
                  <input type="file" hidden name={meal} accept="image/*" onChange={onFileChange} />
                </Button>
              </Grid>
            ))}
          </Grid>

          <Button
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            disabled={locationStatus !== 'Success' || uploading}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            {uploading ? 'Uploading Data...' : 'Submit Daily Report'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DailyUpload;