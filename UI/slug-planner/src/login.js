import React from 'react';
import { signInWithGoogle } from './firebase';

const GoogleLogin = () => {
  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      // User is signed in.
      // Redirect to the main application or do something with the user object.
      console.log(user);
    } else {
      // No user is signed in or there was an error.
      // Handle this situation as you see fit.
    }
  };

  return (
    <button onClick={handleLogin}>Sign in with Google</button>
  );
};

export default GoogleLogin;
