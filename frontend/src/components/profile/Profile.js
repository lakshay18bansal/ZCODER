import React, { useState, useEffect } from 'react';
import { Edit, Star, Trophy, Calendar, User, XCircle, Code, Award, TrendingUp, Activity } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user profile from localStorage and set default values
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    
    if (token && username) {
      setIsLoggedIn(true);
      
      // Create profile object with actual user data and reasonable defaults
      const userProfile = {
        name: username,
        email: `${username}@zcoder.com`, // Default email based on username
        bio: `Hello! I'm ${username}, a passionate coder on ZCODER platform. I love solving challenging problems and improving my programming skills every day.`,
        skills: ['JavaScript', 'Python', 'React', 'Problem Solving'], // Default skills
        solvedProblems: 0, // These would come from backend in real app
        ranking: 999,
        streak: 1,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        totalSubmissions: 0,
        successRate: 0
      };
      
      setProfile(userProfile);
      setEditProfile(userProfile);
    } else {
      setIsLoggedIn(false);
      setProfile(null);
      setEditProfile(null);
    }
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEdit = () => {
    if (isEditing) setProfile(editProfile);
    setIsEditing(!isEditing);
  };

  const handleChange = e => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (idx, value) => {
    const newSkills = [...editProfile.skills];
    newSkills[idx] = value;
    setEditProfile({ ...editProfile, skills: newSkills });
  };

  const handleAddSkill = () => {
    setEditProfile({ ...editProfile, skills: [...editProfile.skills, ''] });
  };
  const handleRemoveSkill = idx => {
    const newSkills = editProfile.skills.filter((_, i) => i !== idx);
    setEditProfile({ ...editProfile, skills: newSkills });
  };

  // Show login prompt if user is not logged in
  if (!isLoggedIn || !profile) {
    return (
      <div className="profile-container">
        <div className="profile-login-prompt">
          <div className="login-prompt-content">
            <User size={64} className="login-prompt-icon" />
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your profile.</p>
            <a href="/login" className="login-prompt-btn">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Hero Section */}
      <div className="profile-hero">
        <div className="profile-hero-bg"></div>
        <div className="profile-hero-content">          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <span className="profile-initials">
                {getUserInitials(profile.name)}
              </span>
            </div>
          </div>
          <div className="profile-hero-info">
            {isEditing ? (
              <div className="profile-edit-form">
                <input
                  className="profile-input profile-name-input"
                  name="name"
                  value={editProfile.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
                <input
                  className="profile-input profile-email-input"
                  name="email"
                  value={editProfile.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                />
                <textarea
                  className="profile-input profile-bio-input"
                  name="bio"
                  value={editProfile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            ) : (
              <>
                <h1 className="profile-name">{profile.name}</h1>
                <p className="profile-email">{profile.email}</p>
                <p className="profile-bio">{profile.bio}</p>
                <div className="profile-meta">
                  <span className="profile-join-date">Member since {profile.joinDate}</span>
                </div>
              </>
            )}
          </div>
          <button className="profile-edit-btn" onClick={handleEdit}>
            <Edit size={20} />
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="profile-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Trophy className="stat-icon" size={32} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{profile.solvedProblems}</span>
            <span className="stat-label">Problems Solved</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Star className="stat-icon" size={32} />
          </div>
          <div className="stat-content">
            <span className="stat-number">#{profile.ranking}</span>
            <span className="stat-label">Global Ranking</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Calendar className="stat-icon" size={32} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{profile.streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Code className="stat-icon" size={32} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{profile.totalSubmissions}</span>
            <span className="stat-label">Total Submissions</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <TrendingUp className="stat-icon" size={32} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{profile.successRate}%</span>
            <span className="stat-label">Success Rate</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Activity className="stat-icon" size={32} />
          </div>
          <div className="stat-content">
            <span className="stat-number">Active</span>
            <span className="stat-label">Status</span>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="profile-section">
        <div className="section-header">
          <h3 className="section-title">
            <Award size={24} />
            <span>Technical Skills</span>
          </h3>
          {isEditing && (
            <button className="add-skill-btn" onClick={handleAddSkill}>
              <span>+ Add Skill</span>
            </button>
          )}
        </div>
        
        <div className="skills-container">
          {isEditing ? (
            <div className="skills-edit-grid">
              {editProfile.skills.map((skill, idx) => (
                <div className="skill-edit-item" key={idx}>
                  <input
                    className="skill-edit-input"
                    value={skill}
                    onChange={e => handleSkillChange(idx, e.target.value)}
                    placeholder="Enter skill..."
                  />
                  <button 
                    className="remove-skill-btn" 
                    onClick={() => handleRemoveSkill(idx)}
                    title="Remove Skill"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="skills-grid">
              {profile.skills.map((skill, index) => (
                <div className="skill-tag" key={skill}>
                  <span className="skill-name">{skill}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;