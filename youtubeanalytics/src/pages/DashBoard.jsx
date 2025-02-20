import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTubeAnalytics from "./YoutubeAnalytics";

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState("home");
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <nav className="mb-3">
        <button className="btn btn-outline-primary me-2" onClick={() => setActiveFeature("youtube")}>
          YouTube Analytics
        </button>
        <button className="btn btn-outline-secondary me-2" onClick={() => setActiveFeature("settings")}>
          Settings
        </button>
        <button className="btn btn-danger" onClick={() => navigate("/")}>
          Logout
        </button>
      </nav>

      {activeFeature === "youtube" && <YouTubeAnalytics />}
      {activeFeature === "settings" && <h3>Settings Page (Coming Soon)</h3>}
    </div>
  );
};

export default Dashboard;
