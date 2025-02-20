import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTubeAnalytics from "./YoutubeAnalytics";

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState("home");
  const navigate = useNavigate();

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: "250px" }}>
        <h2 className="text-center">Dashboard</h2>
        <nav className="nav flex-column mt-3">
          <button className={`btn ${activeFeature === "youtube" ? "btn-primary" : "btn-outline-light"} my-2`} 
            onClick={() => setActiveFeature("youtube")}>
            YouTube Analytics
          </button>
          <button className={`btn ${activeFeature === "settings" ? "btn-primary" : "btn-outline-light"} my-2`} 
            onClick={() => setActiveFeature("settings")}>
            Settings
          </button>
          <button className="btn btn-danger mt-auto" onClick={() => navigate("/")}>
            Logout
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-grow-1 p-4">
        {activeFeature === "youtube" && <YouTubeAnalytics />}
        {activeFeature === "settings" && <h3>Settings Page (Coming Soon)</h3>}
        {activeFeature === "home" && <h3>Welcome to the Dashboard</h3>}
      </div>
    </div>
  );
};

export default Dashboard;
