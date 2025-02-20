import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      navigate("/dashboard"); // Simulating successful login
    } else {
      alert("Please enter email and password");
    }
  };
  const handleGoogleLogin = () => {
    const userEmail = prompt("Enter your email to continue with Google:");
    if (userEmail) {
      alert(`Redirecting ${userEmail} to Google authentication...`);
      // Here you would integrate actual Google OAuth logic
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h2 className="text-center mb-3">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Forgot Password & Sign Up */}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-link p-0" onClick={() => alert("Redirect to forgot password")}>
            Forgot Password?
          </button>
          <button className="btn btn-link p-0" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>

        {/* OR Divider */}
        <div className="text-center my-3">
          <span className="text-muted">or</span>
        </div>

        {/* Google Login Button */}
        <button className="btn btn-danger w-100" onClick={handleGoogleLogin}>
  <i className="bi bi-google"></i> Continue with Google
</button>

      </div>
    </div>
  );
};

export default Login;
