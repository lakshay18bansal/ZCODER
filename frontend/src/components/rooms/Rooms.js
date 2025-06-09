import React, { useState } from 'react';
import { Users, Plus, MessageCircle, Video, Mic, MicOff } from 'lucide-react';

const Rooms = () => {
  const [activeRooms] = useState([
    { id: 1, name: 'Binary Tree Problems', users: 5, topic: 'Data Structures' },
    { id: 2, name: 'Dynamic Programming', users: 8, topic: 'Algorithms' },
    { id: 3, name: 'React Interview Prep', users: 12, topic: 'Frontend' }
  ]);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="rooms-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div className="room-title">Study Rooms</div>
        <button className="create-room-btn">
          <Plus size={16} />
          Create Room
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {activeRooms.map(room => (
          <div key={room.id} className="room-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, background: 'linear-gradient(90deg, #38b2ac 60%, #4299e1 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users style={{ color: '#fff' }} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600, color: '#b2f5ea', margin: 0 }}>{room.name}</h3>
                <p className="room-topic" style={{ fontSize: 14, margin: 0 }}>{room.topic}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span className="users-online" style={{ fontSize: 14 }}>{room.users} users online</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <MessageCircle className="icon" size={16} />
                <Video className="icon" size={16} />
              </div>
            </div>
            <button className="join-btn" style={{ width: '100%', marginTop: 8 }}>
              Join Room
            </button>
          </div>
        ))}
      </div>
      {/* Voice Controls (when in a room) */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', gap: 12 }}>
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{ padding: 14, borderRadius: '50%', background: isMuted ? '#e53e3e' : '#38b2ac', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(44,203,255,0.10)', cursor: 'pointer', transition: 'background 0.2s' }}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Rooms;