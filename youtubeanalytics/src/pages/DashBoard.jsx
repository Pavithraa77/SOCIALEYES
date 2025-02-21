import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTubeAnalytics from "./YoutubeAnalytics";
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState("home");
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="dashboard-title">Dashboard</h2>
        <nav className="nav-menu">
          <button 
            className={`nav-button ${activeFeature === "youtube" ? "active" : ""}`} 
            onClick={() => setActiveFeature("youtube")}
          >
            📊 YouTube Analytics
          </button>
          <button 
            className={`nav-button ${activeFeature === "settings" ? "active" : ""}`} 
            onClick={() => setActiveFeature("settings")}
          >
            ⚙️ Settings
          </button>
          <button className="logout-button" onClick={() => navigate("/")}>
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="content">
        {activeFeature === "youtube" && <YouTubeAnalytics />}
        {activeFeature === "settings" && <h3 className="content-heading">Settings Page (Coming Soon)</h3>}
        {activeFeature === "home" && <h3 className="content-heading">Welcome to the Dashboard</h3>}
      </div>
    </div>
  );
};

export default Dashboard;
