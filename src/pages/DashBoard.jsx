import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTubeAnalytics from "./YoutubeAnalytics";
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState("home");
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar for Dashboard and Buttons */}
      <div className="dashboard-sidebar">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Buttons in Vertical Layout */}
        <nav className="dashboard-nav">
          <button className="btn dashboard-btn youtube-btn" onClick={() => setActiveFeature("youtube")}>
            YouTube Analytics
          </button>
          <button className="btn dashboard-btn settings-btn" onClick={() => setActiveFeature("settings")}>
            Settings
          </button>
          <button className="btn dashboard-btn logout-btn" onClick={() => navigate("/")}>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {activeFeature === "youtube" && <YouTubeAnalytics />}
        {activeFeature === "settings" && <h3 className="coming-soon">Settings Page (Coming Soon)</h3>}
      </div>
    </div>
  );
};

export default Dashboard;
