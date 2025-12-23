import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import HostelCard from '../../components/HostelCard/HostelCard';
import api from '../../utils/api';
import { FaSearch, FaPlus } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [hostels, setHostels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Hostels on Load & Search
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        // Append search query if exists
        const endpoint = searchTerm 
          ? `/hostels?search=${searchTerm}` 
          : '/hostels';
        
        const res = await api.get(endpoint);
        setHostels(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hostels", err);
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid too many API calls
    const timer = setTimeout(() => {
        fetchHostels();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="dashboard-page">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>HostelDrishti Dashboard</h1>
          <div className="user-controls">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Action Bar: Search + Add Button */}
        <div className="action-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by district or hostel name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Only DWO sees this button */}
          {user?.role === 'DWO' && (
            <Link to="/add-hostel" className="btn-add">
              <FaPlus /> Add Hostel
            </Link>
          )}
        </div>

        {/* Hostel Grid */}
        {loading ? (
          <p>Loading hostels...</p>
        ) : (
          <div className="hostel-grid">
            {hostels.length > 0 ? (
              hostels.map((hostel) => (
                <HostelCard key={hostel._id} hostel={hostel} />
              ))
            ) : (
              <p>No hostels found matching your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;