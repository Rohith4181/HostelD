import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../utils/api';
import './AddHostel.css';

const AddHostel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState(''); // New Address State
  const [warden, setWarden] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null); // File Object

  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Unassigned Wardens
  useEffect(() => {
    if (user && user.role !== 'DWO') {
      navigate('/dashboard');
      return;
    }

    const fetchWardens = async () => {
      try {
        const res = await api.get('/hostels/wardens/unassigned');
        setWardens(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch wardens");
        setLoading(false);
      }
    };

    fetchWardens();
  }, [user, navigate]);

  const onFileChange = (e) => {
    setCoverImageFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('district', district);
    formData.append('state', state);
    formData.append('address', address);
    formData.append('warden', warden);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('coverImage', coverImageFile);

    try {
      await api.post('/hostels', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create hostel');
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="add-hostel-page">
      <div className="form-card">
        <h2>Register New Hostel</h2>
        <p className="subtitle">Enter details and assign a warden.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Hostel Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. BC Welfare Boys Hostel"
            />
          </div>

          {/* New Address Field */}
          <div className="form-group">
            <label>Full Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Street, Landmark, Area..."
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            ></textarea>
          </div>

          <div className="row">
            <div className="form-group half">
              <label>District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
            <div className="form-group half">
              <label>State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Assign Warden</label>
            <select value={warden} onChange={(e) => setWarden(e.target.value)} required>
              <option value="">-- Select a Warden --</option>
              {wardens.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} (Ph: {w.contactNumber || 'N/A'})
                </option>
              ))}
            </select>
            {wardens.length === 0 && (
              <small className="warning-text">No unassigned wardens available.</small>
            )}
          </div>

          <div className="row">
            <div className="form-group half">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                placeholder="17.4375"
              />
            </div>
            <div className="form-group half">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                placeholder="78.4482"
              />
            </div>
          </div>

          {/* New File Upload Field */}
          <div className="form-group">
            <label>Cover Image (Upload)</label>
            <input
              type="file"
              onChange={onFileChange}
              required
              accept="image/*"
            />
          </div>

          <button type="submit" className="btn-submit">Save Hostel</button>
        </form>
      </div>
    </div>
  );
};

export default AddHostel;