import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CodeInput() {
  const [code, setCode] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, code }),
      });

      const data = await response.json();

      if (data.authenticated) {
        setResponseMessage('Verification successful!');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/');
      } else {
        setResponseMessage(data.message || 'Verification failed.');
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
          placeholder="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>} {/* Show server response */}
    </div>
  );
}

export default CodeInput;
