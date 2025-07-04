import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

function Signup({ updateAuthState }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://zcoder-backend-b6ii.onrender.com/api/auth/signup', { username, password });
      console.log("Response from server:", res);
      setMessage('Signup successful!! You can now log in.');
      // Redirect to login after successful signup
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong.');
    }
  };
  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p className={message.includes('successful') ? 'auth-message-success' : 'auth-message-error'}>{message}</p>}
      <div className="auth-links">
        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
}

export default Signup;
