import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaYoutube, FaCog, FaChartBar, FaUsers } from "react-icons/fa"; 
import YouTubeAnalytics from "./YoutubeAnalytics";
import "../css/Dashboard.css"; 
import Settings from "./Settings";
import logo from "../assets/Logo.jpg";

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState("home");
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        {/* Logo */}
        <img src={logo} alt="Social Eyes Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">Social Eyes</h1>
        <nav className="dashboard-nav">
          {/* YouTube Icon Button */}
          <button className="icon-btn" onClick={() => setActiveFeature("youtube")}>
            <FaYoutube className="dashboard-icon youtube-icon" />
          </button>

          {/* Settings Icon Button */}
          <button className="icon-btn" onClick={() => setActiveFeature("settings")}>
            <FaCog className="dashboard-icon" />
          </button>

          {/* Logout Button (Text Only) */}
          <button className="logout-text-btn" onClick={() => navigate("/")}>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeFeature === "youtube" && <YouTubeAnalytics />}
        {activeFeature === "settings" && <Settings />}

        {activeFeature === "home" && (
          <div>
            <h2>Social Media Insights</h2>
            <p>Get real-time data on social media engagement, follower growth, and content performance.</p>

            <div className="stats-container">
              <div className="stat-card">
                <FaChartBar className="stat-icon" />
                <h3>Engagement Rate</h3>
                <p>15.2% increase this month</p>
              </div>
              
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>New Followers</h3>
                <p>+2,340 new users</p>
              </div>
            </div>

            <h3>Trending Topics</h3>
            <ul className="trending-topics">
              <li>#TechTrends2025</li>
              <li>#SocialGrowth</li>
              <li>#MarketingAnalytics</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;