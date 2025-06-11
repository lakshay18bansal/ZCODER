import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Users, Code, User, FileText, LogIn, UserPlus } from 'lucide-react';
import Dashboard from './components/dashboard/dashboard';
import SubmitQuestion from './components/dashboard/SubmitQuestion';
import Profile from './components/profile/Profile';
import Rooms from './components/rooms/Rooms';
import Editor from './components/editor/Editor';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import './App.css';

function App() {
  const location = useLocation();
  return (
    <div className="App">      <nav className="nav-bar">
        <div className="nav-left">
          <div className="nav-logo">
            <Code size={24} />
            <span>ZCODER</span>
          </div>
        </div>
        
        <div className="nav-center">
          <Link to="/dashboard" className={location.pathname === '/dashboard' || location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
            <Home size={18} />
            Dashboard
          </Link>
          <Link to="/rooms" className={location.pathname === '/rooms' ? 'nav-link active' : 'nav-link'}>
            <Users size={18} />
            Rooms
          </Link>
          <Link to="/editor" className={location.pathname === '/editor' ? 'nav-link active' : 'nav-link'}>
            <Code size={18} />
            Editor
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}>
            <User size={18} />
            Profile
          </Link>
          <Link to="/submit-question" className={location.pathname === '/submit-question' ? 'nav-link active' : 'nav-link'}>
            <FileText size={18} />
            Submit Question
          </Link>
        </div>

        <div className="nav-right">
          <Link to="/login" className={location.pathname === '/login' ? 'auth-link active' : 'auth-link'}>
            <LogIn size={18} />
            Login
          </Link>
          <Link to="/signup" className={location.pathname === '/signup' ? 'auth-link signup active' : 'auth-link signup'}>
            <UserPlus size={18} />
            Sign Up
          </Link>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/submit-question" element={<SubmitQuestion />} />
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
