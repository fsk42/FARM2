import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginMask() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 401 && data.requiresCode) {
        // Cache credentials temporarily
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
  
        // Redirect to code input page
        navigate('/enter-code');
      } else if (data.authenticated) {
        setResponseMessage('Login successful!');
      } else {
        setResponseMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setResponseMessage('An error occurred while connecting to the server.');
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>} {/* Show server response */}
    </div>
  );
}

export default LoginMask;
