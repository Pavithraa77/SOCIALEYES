import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import "../css/signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailVerification(user);
      setMessage("A verification email has been sent. Please check your email and verify before logging in.");
      setIsWaiting(true);

      // Polling mechanism: Check every 3 seconds if the email is verified
      const interval = setInterval(async () => {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
          clearInterval(interval); // Stop checking
          setMessage("Email verified! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
        }
      }, 3000);
      
    } catch (error) {


      if (error.code === "auth/email-already-in-use") {
        setMessage("This email is already in use. Try logging in instead.");
      } else if (error.code === "auth/weak-password") {
        setMessage("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Invalid email format. Please enter a valid email.");
      } else {
        setMessage(error.message); // Default error message
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>

        {/* Display verification message */}
        {message && <div className="alert alert-success text-center">{message}</div>}

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
          <button type="submit" className="signup-btn" disabled={isWaiting}>
            {isWaiting ? "Waiting for verification..." : "Sign Up"}
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
