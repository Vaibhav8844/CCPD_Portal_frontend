import { useNavigate } from "react-router-dom";
import "./DashboardCard.css";

export default function DashboardCard({ title, description, icon, path }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-card" onClick={() => navigate(path)}>
      <div className="dashboard-card-icon">{icon}</div>
      <div className="dashboard-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
