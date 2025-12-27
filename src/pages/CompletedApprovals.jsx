import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./styles/CompletedApprovals.css";

export default function CompletedApprovals() {
  const { auth } = useAuth();
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    if (!auth?.token) return;

    api
      .get("/drives/completed", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then(res => setDrives(res.data.completed || []));
  }, [auth]);

  return (
    <div className="completed-page">
      <h2 className="completed-title">✅ Completed Approvals</h2>

      {drives.length === 0 ? (
        <div className="empty-state">
          No completed approvals yet 💤
        </div>
      ) : (
        <div className="completed-grid">
          {drives.map((d, i) => (
            <div key={i} className="completed-card">
              <div className="company-name">{d.company}</div>

              <div className="status-row">
                <span>PPT</span>
                <span className="status-pill status-approved">✅ Approved</span>
              </div>

              <div className="status-row">
                <span>OT</span>
                <span className="status-pill status-approved">✅ Approved</span>
              </div>

              <div className="status-row">
                <span>Interview</span>
                <span className="status-pill status-approved">✅ Approved</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
