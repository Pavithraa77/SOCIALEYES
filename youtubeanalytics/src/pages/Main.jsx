import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/main.css"; // Import the CSS file
import logo from "../assets/Logo.jpg"; 

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <img 
        src={logo} 
        alt="SocialEyes Logo" 
        className="logo-img"
      />
      <h1 className="title">SocialEyes</h1>
      <div className="button-container">
    <button className="btn btn-login" onClick={() => navigate("/login")}>
        Login
    </button>
    <button className="btn btn-signup" onClick={() => navigate("/signup")}>
        Signup
    </button>
</div>
    </div>
  );
};

export default Main;
