import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import './Reviews.css';
import { FaStar } from 'react-icons/fa';

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
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, [hostelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/reviews/${hostelId}`, { rating, comment });
      setReviews([res.data.data, ...reviews]); // Add new review to list
      setComment('');
      alert('Review Added!');
      // Reload page to see updated Average Rating in the header
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding review');
    }
  };

  return (
    <div className="reviews-section">
      <h3>Reviews & Ratings ({reviews.length})</h3>

      {/* Form: Only Students can review */}
      {user && user.role === 'Student' && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h4>Write a Review</h4>
          <div className="rating-select">
            <label>Rating: </label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>
          <textarea 
            placeholder="Share your experience..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      )}

      {/* List: Visible to everyone */}
      <div className="review-list">
        {reviews.map((r) => (
          <div key={r._id} className="review-card">
            <div className="r-header">
              <strong>{r.user?.name || "Student"}</strong>
              <span className="star-display"><FaStar color="#ffc107"/> {r.rating}</span>
            </div>
            <p>{r.comment}</p>
            <small className="r-date">{new Date(r.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;