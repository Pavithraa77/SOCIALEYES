import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/DashBoard";
import Main from "./pages/Main"
import Settings from "./pages/Settings";
import ChangeEmail from "./pages/ChangeEmail";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/changeemail" element={<ChangeEmail />} />

    </Routes>
  );
}
//hello
export default App;
