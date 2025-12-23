import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import './ComplaintBox.css';
import { FaExclamationCircle, FaCheckCircle, FaUserSecret } from 'react-icons/fa';

const ComplaintBox = ({ hostelId }) => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [description, setDescription] = useState('');
  
  // CHANGED: 'type' is now 'category' to match your Schema
  const [category, setCategory] = useState('Food'); 
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // This now matches the backend route /:hostelId
        const res = await api.get(`/complaints/${hostelId}`);
        setComplaints(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching complaints", err);
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [hostelId]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/complaints', {
        hostel: hostelId,
        category, // Sending 'category' instead of 'type'
        description,
        isAnonymous
      });
      setComplaints([res.data.data, ...complaints]);
      setDescription('');
      alert('Complaint Registered Successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post complaint');
    }
  };

  // Handle Resolve (Warden/DWO)
  const markResolved = async (id) => {
    try {
      const res = await api.put(`/complaints/${id}`, { status: 'Resolved' });
      setComplaints(complaints.map(c => c._id === id ? res.data.data : c));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="complaint-section">
      <h3><FaExclamationCircle /> Student Complaints & Issues</h3>

      {/* Form: Only for Students */}
      {user && user.role === 'Student' && (
        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="form-row">
            {/* Updated Options to match your Schema Enums */}
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food">Food Quality</option>
              <option value="Hygiene">Hygiene / Cleanliness</option>
              <option value="Infrastructure">Infrastructure (Water/Electricity)</option>
              <option value="Harassment">Harassment</option>
              <option value="Other">Other</option>
            </select>
            
            <label className="anon-toggle">
              <input 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={(e) => setIsAnonymous(e.target.checked)} 
              />
              Post Anonymously <FaUserSecret />
            </label>
          </div>
          <textarea 
            placeholder="Describe the issue clearly..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Post Complaint</button>
        </form>
      )}

      {/* Complaint List */}
      <div className="complaint-list">
        {loading ? <p>Loading...</p> : complaints.length === 0 ? <p>No complaints yet.</p> : (
          complaints.map(c => (
            <div key={c._id} className={`complaint-card ${c.status.toLowerCase()}`}>
              <div className="c-header">
                {/* Display Category */}
                <span className="c-type">{c.category}</span>
                <span className={`c-status ${c.status}`}>{c.status}</span>
              </div>
              <p className="c-desc">{c.description}</p>
              <div className="c-footer">
                <small>
                  By: {c.isAnonymous ? "Anonymous Student" : c.student?.name || "Student"} 
                </small>
                
                {/* Resolve Button: For Warden OR DWO */}
                {user && (user.role === 'Warden' || user.role === 'DWO') && c.status === 'Open' && (
                  <button className="btn-resolve" onClick={() => markResolved(c._id)}>
                    <FaCheckCircle /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintBox;