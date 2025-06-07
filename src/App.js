import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Profile from './components/profile/Profile';
import Rooms from './components/rooms/Rooms';
import Editor from './components/editor/Editor';
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
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </div>
  );
}

export default App;