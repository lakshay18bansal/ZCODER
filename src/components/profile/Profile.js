import React, { useState } from 'react';
import { Edit, Star, Trophy, Calendar } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Passionate coder and problem solver',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    solvedProblems: 45,
    ranking: 127
  });

  return (
    <div className="profile-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="profile-avatar">
          {profile.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#23272f', margin: 0 }}>{profile.name}</h1>
          <p style={{ color: '#555', margin: 0 }}>{profile.email}</p>
          <p style={{ color: '#555', marginTop: 8 }}>{profile.bio}</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="profile-edit-btn"
        >
          <Edit size={16} />
          {isEditing ? 'Save' : 'Edit Profile'}
        </button>
      </div>
      <div className="profile-stats">
        <div className="profile-stat">
          <Trophy style={{ color: '#ecc94b' }} size={20} />
          <h3>Problems Solved</h3>
          <p>{profile.solvedProblems}</p>
        </div>
        <div className="profile-stat">
          <Star style={{ color: '#4299e1' }} size={20} />
          <h3>Ranking</h3>
          <p>#{profile.ranking}</p>
        </div>
        <div className="profile-stat">
          <Calendar style={{ color: '#38b2ac' }} size={20} />
          <h3>Streak</h3>
          <p>7 days</p>
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: '#23272f', marginBottom: 12 }}>Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {profile.skills.map(skill => (
            <span key={skill} style={{ padding: '6px 16px', background: '#e6f7fa', color: '#38b2ac', borderRadius: 16, fontSize: 14 }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;