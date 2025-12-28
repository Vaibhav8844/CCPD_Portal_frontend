import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./styles/CommonDashboard.css";

export default function DataTeamDashboard() {
  const navigate = useNavigate();
  const { logout, auth } = useAuth();

  const Card = ({ title, description, path, icon }) => (
    <div className="dashboard-card" onClick={() => navigate(path)}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      {/* ---------- HEADER ---------- */}
      <div className="dashboard-header">
        <h1>📊 Data Team Dashboard</h1>

        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      <div className="welcome-box">
        <div className="welcome-text">
          👋 Welcome, <span>{auth?.name || "Data Team Member"}</span>
          <span className="role-pill">{auth?.role}</span>
        </div>

        <div className="sub-text">
          Manage batches, placement data and statistics
        </div>
      </div>

      {/* ---------- CARDS ---------- */}
      <div className="dashboard-grid">
        <Card
          title="Manage Placement Sheets"
          description="Access and manage all placement-related sheets"
          path="/data/sheets"
          icon="📊"
        />

        <Card
          title="Recompute Statistics"
          description="Recalculate placement stats for branches and batches"
          path="/data/recompute"
          icon="📈"
        />

        <Card
          title="My Drives"
          description="Act as SPOC and manage assigned companies"
          path="/spoc"
          icon="🏢"
        />
        <Card
  title="Placement Analytics"
  description="View branch-wise and overall placement statistics"
  path="/data/analytics"
  icon="📈"
/>

<Card
  title="Enroll Students"
  description="Upload Excel and enroll students into UG / PG workbooks"
  path="/data/enroll/students"
  icon="🧑‍🎓"
/>
      </div>
    </div>
  );
}
