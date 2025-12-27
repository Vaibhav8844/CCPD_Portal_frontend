import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

function computeStatus(drive) {
  if (!drive) return { label: "Not Requested", color: "gray" };

  const statuses = [drive.ppt_status, drive.ot_status, drive.interview_status];

  if (statuses.every((s) => s === "APPROVED"))
    return { label: "Fully Approved", color: "green" };

  if (statuses.some((s) => s === "APPROVED"))
    return { label: "Partially Approved", color: "orange" };

  return { label: "Pending", color: "blue" };
}

export default function SpocHome() {
  const { token, logout } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [driveMap, setDriveMap] = useState({});
  const [drives, setDrives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const [companiesRes, drivesRes] = await Promise.all([
        api.get("/companies/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api
          .get("/drives/my", {
            headers: { Authorization: `Bearer ${token}` },
          })
      ]);

      setCompanies(companiesRes.data.companies);

      const map = {};
      drivesRes.data.drives.forEach((d) => {
        map[d.company] = d;
      });
      setDriveMap(map);
    }
    load();
  }, []);

  return (
    <div>
      <h2>SPOC Dashboard</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {companies.map((company, i) => {
          const status = computeStatus(driveMap[company]);

          return (
            <div
              key={i}
              onClick={() => navigate(`/spoc/${company}`)}
              style={{
                border: "1px solid #ccc",
                padding: 16,
                width: 260,
                cursor: "pointer",
                borderRadius: 8,
              }}
            >
              <h3>{company}</h3>
              <p>
                <b>Status:</b>{" "}
                <span style={{ color: status.color }}>{status.label}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
