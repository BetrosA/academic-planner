import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { signInWithGoogle } from './firebase'; // Import signInWithGoogle from firebase.js
import './Login.css'; // Assuming you have a Login.css file for styling

const Login = ({ setIsLoggedIn }) => { // Add setIsLoggedIn prop
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setIsLoggedIn(true); // Set login status to true after a successful login
        navigate('/dashboard'); // Redirect to home page or dashboard
      } else {
        setError('Failed to log in with Google');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <button className="login-button" onClick={handleGoogleLogin}>Log in with Google</button>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default Login;
