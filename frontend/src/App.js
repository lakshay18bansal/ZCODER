import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Profile from './components/profile/Profile';
import Rooms from './components/rooms/Rooms';
import Editor from './components/editor/Editor';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import './App.css';

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <nav className="nav-bar">
        <Link to="/dashboard" className={location.pathname === '/dashboard' || location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
        <Link to="/rooms" className={location.pathname === '/rooms' ? 'active' : ''}>Rooms</Link>
        <Link to="/editor" className={location.pathname === '/editor' ? 'active' : ''}>Editor</Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
        <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Signup</Link>      </nav>
      <main className="main-content">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">© ZCODER</div>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
