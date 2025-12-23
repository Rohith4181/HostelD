import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

// Material UI Components
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';

// Material UI Icons
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Badge,
  VpnKey,
  AccountBalance
} from '@mui/icons-material';

// Import CSS
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext); // Using Register function from your Context

  // --- State Management ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    secretCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Snackbar State for Success/Error messages
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success' | 'error' | 'warning' | 'info'
  });

  // --- Destructuring for easier access ---
  const { name, email, password, confirmPassword, role, secretCode } = formData;

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for that field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // --- Validation Logic ---
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = "Full Name is required";
      isValid = false;
    }

    // Basic Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Secret Code Required for Warden & DWO
    if (role !== 'Student' && !secretCode.trim()) {
      tempErrors.secretCode = `Secret Code required for ${role}`;
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // NOTE: Passing role-based secret code to backend logic
      // Assuming your 'register' function takes these arguments
      const success = await register(name, email, password, role, secretCode);
      
      if (success) {
        setSnackbar({ open: true, message: 'Registration Successful! Redirecting...', severity: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setSnackbar({ open: true, message: 'Registration failed. Try again.', severity: 'error' });
        setLoading(false);
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Something went wrong', severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <Container maxWidth="sm" className="register-container">
        <Card className="register-card" elevation={4}>
          <CardContent className="register-content">
            
            {/* --- Header Section --- */}
            <Box className="register-header">
              <AccountBalance className="govt-icon" fontSize="large" />
              <Typography variant="h4" className="header-title">
                HostelDrishti
              </Typography>
              <Typography variant="subtitle1" className="header-subtitle">
                Government Welfare Monitoring System
              </Typography>
            </Box>

            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                
                {/* --- Role Selection --- */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Select Your Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role"
                      name="role"
                      value={role}
                      label="Select Your Role"
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <Badge color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Student">Student</MenuItem>
                      <MenuItem value="Warden">Warden</MenuItem>
                      <MenuItem value="DWO">District Welfare Officer (DWO)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* --- Full Name --- */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* --- Email --- */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* --- Password --- */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* --- Confirm Password --- */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* --- Secret Code (Conditional) --- */}
                {role !== 'Student' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={`${role} Secret Code`}
                      name="secretCode"
                      type="password"
                      value={secretCode}
                      onChange={handleChange}
                      error={!!errors.secretCode}
                      helperText={errors.secretCode || "Required for official access validation"}
                      color="warning" 
                      focused={true}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKey color="warning" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}

                {/* --- Submit Button --- */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
                  </Button>
                </Grid>

              </Grid>
            </form>

            {/* --- Footer Links --- */}
            <Box className="register-footer">
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Login Here
                </Link>
              </Typography>
            </Box>

          </CardContent>
        </Card>
      </Container>

      {/* --- Notification Snackbar --- */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;