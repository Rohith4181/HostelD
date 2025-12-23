import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Material UI Components
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Grid
} from '@mui/material';

// Material UI Icons
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AccountBalance,
  Login as LoginIcon
} from '@mui/icons-material';

import './Login.css';

const Login = () => {
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [localError, setLocalError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { email, password } = formData;

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setOpenSnackbar(true);
      setLoading(false);
    }
  }, [error]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setOpenSnackbar(false);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validateForm = () => {
    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      setOpenSnackbar(true);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard'); 
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false);
      setLocalError("Something went wrong. Please check your connection.");
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Container maxWidth="xs" className="login-container">
        
        <Card className="login-card" elevation={5}>
          <CardContent className="login-content">
            
            <Box className="login-header">
              <AccountBalance className="govt-logo-icon" fontSize="large" />
              <Typography variant="h5" className="login-title">
                HostelDrishti
              </Typography>
              <Typography variant="body2" className="login-subtitle">
                Official Government Portal Login
              </Typography>
            </Box>

            <form onSubmit={onSubmit} noValidate>
              <Grid container spacing={3}>
                
                {/* --- Email Field --- */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    // FIX 1: Explicit ID for label association
                    id="email" 
                    label="Email Address"
                    name="email"
                    type="email"
                    // FIX 2: Autocomplete tells browser this is an email
                    autoComplete="email" 
                    value={email}
                    onChange={onChange}
                    variant="outlined"
                    placeholder="officer@govt.in"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* --- Password Field --- */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    // FIX 1: Explicit ID
                    id="password" 
                    label="Password"
                    name="password"
                    // FIX 2: Autocomplete for password managers
                    autoComplete="current-password" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={onChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    className="login-btn"
                    disabled={loading}
                    startIcon={!loading && <LoginIcon />}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Secure Login'}
                  </Button>
                </Grid>

              </Grid>
            </form>

            <Box className="login-footer">
              <Typography variant="body2">
                New User?{' '}
                <Link to="/register" className="register-link">
                  Register Official Account
                </Link>
              </Typography>
            </Box>

          </CardContent>
        </Card>

        <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: '#666' }}>
          © 2025 Department of Social Welfare. All Rights Reserved.
        </Typography>

      </Container>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%' }}>
          {localError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;