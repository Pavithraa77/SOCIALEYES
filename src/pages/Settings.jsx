
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { getAuth, deleteUser, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import "../css/Settings.css";
import ChangeEmail from "./ChangeEmail";
import Reauthenticate from "./Reauthenticate";
const Settings = () => {
  const navigate = useNavigate();
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  const handleAccountDeletion = async () => {
    if (!user) {
      setError("No user is logged in.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      // Force Re-authentication before deletion
      const providerId = user.providerData[0]?.providerId;
  
      if (providerId === "password") {
        // Redirect email/password users to re-authentication page
        navigate("/reauthenticate");
        return;
      } else if (providerId === "google.com") {
        // Force Google re-authentication
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
  
      // If re-authentication is successful, delete the user
      await deleteUser(user);
      alert("Your account has been deleted successfully.");
      navigate("/"); // Redirect to homepage or login page
    } catch (error) {
      console.error("Error deleting account:", error);
      setError(error.message);
  
      if (error.code === "auth/requires-recent-login") {
        alert("You need to re-authenticate before deleting your account.");
        navigate("/reauthenticate"); // Redirect to re-authentication page
      }
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };
  
  

  return (
    <div className="settings-wrapper">
      <h2 className="settings-title">Settings</h2>

      <div className="settings-option">
        <FaLock className="settings-icon" />
        <span>Change Password</span>
        <button className="settings-btn" onClick={() => navigate("/forgot-password")}>
          Update
        </button>
      </div>

      <div className="settings-option">
        <FaEnvelope className="settings-icon" />
        <span>Change Email</span>
        <button className="settings-btn" onClick={() => setShowChangeEmail(true)}>
          Update
        </button>
      </div>

      {/* Account Deletion Option */}
      <div className="settings-option">
        <FaTrash className="settings-icon danger-icon" />
        <span>Delete Account</span>
        <button className="settings-btn danger" onClick={() => setShowDeleteModal(true)}>
          Delete
        </button>
      </div>

      {/* Error message display */}
      {error && <p className="error-message">{error}</p>}

      {/* Modal for Change Email */}
      {showChangeEmail && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowChangeEmail(false)}>✖</button>
            <ChangeEmail />
          </div>
        </div>
      )}

      {/* Modal for Account Deletion */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Account Deletion</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-actions">
  <button
    className="settings-btn"
    onClick={() => {
      // Close the delete modal AND reset loading
      setShowDeleteModal(false);
      setLoading(false);
    }}
  >
    Cancel
  </button>
  <button
    className="settings-btn danger"
    onClick={handleAccountDeletion}
    disabled={loading}
  >
    {loading ? "Deleting..." : "Delete"}
  </button>
</div>
          </div>
        </div>
      )}
    </div>
  );
}; 
export default Settings;  