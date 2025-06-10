import React, { useState } from 'react';
import { Edit, Star, Trophy, Calendar, User, XCircle } from 'lucide-react';
import './Profile.css';

const defaultProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Passionate coder and problem solver',
  skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  solvedProblems: 45,
  ranking: 127,
  streak: 7,
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [editProfile, setEditProfile] = useState(profile);

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

  return (
    <div className="profile-glass">
      <div className="profile-glow" />
      <div className="profile-header">
        <h2 className="profile-title">Profile</h2>
        <button className="profile-edit-btn" onClick={handleEdit}>
          <Edit size={18} />
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="profile-main">
        <div className="profile-avatar-area">
          <div className="profile-avatar-glow">
            <div className="profile-avatar">
              <User size={44} />
              <span className="profile-initials">
                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="profile-info-area">
          {isEditing ? (
            <>
              <input
                className="profile-input profile-name-input"
                name="name"
                value={editProfile.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                className="profile-input profile-email-input"
                name="email"
                value={editProfile.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <textarea
                className="profile-input profile-bio-input"
                name="bio"
                value={editProfile.bio}
                onChange={handleChange}
                placeholder="Bio"
                rows={2}
              />
            </>
          ) : (
            <>
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-email">{profile.email}</p>
              <p className="profile-bio">{profile.bio}</p>
            </>
          )}
        </div>
      </div>
      <div className="profile-stats-area">
        <div className="profile-stat">
          <Trophy size={22} className="stat-icon gold" />
          <span className="stat-label">Solved</span>
          <span className="stat-value">{profile.solvedProblems}</span>
        </div>
        <div className="profile-stat">
          <Star size={22} className="stat-icon blue" />
          <span className="stat-label">Ranking</span>
          <span className="stat-value">#{profile.ranking}</span>
        </div>
        <div className="profile-stat">
          <Calendar size={22} className="stat-icon teal" />
          <span className="stat-label">Streak</span>
          <span className="stat-value">{profile.streak} days</span>
        </div>
      </div>
      <div className="profile-skills-area">
        <div className="skills-header">
          <span className="skills-title">Skills</span>
          {isEditing && (
            <button className="add-skill-btn" onClick={handleAddSkill} title="Add Skill">
              +
            </button>
          )}
        </div>
        <div className="skills-list">
          {isEditing
            ? editProfile.skills.map((skill, idx) => (
                <div className="skill-edit-row" key={idx}>
                  <input
                    className="profile-input skill-input"
                    value={skill}
                    onChange={e => handleSkillChange(idx, e.target.value)}
                    placeholder="Skill"
                  />
                  <button className="remove-skill-btn" onClick={() => handleRemoveSkill(idx)} title="Remove Skill">
                    <XCircle size={16} />
                  </button>
                </div>
              ))
            : profile.skills.map(skill => (
                <span className="skill-tag" key={skill}>{skill}</span>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;