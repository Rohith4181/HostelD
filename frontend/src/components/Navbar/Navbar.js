import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { AppBar, Toolbar, Typography, Container, Box, Button, Tooltip } from '@mui/material';
import { AccountBalance, AccountCircle, Logout as LogoutIcon } from '@mui/icons-material';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" className="navbar-appbar" elevation={3}>
      <Container maxWidth="lg">
        <Toolbar disableGutters className="navbar-toolbar">
          
          {/* --- Logo Area --- */}
          <Box className="nav-logo-area">
            <AccountBalance fontSize="large" className="nav-icon" />
            <Box>
              <Typography variant="h6" component="div" className="nav-title">
                HostelDrishti
              </Typography>
              <Typography variant="caption" className="nav-subtitle">
                Govt. Welfare Monitoring System
              </Typography>
            </Box>
          </Box>

          {/* --- User Controls & Logout --- */}
          <Box className="nav-user-area">
            {user && (
              <Box className="nav-user-info">
                <AccountCircle fontSize="small" />
                <Typography variant="body2" className="nav-username">
                  {user.name} ({user.role})
                </Typography>
              </Box>
            )}
            
            <Tooltip title="Logout">
              <Button 
                color="inherit" 
                onClick={logout} 
                startIcon={<LogoutIcon />}
                className="nav-logout-btn"
                size="small"
              >
                Logout
              </Button>
            </Tooltip>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;