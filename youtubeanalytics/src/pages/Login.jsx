import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h2 className="text-center mb-3">Login</h2>
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
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-link p-0" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </button>
          <button className="btn btn-link p-0" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>

        <div className="text-center my-3">
          <span className="text-muted">or</span>
        </div>

        <button className="btn btn-danger w-100" onClick={handleGoogleLogin}>
          <i className="bi bi-google"></i> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
