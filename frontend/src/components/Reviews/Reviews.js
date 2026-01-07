import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import './Reviews.css';

// Material UI
import { 
  Box, Typography, TextField, Button, Rating, Avatar, 
  List, ListItem, ListItemAvatar, ListItemText, Divider, IconButton 
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const Reviews = ({ hostelId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${hostelId}`);
        setReviews(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchReviews();
  }, [hostelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/reviews/${hostelId}`, { rating, comment });
      // Prepend new review to the list immediately
      setReviews([res.data.data, ...reviews]);
      setComment('');
      window.location.reload(); 
    } catch (err) { 
      alert(err.response?.data?.error || 'Error adding review'); 
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (reviewId) => {
    if(!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      // Remove from UI immediately
      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const currentUserId = user?._id || user?.id;

  return (
    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Student Reviews ({reviews.length})</Typography>
      </Box>

      {/* Review Form */}
      {user && user.role === 'Student' && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Write a Review</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating value={Number(rating)} onChange={(e, val) => setRating(val)} />
          </Box>
          <TextField
            fullWidth multiline rows={2}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            sx={{ mb: 2, bgcolor: 'white' }}
          />
          <Button type="submit" variant="contained" size="small">Submit Review</Button>
        </Box>
      )}

      {/* Review List */}
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {reviews.length === 0 ? <Typography variant="body2" color="textSecondary">No reviews yet.</Typography> : null}
        
        {reviews.map((r, index) => {
          // Check ownership: handle populated user object vs string ID
          const reviewUserId = r.user._id || r.user; 
          const isOwner = String(currentUserId) === String(reviewUserId);

          return (
            <React.Fragment key={r._id}>
              <ListItem 
                alignItems="flex-start"
                secondaryAction={
                  isOwner && (
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(r._id)}>
                      <Delete color="error" fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: isOwner ? '#1976d2' : '#bdbdbd' }}>
                    {r.user?.name?.[0] || 'S'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 4 }}>
                      <Typography variant="subtitle2">
                        {r.user?.name || "Student"} {isOwner && "(You)"}
                      </Typography>
                      <Rating value={r.rating} readOnly size="small" />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="textPrimary" sx={{ mt: 0.5 }}>
                        {r.comment}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 0.5 }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default Reviews;