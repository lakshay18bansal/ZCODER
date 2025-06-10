import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', { username, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setMessage('Login successful!!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Invalid credentials.');
    }
  };
  return (
    <div className="auth-container">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Log In</button>
      </form>
      {message && <p className={message.includes('successful') ? 'auth-message-success' : 'auth-message-error'}>{message}</p>}
      {token && <div className="token-display">Token: {token}</div>}
      <div className="auth-links">
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
}

export default Login;
