import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  const login = async (role) => {
    try {
      const res = await api.post("/auth/login", {
        email: "test@college.edu",
        role,
      });

      // Save auth
      auth.login(res.data.token, role);

      // Redirect based on role
      if (role === "SPOC") navigate("/spoc");
      else if (role === "CALENDAR_TEAM") navigate("/calendar-dashboard");
      else navigate("/");

    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => login("SPOC")}>Login SPOC</button>
      <button onClick={() => login("CALENDAR_TEAM")}>
        Login Calendar
      </button>
    </div>
  );
}
