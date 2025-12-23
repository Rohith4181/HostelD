import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Register.css'; // Importing the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student', // Default role
    secretCode: '',
    contactNumber: ''
  });

  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, role, secretCode, contactNumber } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join HostelDrishti today</p>
        
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={onSubmit} className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="student@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              placeholder="Min 6 characters"
            />
          </div>

          <div className="form-group">
            <label>I am a...</label>
            <select name="role" value={role} onChange={onChange}>
              <option value="Student">Student</option>
              <option value="Warden">Warden (Hostel Manager)</option>
              <option value="DWO">District Welfare Officer</option>
            </select>
          </div>

          {/* Conditional Rendering: Show Secret Code for Officials */}
          {(role === 'Warden' || role === 'DWO') && (
            <div className="form-group secret-group">
              <label>Official Secret Code</label>
              <input
                type="text"
                name="secretCode"
                value={secretCode}
                onChange={onChange}
                placeholder={role === 'Warden' ? "Enter Warden Code" : "Enter Officer Code"}
              />
              <small className="hint">Required for official verification.</small>
            </div>
          )}

          {/* Conditional: Contact Number for Wardens */}
          {role === 'Warden' && (
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={contactNumber}
                onChange={onChange}
                placeholder="Public contact for students"
              />
            </div>
          )}

          <button type="submit" className="btn-register">
            Register Now
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;