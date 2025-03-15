import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  applyActionCode,
} from "firebase/auth";
import "../css/ChangeEmail.css";

function ChangeEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Store the user in local state so we can update it after reload()
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Form fields
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Track if we are verifying a code from the URL
  const [isVerifying, setIsVerifying] = useState(false);

  // 1. Detect if there's an "oobCode" in the URL (the link from the verification email).
  //    If so, apply the action code to finalize the email change.
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const oobCode = query.get("oobCode");

    if (oobCode) {
      setIsVerifying(true);
      setError("");
      setSuccess("");

      applyActionCode(auth, oobCode)
        .then(() => {
          // The new email is now verified and updated in Firebase
          setSuccess("Email verified successfully!");
          // Reload the user to reflect the new email in auth.currentUser
          return auth.currentUser.reload();
        })
        .then(() => {
          // Update local state so UI re-renders with the new email
          setCurrentUser(auth.currentUser);
        })
        .catch((err) => {
          setError("Error verifying email: " + err.message);
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [location]);

  // 2. Handle form submission to send the verification link to the new email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!currentUser || !currentUser.email) {
        throw new Error("User not authenticated.");
      }

      // Ensure that only users who signed in with email/password can change their email
      if (
        !currentUser.providerData.some(
          (provider) => provider.providerId === "password"
        )
      ) {
        throw new Error(
          "Email change is only available for users signed in with email/password."
        );
      }

      if (!currentUser.emailVerified) {
        throw new Error("Please verify your current email first.");
      }

      setIsUpdating(true);

      // Reauthenticate with current credentials
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Send verification link to the new email
      await verifyBeforeUpdateEmail(currentUser, newEmail);

      setSuccess(
        `Verification link sent to ${newEmail}. Check your inbox to confirm.`
      );
      setNewEmail("");
      setPassword("");

      // After 3 seconds, redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 3. If applying the verification code, show a "Verifying" view
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

  // 4. Otherwise, show the inline form to change email
  return (
    <div className="change-email-container">
      <div className="change-email-card">
        {currentUser && (
          <p style={{ color: "#fff" }}>
            Current email: {currentUser.email}
          </p>
        )}

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

          <label className="form-label">Current Password</label>
          <input
            type="password"
            placeholder="Current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />

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
