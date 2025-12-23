import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- Added useNavigate
import AuthContext from '../../context/AuthContext';
import HostelCard from '../../components/HostelCard/HostelCard';
import Navbar from '../../components/Navbar/Navbar';
import api from '../../utils/api';

// Material UI Components
import {
  Container,
  TextField,
  Button,
  Grid,
  Box,
  InputAdornment,
  CircularProgress,
  Paper,
  Typography
} from '@mui/material';

// Icons
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

// CSS
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // <--- Initialize hook

  // --- 1. NEW LOGIC: Redirect if not logged in ---
  useEffect(() => {
    // If user data is missing (logged out), go to Login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // --- 2. EXISTING LOGIC: Fetch Hostels ---
  const [hostels, setHostels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if user exists to avoid errors during redirect
    if (!user) return; 

    const fetchHostels = async () => {
      try {
        const endpoint = searchTerm ? `/hostels?search=${searchTerm}` : '/hostels';
        const res = await api.get(endpoint);
        setHostels(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hostels", err);
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => fetchHostels(), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, user]); // Added 'user' dependency

  // If redirecting, return null to prevent flash of content
  if (!user) return null;

  return (
    <div className="dashboard-page-wrapper">
      
      <Navbar /> 

      <Container maxWidth="lg" className="main-content">
        
        {/* Action Bar */}
        <Paper elevation={1} className="action-bar-paper">
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by district or hostel name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                  ),
                }}
                className="search-field"
              />
            </Grid>

            {user?.role === 'DWO' && (
              <Grid item xs={12} md={3} className="add-btn-container">
                <Button
                  component={Link}
                  to="/add-hostel"
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  fullWidth
                  className="add-hostel-btn"
                >
                  Add New Hostel
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Content Area */}
        <Box className="hostel-grid-area">
          {loading ? (
            <Box className="loading-container">
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>Loading hostels...</Typography>
            </Box>
          ) : (
            <>
              {hostels.length > 0 ? (
                <Grid container spacing={3}>
                  {hostels.map((hostel) => (
                    <Grid item xs={12} sm={6} md={4} key={hostel._id}>
                      <HostelCard hostel={hostel} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box className="no-data-container">
                  <Typography variant="h6" color="textSecondary">No hostels found.</Typography>
                </Box>
              )}
            </>
          )}
        </Box>

      </Container>
    </div>
  );
};

export default Dashboard;