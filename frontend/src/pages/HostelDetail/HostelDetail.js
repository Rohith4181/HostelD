import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';

// Leaflet Map Imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Components
import Navbar from '../../components/Navbar/Navbar';
import WeeklyMenu from '../../components/WeeklyMenu/WeeklyMenu';
import DailyTracker from '../../components/DailyTracker/DailyTracker';
import DailyUpload from '../../components/DailyUpload/DailyUpload';
import ComplaintBox from '../../components/ComplaintBox/ComplaintBox';
import Reviews from '../../components/Reviews/Reviews';

// Material UI Components
import {
  Container, Box, Typography, Button, Grid, Card, CardContent, 
  Chip, Avatar, CircularProgress, Paper
} from '@mui/material';

// Icons
import { 
  Delete as DeleteIcon, LocationOn, Person, VerifiedUser, ArrowBack, Phone, Map, RestaurantMenu, ReportProblem 
} from '@mui/icons-material';

import './HostelDetail.css';

// --- Fix for Leaflet Marker Icon ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// -----------------------------------

const HostelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await api.get(`/hostels/${id}`);
        setHostel(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHostel();
  }, [id]);

  // --- Delete Handler ---
  const handleDelete = async () => {
    if (window.confirm('ARE YOU SURE? This will permanently delete this hostel and all its data.')) {
      try {
        await api.delete(`/hostels/${id}`);
        alert('Hostel deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete hostel');
      }
    }
  };

  if (loading) return (
    <Box className="loading-container"><CircularProgress /></Box>
  );

  if (!hostel) return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h5" color="error" gutterBottom>Hostel not found</Typography>
      <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </Container>
  );

  // --- IDs & Role Checks ---
  // 1. Get Hostel Warden ID safely
  const rawWardenId = hostel.warden?._id || hostel.warden;
  const hostelWardenId = rawWardenId ? rawWardenId.toString() : null;

  // 2. Get Current User ID safely
  const rawUserId = user?._id || user?.id;
  const currentUserId = rawUserId ? rawUserId.toString() : null;

  // 3. Perform Checks
  const isDWO = user && user.role === 'DWO';
  const isAssignedWarden = user && user.role === 'Warden' && currentUserId === hostelWardenId;
  const isStudent = user && user.role === 'Student';

  // --- Geolocation Check ---
  const hasLocation = hostel.latitude && hostel.longitude;

  return (
    <div className="hostel-detail-wrapper">
      
      <Navbar />

      <Container maxWidth="lg" className="main-content" sx={{ mt: 4, mb: 4 }}>
        
        {/* --- 1. Header Section --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/dashboard')} 
              sx={{ mb: 1, color: '#666' }}
            >
              Back
            </Button>
            <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              {hostel.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#455a64' }}>
              <LocationOn fontSize="medium" sx={{ mr: 1, color: '#d32f2f' }} />
              <Typography variant="h6" fontWeight="500">
                {hostel.address}, {hostel.district}
              </Typography>
            </Box>
          </Box>

          {isDWO && (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />} 
              onClick={handleDelete}
              sx={{ mt: 2 }}
            >
              Delete Hostel
            </Button>
          )}
        </Box>

        {/* --- 2. Info Bar (Warden Details) --- */}
        <Paper elevation={0} className="info-bar" sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderLeft: '6px solid #1976d2' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box className="warden-info" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 56, height: 56 }}><Person fontSize="large" /></Avatar>
                <Box>
                  <Typography variant="overline" display="block" color="textSecondary" sx={{ letterSpacing: 1.5, fontSize: '0.8rem' }}>
                    ASSIGNED WARDEN
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#333">
                    {hostel.warden?.name || "Not Assigned"}
                  </Typography>
                  {hostel.warden?.contactNumber && (
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body1" color="textSecondary">
                        {hostel.warden.contactNumber}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
               <Chip icon={<VerifiedUser />} label="Government Verified Facility" color="success" variant="outlined" sx={{ fontSize: '1rem', padding: '10px' }} />
            </Grid>
          </Grid>
        </Paper>

        {/* --- 3. FULL WIDTH VERTICAL STACK --- */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* A. MAP CARD (Visible ONLY to Students) */}
          {isStudent && (
            <Card elevation={2} className="full-width-card" sx={{ overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Map color="primary" />
                <Typography variant="h6" fontWeight="bold">Hostel Location</Typography>
              </Box>
              {hasLocation ? (
                <Box sx={{ height: '350px', width: '100%' }}>
                  <MapContainer 
                    center={[hostel.latitude, hostel.longitude]} 
                    zoom={15} 
                    scrollWheelZoom={false} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[hostel.latitude, hostel.longitude]}>
                      <Popup>
                        <strong>{hostel.name}</strong><br />
                        {hostel.address}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </Box>
              ) : (
                  <Box sx={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="body1" color="textSecondary">Location data not available</Typography>
                  </Box>
              )}
            </Card>
          )}

          {/* B. Daily Tracker */}
          <Box className="section-box">
             <DailyTracker hostelId={id} />
          </Box>

          {/* C. Daily Upload (Visible to Warden/DWO) */}
          {(isAssignedWarden || isDWO) && (
            <Box className="section-box">
              <DailyUpload hostelId={id} hostelWardenId={hostelWardenId} />
            </Box>
          )}

          {/* D. Weekly Menu */}
          <Card elevation={2} className="full-width-card">
            <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantMenu color="primary" />
              <Typography variant="h6" fontWeight="bold">Weekly Food Menu</Typography>
            </Box>
            <CardContent>
              <WeeklyMenu hostelId={id} />
            </CardContent>
          </Card>

          {/* E. Complaint Box */}
          <Card elevation={2} className="full-width-card">
            <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReportProblem color="error" />
              <Typography variant="h6" fontWeight="bold" color="error">Report Issues & Complaints</Typography>
            </Box>
            <CardContent>
              <ComplaintBox hostelId={id} />
            </CardContent>
          </Card>

          {/* F. Reviews */}
          <Box className="section-box">
            <Reviews hostelId={id} />
          </Box>

        </Box> 
        {/* End Vertical Stack */}

      </Container>
    </div>
  );
};

export default HostelDetail;