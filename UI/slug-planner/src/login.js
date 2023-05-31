import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

function Login() {

  const provider = new firebase.auth.GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default Login;
