import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/Logo.jpg"; 
const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      {}
      <img 
        src={logo} 
        alt="SocialEyes Logo" 
        className="rounded-circle border border-dark shadow mb-3"
        style={{ width: "120px", height: "120px", objectFit: "cover" }}
      />

      {}
      <h1 className="mb-4">SocialEyes</h1>
      <div className="d-flex gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn btn-success" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Main;
