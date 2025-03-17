import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  applyActionCode,
  GoogleAuthProvider,
} from "firebase/auth";
import "../css/ChangeEmail.css";

function ChangeEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Determine if user uses email/password auth
  const isEmailUser = currentUser?.providerData?.some(
    (provider) => provider.providerId === "password"
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const oobCode = query.get("oobCode");

    if (oobCode) {
      setIsVerifying(true);
      setError("");
      setSuccess("");

      applyActionCode(auth, oobCode)
        .then(() => auth.currentUser.reload())
        .then(() => setCurrentUser(auth.currentUser))
        .then(() => setSuccess("Email verified successfully!"))
        .catch((err) => setError("Error verifying email: " + err.message))
        .finally(() => setIsVerifying(false));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!currentUser?.email) throw new Error("User not authenticated.");
      if (!currentUser.emailVerified) throw new Error("Please verify your current email first.");

      setIsUpdating(true);

      // Reauthenticate based on provider
      if (isEmailUser) {
        if (!password) throw new Error("Please enter your current password.");
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
      } else {
        // For Google/OAuth providers
        const provider = new GoogleAuthProvider();
        await currentUser.reauthenticateWithPopup(provider);
      }

      await verifyBeforeUpdateEmail(currentUser, newEmail);
      setSuccess(`Verification link sent to ${newEmail}. Check your inbox.`);
      
      setNewEmail("");
      setPassword("");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="change-email-container">
        <div className="change-email-card">
          <p style={{ color: "#fff" }}>Verifying your email...</p>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="change-email-container">
      <div className="change-email-card">
        {currentUser && <p style={{ color: "#fff" }}>Current email: {currentUser.email}</p>}

        <form onSubmit={handleSubmit}>
          <label className="form-label">New Email</label>
          <input
            type="email"
            placeholder="New email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="form-control"
            required
          />

          {isEmailUser && (
            <>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                placeholder="Current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </>
          )}

          <button
            type="submit"
            disabled={isUpdating}
            className="change-email-btn"
          >
            {isUpdating ? "Processing..." : "Change Email"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
}

export default ChangeEmail;