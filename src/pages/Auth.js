import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

function Auth({ user, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      setUser(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      {user ? (
        <div>
          <h2>Welcome, {user.email}</h2>
          <button onClick={() => signOut(auth).then(() => setUser(null))}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleAuth}>
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
          <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: "pointer", color: "blue" }}>
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </p>
        </form>
      )}
    </div>
  );
}

export default Auth;