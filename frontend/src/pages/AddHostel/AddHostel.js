import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';

// Material UI Components
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';

// Material UI Icons
import {
  Domain,
  Place,
  Person,
  Map,
  CloudUpload,
  Save,
  LocationCity,
  Home
} from '@mui/icons-material';

// Import CSS
import './AddHostel.css';

const AddHostel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- EXISTING STATE (Preserved) ---
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [warden, setWarden] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);

  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- EXISTING LOGIC: Fetch Unassigned Wardens ---
  useEffect(() => {
    if (user && user.role !== 'DWO') {
      navigate('/dashboard');
      return;
    }

    const fetchWardens = async () => {
      try {
        const res = await api.get('/hostels/wardens/unassigned');
        setWardens(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch wardens");
        setLoading(false);
      }
    };

    fetchWardens();
  }, [user, navigate]);

  // --- EXISTING HANDLERS ---
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('district', district);
    formData.append('state', state);
    formData.append('address', address);
    formData.append('warden', warden);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('coverImage', coverImageFile);

    try {
      await api.post('/hostels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create hostel');
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading resources...</Typography>
      </Box>
    );
  }

  // --- RENDER UI ---
  return (
    <div className="add-hostel-page-wrapper">
      <Container maxWidth="md">
        
        <Card className="form-card" elevation={4}>
          <CardContent className="form-content">
            
            {/* Header */}
            <Box className="form-header">
              <Domain className="header-icon" />
              <Typography variant="h5" className="header-title">
                Register New Hostel
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Enter facility details and assign an official warden.
              </Typography>
            </Box>

            <Divider className="header-divider" />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={onSubmit} encType="multipart/form-data">
              <Grid container spacing={3}>

                {/* --- Section 1: Basic Info --- */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hostel Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. BC Welfare Boys Hostel"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Address"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Street, Landmark, Area..."
                  />
                </Grid>

                {/* --- Section 2: Location --- */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Map color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* --- Section 3: Warden Assignment --- */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Assign Warden"
                    value={warden}
                    onChange={(e) => setWarden(e.target.value)}
                    required
                    helperText="Select a warden from the unassigned list"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="">
                      <em>-- Select a Warden --</em>
                    </MenuItem>
                    {wardens.map((w) => (
                      <MenuItem key={w._id} value={w._id}>
                        {w.name} (Ph: {w.contactNumber || 'N/A'})
                      </MenuItem>
                    ))}
                  </TextField>
                  {wardens.length === 0 && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      * No unassigned wardens available.
                    </Typography>
                  )}
                </Grid>

                {/* --- Section 4: Geolocation --- */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                    placeholder="17.4375"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Place color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                    placeholder="78.4482"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Place color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* --- Section 5: Image Upload --- */}
                <Grid item xs={12}>
                  <Box className="file-upload-box">
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUpload />}
                      className="upload-btn"
                    >
                      Upload Cover Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={onFileChange}
                        required
                      />
                    </Button>
                    {coverImageFile && (
                      <Typography variant="body2" className="file-name">
                        Selected: {coverImageFile.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* --- Submit Button --- */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    className="submit-btn"
                    startIcon={<Save />}
                    disabled={wardens.length === 0 && !warden} // Optional safety check
                  >
                    Save Hostel Registration
                  </Button>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default AddHostel;