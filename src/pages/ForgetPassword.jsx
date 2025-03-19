import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import "../css/forgot-password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Store error messages
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email"); // Display error message instead of alert
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent! Check your email.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError(error.message); // Show Firebase error message in UI
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2 className="forgot-password-title">Reset Password</h2>

        {/* Always render these divs, even if they are empty */}
        <div className="alert-container">
          <div className={`alert alert-success text-center ${message ? "" : "d-none"}`} data-testid="success-message">
            {message}
          </div>
          <div className={`alert alert-danger text-center ${error ? "" : "d-none"}`} data-testid="error-message">
            {error}
          </div>
        </div>

        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="forgot-password-btn">
            Send Reset Link
          </button>
        </form>

        <div className="forgot-password-link">
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
