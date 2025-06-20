import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/dashboard/dashboard';
import Profile from './components/profile/Profile';
import Rooms from './components/rooms/Rooms';
import Editor from './components/editor/Editor';
import Submissions from './components/submissions/Submissions';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import './App.css';

function App() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [username, setUsername] = useState('');

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Function to update auth state (to be passed to Login component)
  const updateAuthState = (loginStatus, user) => {
    setIsLoggedIn(loginStatus);
    setUsername(user || '');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setShowUserMenu(false);
    window.location.href = '/login';
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="App">
      {/* Top Header with Auth */}
      <header className="top-header">
        <div className="logo">ZCODER</div>        <div className="auth-section">
          {isLoggedIn ? (
            <div className="user-menu-container">              <button 
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="avatar-circle">
                  {getUserInitials(username)}
                </div>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/profile" onClick={() => setShowUserMenu(false)}>Profile</Link>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">Login</Link>
              <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </header>

      <div className="app-layout">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <nav className="sidebar-nav">            <Link 
              to="/dashboard" 
              className={`sidebar-link ${(location.pathname === '/dashboard' || location.pathname === '/') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">⚡</span>
              <span className="sidebar-text">Dashboard</span>
            </Link>
            <Link 
              to="/rooms" 
              className={`sidebar-link ${location.pathname === '/rooms' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">◉</span>
              <span className="sidebar-text">Rooms</span>
            </Link>            <Link 
              to="/editor" 
              className={`sidebar-link ${location.pathname === '/editor' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">◈</span>
              <span className="sidebar-text">Editor</span>
            </Link>
            <Link 
              to="/submissions" 
              className={`sidebar-link ${location.pathname === '/submissions' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">📝</span>
              <span className="sidebar-text">Submissions</span>
            </Link>
            <Link 
              to="/profile" 
              className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              <span className="sidebar-icon">◐</span>
              <span className="sidebar-text">Profile</span>
            </Link></nav>
        </aside>        {/* Main Content */}
        <main className="main-content">          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/editor" element={<Editor />} />            
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/login" element={<Login updateAuthState={updateAuthState} />} />
            <Route path="/signup" element={<Signup updateAuthState={updateAuthState} />} />
          </Routes>
        </main>
      </div>

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
