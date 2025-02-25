import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import "../css/login.css"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      alert(error.message); // Show Firebase authentication error
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // Redirect on successful Google login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
  <div className="login-card">
    <h2 className="login-title">Login</h2>
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
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
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
