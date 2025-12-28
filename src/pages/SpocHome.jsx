import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/SpocHome.css";

function computeStatus(drive) {
  if (!drive) return { label: "Not Requested", color: "gray" };

  if (drive.drive_status === "Ongoing") {
    return { label: "Ongoing", color: "orange" };
  }
  if (drive.drive_status === "Completed") {
    return { label: "Completed", color: "green" };
  }

  const statuses = [drive.ppt_status, drive.ot_status, drive.interview_status];

  if (statuses.every((s) => s === "APPROVED"))
    return { label: "Scheduled", color: "green" };

  if (statuses.some((s) => s === "APPROVED"))
    return { label: "Partially Approved", color: "orange" };

  return { label: "Pending", color: "blue" };
}

export default function SpocHome() {
  const { auth, logout } = useAuth();   // ✅ FIXED
  const [companies, setCompanies] = useState([]);
  const [driveMap, setDriveMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.token) return;   // ✅ WAIT until auth is ready

    async function load() {
      const [companiesRes, drivesRes] = await Promise.all([
        api.get("/companies/my", {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
        api.get("/drives/my", {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
      ]);

      setCompanies(companiesRes.data.companies || []);

      const map = {};
      drivesRes.data.drives?.forEach((d) => {
        map[d.company] = d;
      });
      setDriveMap(map);
      console.log(auth)
    }

    load();
  }, [auth]);   // ✅ DEPENDENCY FIX

  return (
    <div className="spoc-page">
      <div className="spoc-header">
        <h2 className="spoc-title">📊 SPOC Dashboard</h2>
        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {/* ✅ WELCOME SECTION */}
      <div className="welcome-box">
        <div className="welcome-text">
          👋 Welcome,{" "}
          <span>{auth?.name || "SPOC"}</span>
          <span className="role-pill">{auth?.role}</span>
        </div>

        <div className="sub-text">
          Following are your allotted drives
        </div>
      </div>

      {/* ✅ CARDS */}
      {companies.length === 0 ? (
        <div className="empty-state">No companies assigned yet 💤</div>
      ) : (
        <div className="company-grid">
          {companies.map((company, i) => {
            const status = computeStatus(driveMap[company]);

            return (
              <div
                key={i}
                className="company-card"
                onClick={() => navigate(`/spoc/${company}`)}
              >
                <div className="company-name">{company}</div>

                <div className={`status-pill status-${status.color}`}>
                  {status.color === "green" && "✅"}
                  {status.color === "orange" && "🟠"}
                  {status.color === "blue" && "⏳"}
                  {status.color === "gray" && "📝"}
                  {status.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
