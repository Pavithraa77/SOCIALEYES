import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <h1 className="mb-4">SocialEyes</h1>
      <div className="d-flex gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn btn-success" onClick={() => navigate("/Signup")}>
          Signup
        </button>
      </div>
    </div>
  );
};

export default Main;
