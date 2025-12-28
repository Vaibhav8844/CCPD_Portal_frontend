import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";
import "./styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register" | "create-credentials"
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [verifiedData, setVerifiedData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "CALENDAR_TEAM") navigate("/calendar-dashboard");
      else if (user.role === "DATA_TEAM") navigate("/data-dashboard");
      else if (user.role === "SPOC") navigate("/spoc");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    }
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-email", {
        email: registerForm.email,
      });

      setVerifiedData(res.data);
      setMode("create-credentials");
      setRegisterForm((prev) => ({
        ...prev,
        username: res.data.email, // default username to email
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Email verification failed");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        email: registerForm.email,
        username: registerForm.username,
        password: registerForm.password,
        name: verifiedData?.name,
        role: verifiedData?.role,
      });

      const user = {
        token: res.data.token,
        role: res.data.role,
        name: res.data.name,
      };

      localStorage.setItem("auth", JSON.stringify(user));

      // 🔁 Role-based redirect
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "CALENDAR_TEAM") navigate("/calendar-dashboard");
      else if (user.role === "DATA_TEAM") navigate("/data-dashboard");
      else if (user.role === "SPOC") navigate("/spoc");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Placement Portal</h1>
        <p className="login-subtitle">
          CCPD · NIT Warangal
        </p>

        {mode === "login" && (
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

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                style={{
                  background: "transparent",
                  color: "#60a5fa",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Register as Associate
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={verifyEmail}>
            {error && <div className="login-error">{error}</div>}

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                required
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                style={{
                  background: "transparent",
                  color: "#60a5fa",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {mode === "create-credentials" && (
          <form onSubmit={submitRegister}>
            {error && <div className="login-error">{error}</div>}

            {verifiedData && (
              <div style={{ background: "#065f46", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 14 }}>
                  ✓ Email verified: <strong>{verifiedData.email}</strong>
                </div>
                <div style={{ fontSize: 12, color: "#d1fae5", marginTop: 4 }}>
                  Name: {verifiedData.name} | Role: {verifiedData.role}
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Username</label>
              <input
                placeholder="Choose a username"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Choose a password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={registerForm.confirmPassword}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setVerifiedData(null); }}
                style={{
                  background: "transparent",
                  color: "#60a5fa",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        <div className="login-footer">
          <span>© CCPD Placement Team</span>
        </div>
      </div>
    </div>
  );
}
