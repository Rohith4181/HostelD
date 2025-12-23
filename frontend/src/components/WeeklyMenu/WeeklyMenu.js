import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';

// Material UI Components
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, Button, TextField, Box, CircularProgress, Tooltip
} from '@mui/material';

import { Edit, Save, Cancel, RestaurantMenu, Delete } from '@mui/icons-material';
import './WeeklyMenu.css';

// Define static data OUTSIDE component
const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyMenu = ({ hostelId }) => {
  const { user } = useContext(AuthContext);
  
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hostelWardenId, setHostelWardenId] = useState(null);

  // Calculate "Today"
  const todayIndex = new Date().getDay() - 1; 
  const today = daysOrder[todayIndex < 0 ? 6 : todayIndex];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Hostel (To Verify Permissions)
        const hostelRes = await api.get(`/hostels/${hostelId}`);
        const wId = hostelRes.data.data.warden?._id || hostelRes.data.data.warden;
        setHostelWardenId(wId);

        // 2. Get Menu
        const menuRes = await api.get(`/menus/${hostelId}`);
        if (menuRes.data.data && menuRes.data.data.weeklyMenu.length > 0) {
          setMenuData(menuRes.data.data.weeklyMenu);
        } else {
          // Empty Template if no menu exists (Use "-" to satisfy backend requirements)
          setMenuData(daysOrder.map(day => ({ day, breakfast: '-', lunch: '-', dinner: '-' })));
        }
        setLoading(false);
      } catch (err) {
        // Fallback for 404 (No menu found)
        setMenuData(daysOrder.map(day => ({ day, breakfast: '-', lunch: '-', dinner: '-' })));
        setLoading(false);
      }
    };
    fetchData();
  }, [hostelId]);

  // --- Handlers ---
  const handleInputChange = (index, field, value) => {
    const updatedMenu = [...menuData];
    updatedMenu[index][field] = value;
    setMenuData(updatedMenu);
  };

  const handleSave = async () => {
    setSaving(true);

    // --- SANITIZATION FIX ---
    // Ensure no field is empty string "" because backend forbids it.
    // Replace empty strings with "-"
    const sanitizedMenu = menuData.map(dayItem => ({
      ...dayItem,
      breakfast: dayItem.breakfast.trim() === '' ? '-' : dayItem.breakfast,
      lunch: dayItem.lunch.trim() === '' ? '-' : dayItem.lunch,
      dinner: dayItem.dinner.trim() === '' ? '-' : dayItem.dinner
    }));

    try {
      await api.post('/menus', { hostelId, weeklyMenu: sanitizedMenu });
      // Update local state with sanitized version
      setMenuData(sanitizedMenu);
      setIsEditing(false);
      alert('Menu updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to update menu. Please fill all fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Are you sure? This will delete the entire menu for this hostel.")) return;
    
    setSaving(true);
    try {
      await api.delete(`/menus/${hostelId}`);
      // Reset to empty with dashes
      setMenuData(daysOrder.map(day => ({ day, breakfast: '-', lunch: '-', dinner: '-' })));
      alert('Menu deleted successfully');
    } catch (err) {
      alert('Failed to delete menu');
    } finally {
      setSaving(false);
    }
  };

  // --- ROBUST ID CHECK ---
  const currentUserId = user?._id || user?.id;
  const isWarden = user?.role === 'Warden' && currentUserId === hostelWardenId;

  if (loading) return <Box textAlign="center" p={2}><CircularProgress size={20} /></Box>;

  return (
    <Box>
      {/* Header Actions */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
           <RestaurantMenu color="primary" fontSize="small" />
           <span style={{ fontWeight: 600, color: '#555' }}>Weekly Schedule</span>
        </Box>

        {/* Buttons for Warden */}
        {isWarden && !isEditing && (
          <Box>
            <Tooltip title="Clear all menu data">
              <Button 
                startIcon={<Delete />} 
                size="small" 
                color="error" 
                onClick={handleDelete}
                sx={{ mr: 1 }}
              >
                Clear
              </Button>
            </Tooltip>
            <Button 
              startIcon={<Edit />} 
              size="small" 
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              Add / Edit
            </Button>
          </Box>
        )}

        {/* Editing Actions */}
        {isEditing && (
          <Box display="flex" gap={1}>
            <Button 
              startIcon={<Cancel />} 
              size="small" 
              color="inherit" 
              onClick={() => { setIsEditing(false); window.location.reload(); }}
            >
              Cancel
            </Button>
            <Button 
              startIcon={saving ? <CircularProgress size={16} color="inherit"/> : <Save />} 
              size="small" 
              variant="contained" 
              color="success"
              onClick={handleSave}
              disabled={saving}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      {/* Data Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f4f6f8' }}>
              <TableCell width="15%"><strong>Day</strong></TableCell>
              <TableCell><strong>Breakfast</strong></TableCell>
              <TableCell><strong>Lunch</strong></TableCell>
              <TableCell><strong>Dinner</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuData.map((row, index) => (
              <TableRow key={row.day} sx={{ bgcolor: row.day === today ? '#e8f5e9' : 'inherit' }}>
                
                <TableCell>
                  {row.day}
                  {row.day === today && <Chip label="Today" color="success" size="small" sx={{ ml: 1, height: 18, fontSize: '0.6rem' }} />}
                </TableCell>

                {/* Editable Columns */}
                {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                  <TableCell key={mealType}>
                    {isEditing ? (
                      <TextField 
                        variant="standard" 
                        fullWidth 
                        multiline
                        value={row[mealType] === '-' ? '' : row[mealType]} // Show empty input if value is just "-"
                        onChange={(e) => handleInputChange(index, mealType, e.target.value)}
                        placeholder="--"
                        InputProps={{ disableUnderline: true, style: { fontSize: '0.9rem', background: '#fafafa', padding: '4px' } }}
                      />
                    ) : (
                      <span style={{ color: row[mealType] && row[mealType] !== '-' ? 'inherit' : '#aaa' }}>
                        {row[mealType] || '-'}
                      </span>
                    )}
                  </TableCell>
                ))}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WeeklyMenu;