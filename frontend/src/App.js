import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AddHostel from './pages/AddHostel/AddHostel';
import HostelDetail from './pages/HostelDetail/HostelDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-hostel" element={<AddHostel />} />
            <Route path="/hostel/:id" element={<HostelDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;