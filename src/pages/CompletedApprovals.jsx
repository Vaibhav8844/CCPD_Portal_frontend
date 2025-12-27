import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function CompletedApprovals() {
  const { token } = useAuth();
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    api
      .get("/drives/completed", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setDrives(res.data.completed));
  }, []);

  return (
    <div>
      <h2>Completed Approvals</h2>

      {drives.length === 0 && <p>No completed approvals</p>}

      {drives.map((d, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
          <h3>{d.company}</h3>
          <p>PPT: {d.ppt_status}</p>
          <p>OT: {d.ot_status}</p>
          <p>Interview: {d.interview_status}</p>
        </div>
      ))}
    </div>
  );
}
