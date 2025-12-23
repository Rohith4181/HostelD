import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';
import { FaCamera, FaUpload, FaMapMarkerAlt } from 'react-icons/fa';
import './DailyUpload.css';

const DailyUpload = ({ hostelId, hostelWardenId }) => {
  const { user } = useContext(AuthContext);
  
  const [studentCount, setStudentCount] = useState('');
  const [images, setImages] = useState({
    breakfast: null,
    lunch: null,
    dinner: null
  });
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState('Wait'); // Wait | Loading | Success | Error
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Security Check inside Component
  if (!user || user.role !== 'Warden' || user._id !== hostelWardenId) {
    return null;
  }

  const onFileChange = (e) => {
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLocationStatus('Loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('Success');
      },
      () => {
        setError('Unable to retrieve location. Please allow GPS access.');
        setLocationStatus('Error');
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!location.lat || !location.lng) {
      setError('Please verify your location first.');
      return;
    }

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
      await api.post('/daily-performance', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('✅ Verified & Uploaded! Data is live.');
      setUploading(false);
      setTimeout(() => window.location.reload(), 1500); 
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="daily-upload-card">
      <div className="upload-header">
        <h3><FaCamera /> Warden's Daily Upload</h3>
        <span className="badge">Today's Entry</span>
      </div>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="location-section">
          <p>Step 1: Verify Presence</p>
          <button 
            type="button" 
            className={`btn-location ${locationStatus}`}
            onClick={getLocation}
            disabled={locationStatus === 'Success'}
          >
            <FaMapMarkerAlt /> 
            {locationStatus === 'Success' ? ' Location Verified' : ' Check My Location'}
          </button>
        </div>

        <div className="form-group">
          <label>Student Attendance Count</label>
          <input 
            type="number" 
            value={studentCount} 
            onChange={(e) => setStudentCount(e.target.value)}
            required 
            placeholder="e.g. 45"
            disabled={locationStatus !== 'Success'}
          />
        </div>

        <div className="url-inputs">
          <div className="form-group">
            <label>Breakfast Photo</label>
            <input type="file" name="breakfast" onChange={onFileChange} accept="image/*" disabled={locationStatus !== 'Success'} />
          </div>
          <div className="form-group">
            <label>Lunch Photo</label>
            <input type="file" name="lunch" onChange={onFileChange} accept="image/*" disabled={locationStatus !== 'Success'} />
          </div>
          <div className="form-group">
            <label>Dinner Photo</label>
            <input type="file" name="dinner" onChange={onFileChange} accept="image/*" disabled={locationStatus !== 'Success'} />
          </div>
        </div>

        <button type="submit" className="btn-upload" disabled={locationStatus !== 'Success' || uploading}>
          <FaUpload /> {uploading ? 'Verifying & Uploading...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default DailyUpload;