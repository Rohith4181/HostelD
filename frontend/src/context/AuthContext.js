import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      
      // Save token
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true; // Success
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false; // Failed
    }
  };

  // Register Function
  const register = async (name, email, password, role, secretCode, contactNumber) => {
    try {
      setError(null);
      // NOTE: I updated this to accept individual arguments or formData, 
      // but usually sending an object is safer.
      const res = await api.post('/auth/register', {
        name, email, password, role, secretCode, contactNumber
      });
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  // --- UPDATED LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      // 1. Call Backend to clear httpOnly cookie
      await api.get('/auth/logout');
    } catch (err) {
      console.error("Logout backend error:", err);
    }

    // 2. Clear Local Storage
    localStorage.removeItem('token');

    // 3. Clear State (Updates Navbar immediately)
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;