import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function CalendarDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const Card = ({ title, description, path }) => (
    <div
      onClick={() => navigate(path)}
      style={{
        border: "1px solid #ccc",
        borderRadius: 10,
        padding: 20,
        width: 260,
        cursor: "pointer",
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <div>
      <h2>Calendar Team Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Card
          title="Assign SPOC"
          description="Assign companies to SPOCs"
          path="/assign-spoc"
        />

        <Card
          title="Approve Dates"
          description="Approve, reject or suggest drive dates"
          path="/calendar"
        />
        <Card
          title="Completed Approvals"
          description="View fully approved drives"
          path="/completed-approvals"
        />

        <Card
          title="My Drives"
          description="Act as SPOC and manage assigned companies"
          path="/spoc"
        />
      </div>
    </div>
  );
}
