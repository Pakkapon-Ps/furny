import React from "react";
import { signInWithGoogle, logout } from "../firebase/firebaseAuth";

function SignIn({ user, setUser }) {
  const handleLogin = async () => {
    const userData = await signInWithGoogle();
    if (userData) setUser(userData);
  };

  return user ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <button onClick={handleLogin}>Sign in with Google</button>
  );
}

export default SignIn;