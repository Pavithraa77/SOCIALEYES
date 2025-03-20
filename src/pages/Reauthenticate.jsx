import { useEffect, useState } from "react";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../css/Reauthenticate.css";

const Reauthenticate = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(auth.currentUser); // Ensure user updates dynamically
  }, [auth]);

  const deleteAccount = async () => {
    if (!user) {
      setError("No user is logged in.");
      return;
    }

    try {
      await deleteUser(user);
      alert("✅ Account deleted successfully. Redirecting to login...");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Account deletion failed:", error);
      setError(error.message);
    }
  };

  const handleEmailReauth = async (e) => {
    e.preventDefault();
    if (!user) return setError("No user is logged in.");

    setLoading(true);
    setError("");

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      alert("🔑 Re-authentication successful. Deleting your account...");
      await deleteAccount(); // Fix: Ensure deleteAccount is awaited
    } catch (error) {
      console.error("Re-authentication failed:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleReauth = async () => {
    if (!user) return setError("No user is logged in.");

    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("🔑 Re-authentication successful. Deleting your account...");
      await deleteAccount(); // Fix: Ensure deleteAccount is awaited
    } catch (error) {
      console.error("Google Re-authentication failed:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reauthenticate-container">
      <div className="reauth-card">
        <h2 className="reauth-title">Re-authenticate to Continue</h2>

        {user?.providerData?.[0]?.providerId === "password" ? (
          <form onSubmit={handleEmailReauth}>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="reauth-btn" disabled={loading}>
              {loading ? "Re-authenticating..." : "Re-authenticate"}
            </button>
          </form>
        ) : (
          <button className="gsi-material-button" onClick={handleGoogleReauth} disabled={loading}>
            {loading ? "Re-authenticating..." : "Re-authenticate with Google"}
          </button>
        )}

        {error && <p className="reauth-error">{error}</p>}
      </div>
    </div>
  );
};

export default Reauthenticate;
