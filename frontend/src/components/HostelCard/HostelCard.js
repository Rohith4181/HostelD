import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import './HostelCard.css';

const HostelCard = ({ hostel }) => {
  // Health Score Logic: Green if rating >= 3, Red if < 3
  const healthColor = hostel.averageRating >= 3 ? '#28a745' : '#dc3545';

  return (
    <div className="hostel-card">
      <div className="card-image-container">
        <img src={hostel.coverImage} alt={hostel.name} className="card-image" />
        <div className="health-badge" style={{ backgroundColor: healthColor }}>
          <span className="dot"></span> Health Score
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{hostel.name}</h3>
        
        <div className="card-info">
          <span className="location">
            <FaMapMarkerAlt /> {hostel.district}, {hostel.state}
          </span>
          <span className="rating">
            <FaStar className="star-icon" /> {hostel.averageRating.toFixed(1)}
          </span>
        </div>

        <Link to={`/hostel/${hostel._id}`} className="btn-view">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HostelCard;