import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase"; // Ensure correct import path
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "../css/signup.css"
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: name });

      alert("Account created successfully! Please log in.");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      alert(error.message); // Show Firebase error message
    }
  };

  return (
    <div className="signup-container">
    <div className="signup-card">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-btn">
          Sign Up
        </button>
      </form>
      <div className="signup-link">
      <span style={{ color: "#fff" }}>Already have an account?</span>

        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  </div>
  
  );
};

export default Signup;
    