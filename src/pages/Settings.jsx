import { useNavigate } from "react-router-dom";
import { FaBell, FaLock, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import "../css/Settings.css";
import ChangeEmail from "./ChangeEmail";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  const toggleNotifications = () => {
    setNotifications(!notifications);
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

      {/* Modal for Change Email */}
      {showChangeEmail && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowChangeEmail(false)}>✖</button>
            <ChangeEmail />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
