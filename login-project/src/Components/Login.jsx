import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';   // can also use memory router than browser router;      

function Login({ onLoginSuccess }) {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_URL = "http://192.168.1.14:5000/users"; 

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Authenticating...");

    try {
      const response = await fetch(`${API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          password: password
        })
      });

      const result = await response.json();

      if (response.ok) {
        const userData = result.user; // Ensure your API returns the user object
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        if (onLoginSuccess) {
                onLoginSuccess(userData);
            }

            if (userData.isAdmin === 1 || userData.isAdmin === true) {
                navigate('/admin-home'); 
            } else {
                navigate('/emp-home');
            }

        } else {
            setMessage("Invalid Credentials. Please try again.");
        }
      
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error. Connection failed.");
    }
  };

  return (
    <>
      <fieldset>
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>

            <div className="input-group">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your User ID"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </fieldset>
      <h4>{message} </h4>
    </>
  );
}

export default Login;