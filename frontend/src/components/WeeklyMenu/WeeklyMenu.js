import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './WeeklyMenu.css';
import { FaUtensils } from 'react-icons/fa';

const WeeklyMenu = ({ hostelId }) => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current day name (e.g., "Monday")
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get(`/menus/${hostelId}`);
        setMenu(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("No menu found");
        setLoading(false);
      }
    };
    fetchMenu();
  }, [hostelId]);

  if (loading) return <div>Loading Menu...</div>;
  if (!menu) return <div className="no-menu">Menu not uploaded yet.</div>;

  return (
    <div className="menu-container">
      <h3><FaUtensils /> Weekly Food Menu</h3>
      <div className="table-responsive">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {menu.weeklyMenu.map((dayItem) => (
              <tr key={dayItem._id} className={dayItem.day === today ? "highlight-today" : ""}>
                <td className="day-name">
                  {dayItem.day} 
                  {dayItem.day === today && <span className="today-badge">Today</span>}
                </td>
                <td>{dayItem.breakfast}</td>
                <td>{dayItem.lunch}</td>
                <td>{dayItem.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyMenu;