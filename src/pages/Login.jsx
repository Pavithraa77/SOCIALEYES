import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import "../css/login.css";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Store user-friendly error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
  
    // ✅ Prevent form submission if email or password is empty
    if (!email.trim() || !password.trim()) {
      setMessage("Email and password are required!");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        return;
      }
  
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      handleAuthErrors(error.code);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage(""); // Clear previous messages
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // Redirect on successful Google login
    } catch (error) {
      handleAuthErrors(error.code);
    }
  };

  // Function to handle different Firebase authentication errors
  const handleAuthErrors = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        setMessage("Invalid email format. Please enter a valid email.");
        break;
      case "auth/user-not-found":
        setMessage("No account found with this email. Please sign up.");
        break;
      case "auth/wrong-password":
        setMessage("Incorrect password. Please try again.");
        break;
      case "auth/user-disabled":
        setMessage("This account has been disabled. Contact support.");
        break;
      case "auth/too-many-requests":
        setMessage("Too many failed attempts. Try again later.");
        break;
      default:
        setMessage("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        {/* Display user-friendly error messages */}
        {message && <div className="alert alert-success text-center">{message}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-links">
          <button className="btn btn-link" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </button>
          <button className="btn btn-link" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>

        <div className="or-divider">or</div>

        <button className="gsi-material-button" onClick={handleGoogleLogin}>
          <span className="gsi-material-button-contents">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
