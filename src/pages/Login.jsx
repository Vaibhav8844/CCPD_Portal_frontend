import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(
        form.username,
        form.password,
        form.remember
      );

      // 🔁 Role-based redirect
      if (user.role === "ADMIN") navigate("/assign-spoc");
      else if (user.role === "CALENDAR_TEAM") navigate("/calendar-dashboard");
      else if (user.role === "DATA_TEAM") navigate("/data-dashboard");
      else if (user.role === "SPOC") navigate("/spoc");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Placement Portal</h1>
        <p className="login-subtitle">
          CCPD · NIT Warangal
        </p>

        <form onSubmit={submit}>
          {error && <div className="login-error">{error}</div>}

          <div className="input-group">
            <label>Username</label>
            <input
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
          </div>

          <button className="login-btn" type="submit">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <span>© CCPD Placement Team</span>
        </div>
      </div>
    </div>
  );
}
