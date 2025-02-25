import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase"; // Ensure correct path
import { sendPasswordResetEmail } from "firebase/auth";
import "../css/forgot-password.css";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent! Check your email.");
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (error) {
      alert(error.message); // Show Firebase error message
    }
  };

  return (
    <div className="forgot-password-container">
  <div className="forgot-password-card">
    <h2 className="forgot-password-title">Reset Password</h2>
    {message && <div className="alert alert-success text-center">{message}</div>}
    <form onSubmit={handleReset}>
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
