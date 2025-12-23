import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import WeeklyMenu from '../../components/WeeklyMenu/WeeklyMenu';
import DailyTracker from '../../components/DailyTracker/DailyTracker';
import DailyUpload from '../../components/DailyUpload/DailyUpload'; // CHANGED: Importing DailyUpload
import ComplaintBox from '../../components/ComplaintBox/ComplaintBox';
import Reviews from '../../components/Reviews/Reviews';
import { FaTrash } from 'react-icons/fa';
import './HostelDetail.css';

const HostelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await api.get(`/hostels/${id}`);
        setHostel(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHostel();
  }, [id]);

  // Delete Function (DWO Only)
  const handleDelete = async () => {
    if (window.confirm('ARE YOU SURE? This will permanently delete this hostel and all its data.')) {
      try {
        await api.delete(`/hostels/${id}`);
        alert('Hostel deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete hostel');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!hostel) return <div>Hostel not found</div>;

  // --- LOGIC: Get Warden ID safely ---
  // The 'warden' field might be an object (populated) or a string (ID)
  const hostelWardenId = hostel.warden?._id || hostel.warden;

  // Check if DWO
  const isDWO = user && user.role === 'DWO';

  // Check if this user is the specific warden for this hostel
  const isAssignedWarden = user && user.role === 'Warden' && user._id === hostelWardenId;

  return (
    <div className="hostel-detail-page">
      
      {/* Delete Button (DWO) */}
      {isDWO && (
        <button 
          onClick={handleDelete} 
          style={{
            background: '#ff4444', color: 'white', border: 'none', 
            padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',
            float: 'right', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <FaTrash /> Delete Hostel
        </button>
      )}

      <div className="hero-section" style={{ backgroundImage: `url(${hostel.coverImage})` }}>
        <div className="overlay">
            <h1>{hostel.name}</h1>
            <p>{hostel.address}, {hostel.district}</p>
        </div>
      </div>
      
      {/* 1. Daily Tracker */}
      <DailyTracker hostelId={id} />

      {/* 2. Daily Upload (Visible to Assigned Warden OR DWO) */}
      {/* Note: We pass hostelWardenId so the component can double-check security */}
      {(isAssignedWarden || isDWO) && (
        <DailyUpload hostelId={id} hostelWardenId={hostelWardenId} />
      )}

      {/* 3. Weekly Menu */}
      <WeeklyMenu hostelId={id} />

      {/* 4. Complaints */}
      <ComplaintBox hostelId={id} />

      {/* 5. Reviews */}
      <Reviews hostelId={id} />

    </div>
  );
};

export default HostelDetail;