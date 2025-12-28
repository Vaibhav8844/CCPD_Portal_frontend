import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import "./styles/CommonDashboard.css";

export default function CalendarDashboard() {
  const navigate = useNavigate();
  const { logout, auth } = useAuth();
  const [initialized, setInitialized] = useState(null);
  const [loadingInit, setLoadingInit] = useState(false);
  const [message, setMessage] = useState("");

  const Card = ({ title, description, path, icon, onClick, disabled }) => (
    <div
      className={`dashboard-card ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && (onClick ? onClick() : navigate(path))}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );

  useEffect(() => {
    let mounted = true;
    async function fetchStatus() {
      try {
        const res = await api.get("/calendar/status");
        if (mounted) setInitialized(!!res.data.initialized);
      } catch (err) {
        setInitialized(false);
      }
    }
    fetchStatus();
    return () => (mounted = false);
  }, []);

  async function handleInitialize() {
    setMessage("");
    setLoadingInit(true);
    try {
      const res = await api.post("/calendar/initialize");
      setMessage(res.data.message || "Calendar initialized");
      setInitialized(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Initialization failed");
    } finally {
      setLoadingInit(false);
    }
  }

  return (
    <div className="dashboard-wrapper">
      {/* ---------- HEADER ---------- */}
      <div className="dashboard-header">
        <h1>📊 Calendar Team Dashboard</h1>

        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      <div className="welcome-box">
        <div className="welcome-text">
          👋 Welcome, <span>{auth?.name || "Calendar Team Member"}</span>
          <span className="role-pill">{auth?.role}</span>
        </div>

        <div className="sub-text">Manage batches, placement data and statistics</div>
      </div>

      {/* ---------- CARDS ---------- */}
      <div className="dashboard-grid">
        <Card
          title="Assign SPOC"
          description="Assign companies to SPOCs"
          path="/assign-spoc"
          icon="🧑‍💼"
        />

        <Card
          title="Approve Dates"
          description="Approve, reject or suggest drive dates"
          path="/calendar"
          icon="✅"
        />

        <Card
          title="Completed Approvals"
          description="View drives that are fully approved"
          path="/completed-approvals"
          icon="📄"
        />

        <Card
          title="My Drives"
          description="Act as SPOC and manage assigned companies"
          path="/spoc"
          icon="🏢"
        />

        <Card
          title="View Calendar"
          description="Visual calendar of all company drives"
          path="/view-calendar"
          icon="📅"
        />

        <Card
          title={initialized ? "Calendar Initialized" : "Initialize Calendar"}
          description={
            initialized
              ? "Calendar is ready"
              : "Create initial calendar structure for drives"
          }
          icon="🗓️"
          onClick={handleInitialize}
          disabled={loadingInit || initialized}
        />
      </div>

      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </div>
  );
}
