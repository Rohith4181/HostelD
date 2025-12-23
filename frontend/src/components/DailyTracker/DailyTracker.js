import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaTimes, FaUtensils } from 'react-icons/fa';
import './DailyTracker.css';

const DailyTracker = ({ hostelId }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // For Modal

  // 1. Fetch Performance History
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/daily-performance/${hostelId}`);
        setPerformanceData(res.data.data);
      } catch (err) {
        console.error("Error fetching daily tracker", err);
      }
    };
    fetchData();
  }, [hostelId]);

  // 2. Helper: Check if we have data for a specific date
  const getDataForDate = (dateObj) => {
    // Format JavaScript date to ISO string (YYYY-MM-DD) for comparison
    // We strictly compare the Date part
    const dateStr = dateObj.toISOString().split('T')[0];
    
    return performanceData.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
  };

  // 3. Generate Last 30 Days
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  return (
    <div className="tracker-container">
      <h3><FaUtensils /> Monthly Food Tracker</h3>
      <p className="tracker-subtitle">Green boxes indicate food photos were uploaded. Click to view.</p>
      
      <div className="heatmap-grid">
        {days.map((date, index) => {
          const record = getDataForDate(date);
          const isuploaded = !!record; // true if record exists

          return (
            <div 
              key={index} 
              className={`day-box ${isuploaded ? 'uploaded' : 'missing'}`}
              title={date.toDateString()}
              onClick={() => isuploaded && setSelectedDay(record)}
            >
              <span className="date-label">{date.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* 4. Modal for Viewing Photos */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedDay(null)}>
              <FaTimes />
            </button>
            
            <h4>Food Served on {new Date(selectedDay.date).toDateString()}</h4>
            <p><strong>Student Attendance:</strong> {selectedDay.studentCount}</p>

            <div className="food-gallery">
              <div className="food-item">
                <span>Breakfast</span>
                <img src={selectedDay.breakfastImage} alt="Breakfast" />
              </div>
              <div className="food-item">
                <span>Lunch</span>
                <img src={selectedDay.lunchImage} alt="Lunch" />
              </div>
              <div className="food-item">
                <span>Dinner</span>
                <img src={selectedDay.dinnerImage} alt="Dinner" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTracker;