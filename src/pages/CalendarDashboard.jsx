import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./styles/CalendarDashboard.css";

export default function CalendarDashboard() {
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
        <div>
          <h1>Calendar Team Dashboard</h1>
          <p className="subtitle">
            Welcome, {auth?.name || "Calendar Team"}
          </p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
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
      </div>
    </div>
  );
}
