import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Logout, Dashboard, AccountBalance } from '@mui/icons-material';

// Import the CSS file
import './Navbar.css'; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <AppBar position="static" className="navbar-container">
      <Toolbar>
        
        {/* --- LOGO AREA --- */}
        <Box 
          component={Link} 
          to="/" 
          className="nav-logo-area"
        >
          {/* Logo Icon - White Color via CSS */}
          <AccountBalance fontSize="large" className="nav-icon" />
          
          <Box>
            <Typography variant="h6" component="div" className="nav-title">
              HostelDrishti
            </Typography>
            <Typography variant="caption" className="nav-subtitle">
              SC/ST/BC Welfare Department
            </Typography>
          </Box>
        </Box>

        {/* --- NAVIGATION LINKS --- */}
        <Box display="flex" alignItems="center" gap={2}>
          
          {user ? (
            <>
              {/* User Info Badge */}
              <Box className="user-badge">
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#ffc107', fontSize: 16, color: '#000' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    {user.role}
                  </Typography>
                </Box>
              </Box>

              <Button 
                color="inherit" 
                startIcon={<Dashboard />} 
                component={Link} 
                to="/dashboard"
                className="nav-btn"
              >
                Dashboard
              </Button>

              <Button 
                variant="contained" 
                size="small" 
                startIcon={<Logout />} 
                onClick={handleLogout} 
                className="logout-btn"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" className="nav-btn">Login</Button>
              <Button 
                color="inherit" 
                variant="outlined" 
                component={Link} 
                to="/register" 
                className="register-btn"
              >
                Register
              </Button>
            </>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;