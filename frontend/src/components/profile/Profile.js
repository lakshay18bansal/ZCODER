import React, { useState, useEffect } from 'react';
import { Edit, Star, Trophy, Calendar, User, XCircle, Code, Award, TrendingUp, Activity } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  // Load user profile from localStorage and set default values
  useEffect(() => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  if (token && username && userId) {
    setIsLoggedIn(true);

    // Fetch profile info
    fetch(`http://localhost:5000/api/auth/get-profile/${userId}`)
      .then(res => res.json())
      .then(profileData => {
        // Fetch metrics
        fetch(`http://localhost:5000/api/code/metrics/${userId}`)
          .then(res => res.json())
          .then(metricData => {
            // Fetch rankings
            fetch("http://localhost:5000/api/auth/rankings")
              .then(res => res.json())
              .then(rankings => {
                const userRankObj = rankings.find(r =>
                  r.username === profileData.username || r.username === profileData.name
                );
                const ranking = userRankObj ? userRankObj.ranking : 999;

                const userProfile = {
                  name: profileData.name,
                  email: profileData.email,
                  bio: profileData.bio,
                  skills: profileData.skills,
                  solvedProblems: metricData.solved,
                  totalSubmissions: metricData.submissions,
                  successRate: metricData.successRate || 0,
                  streak: profileData.streak || 0,
                  ranking: ranking,
                  joinDate: new Date(profileData.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  }),
                };

                setProfile(userProfile);
                setEditProfile(userProfile);
              });
          });
      })
      .catch(err => {
        console.error("Failed to load profile:", err);
      });
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
  if (isEditing) {
    fetch("http://localhost:5000/api/auth/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        name: editProfile.name,
        email: editProfile.email,
        bio: editProfile.bio,
        skills: editProfile.skills,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          // Update only editable fields
          setProfile((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
            bio: data.user.bio,
            skills: data.user.skills,
          }));

          setEditProfile((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
            bio: data.user.bio,
            skills: data.user.skills,
          }));
        }
      })
      .catch((err) => {
        console.error("Profile update failed:", err);
      });
  }

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
    const handleSkillSave = () => {
    fetch("http://localhost:5000/api/auth/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        skills: editProfile.skills,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile((prev) => ({
            ...prev,
            skills: data.user.skills,
          }));
          setEditProfile((prev) => ({
            ...prev,
            skills: data.user.skills,
          }));
        }
      })
      .catch((err) => console.error("Skill update failed:", err));

    setIsEditingSkills(false);
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
      {/* Skills Section */}
      <div className="profile-section">
        <div className="section-header">
          <h3 className="section-title">
            <Award size={24} />
            <span>Technical Skills</span>
          </h3>
          {isEditingSkills ? (
            <div className="skill-btns">
              <button className="save-skill-btn" onClick={handleSkillSave}>
                Save
              </button>
              <button className="cancel-skill-btn" onClick={() => setIsEditingSkills(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="edit-skill-btn" onClick={() => setIsEditingSkills(true)}>
              Edit Skills
            </button>
          )}
        </div>

        {isEditingSkills ? (
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
            <button onClick={handleAddSkill} className="add-skill-btn">+ Add</button>
          </div>
        ) : (
          <div className="skills-grid">
            {profile.skills.map((skill, index) => (
              <div className="skill-tag" key={index}>
                <span className="skill-name">{skill}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;