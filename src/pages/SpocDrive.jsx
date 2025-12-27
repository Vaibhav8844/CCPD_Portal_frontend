import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./styles/SpocDrive.css";

const EMPTY_FORM = {
  type: "Both",
  eligible_pool: "",
  cgpa_cutoff: "",
  ppt_datetime: "",
  ot_datetime: "",
  interview_datetime: "",
  internship_stipend: "",
  fte_ctc: "",
  fte_base: "",
  expected_hires: "",
};

export default function SpocDrive() {
  const { company } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [results, setResults] = useState("");

  const driveCompleted = status?.drive_status === "Completed";

  // ---------- LOCK RULE ----------
  const isLocked =
    status?.ppt_status === "APPROVED" &&
    status?.ot_status === "APPROVED" &&
    status?.interview_status === "APPROVED";

  // ---------- PREFILL ----------
  useEffect(() => {
    api
      .get("/drives/my", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => {
        const drive = res.data.drives.find((d) => d.company === company);

        if (!drive) return;
        if (drive.request_id) {
          api
            .get(`/drives/results/${drive.request_id}`, {
              headers: { Authorization: `Bearer ${auth.token}` },
            })
            .then((res) => {
              setResults(res.data.results || "");
            });
        }

        setRequestId(drive.request_id);
        setStatus(drive);

        setForm({
          type: drive.type || "Both",
          eligible_pool: drive.eligible_pool || "",
          cgpa_cutoff: drive.cgpa_cutoff || "",

          ppt_datetime:
            drive.ppt_status === "SUGGESTED"
              ? drive.ppt_suggested_datetime || ""
              : drive.ppt_datetime || "",

          ot_datetime:
            drive.ot_status === "SUGGESTED"
              ? drive.ot_suggested_datetime || ""
              : drive.ot_datetime || "",

          interview_datetime:
            drive.interview_status === "SUGGESTED"
              ? drive.interview_suggested_datetime || ""
              : drive.interview_datetime || "",

          internship_stipend: drive.internship_stipend || "",
          fte_ctc: drive.fte_ctc || "",
          fte_base: drive.fte_base || "",
          expected_hires: drive.expected_hires || "",
        });
      });
  }, [company, auth.token]);

  // ---------- CHANGE ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- DATE EDIT RULE ----------
  const canEditDate = (slotStatus) =>
    !slotStatus || slotStatus === "REJECTED" || slotStatus === "SUGGESTED";

  // ---------- SUBMIT ----------
const submit = async () => {
  const payload = {
    request_id: requestId,
    company,
    spoc: auth.username,   // ✅ ADD THIS
    ...form,
  };

  const res = await api.post("/drives/request", payload, {
    headers: { Authorization: `Bearer ${auth.token}` },
  });

  if (!requestId) {
    setRequestId(res.data.request_id);
  }

  alert("Drive details saved");
};

  const canPublishResults =
    status?.drive_status === "Completed" &&
    status?.ppt_status === "APPROVED" &&
    status?.ot_status === "APPROVED" &&
    status?.interview_status === "APPROVED";

  // ---------- UI ----------
  return (
    <div className="spoc-drive-page">
  <div className="drive-card">
    <button className="back-btn" onClick={() => navigate("/spoc")}>
      ⬅ Back
    </button>

    <div className="drive-title">
      {company} – Drive Request
    </div>

      <hr />

      {/* -------- Drive Status -------- */}
      <label>Drive Status</label>
      <br />
      <select
        value={status?.drive_status ?? "Scheduled"}
        onChange={async (e) => {
          const newStatus = e.target.value;

          await api.post(
            "/drives/status",
            { request_id: requestId, status: newStatus },
            { headers: { Authorization: `Bearer ${auth.token}` } }
          );

          const res = await api.get("/drives/my", {
            headers: { Authorization: `Bearer ${auth.token}` },
          });

          setStatus((prev) => ({
            ...prev,
            drive_status: newStatus,
          }));
        }}
      >
        <option value="Scheduled">Scheduled</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
      </select>

      <hr />

      {/* -------- NON-DATE FIELDS -------- */}
      <label>Drive Type</label>
      <br />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="Both">Intern + FTE</option>
        <option value="Intern">Internship</option>
        <option value="FTE">FTE</option>
      </select>

      <br />
      <br />

      <input
        name="eligible_pool"
        value={form.eligible_pool}
        placeholder="Eligible Pool"
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="cgpa_cutoff"
        value={form.cgpa_cutoff}
        placeholder="CGPA Cutoff"
        onChange={handleChange}
      />

      <hr />

      {/* -------- DATES -------- */}
      <h3>Proposed Dates</h3>

      <label>PPT</label>
      <br />
      <input
        type="datetime-local"
        name="ppt_datetime"
        value={form.ppt_datetime}
        disabled={driveCompleted || !canEditDate(status?.ppt_status)}
        onChange={handleChange}
      />
      <p>Status: {status?.ppt_status}</p>

      <br />

      <label>OT</label>
      <br />
      <input
        type="datetime-local"
        name="ot_datetime"
        value={form.ot_datetime}
        disabled={driveCompleted || !canEditDate(status?.ot_status)}
        onChange={handleChange}
      />
      <p>Status: {status?.ot_status}</p>

      <br />

      <label>Interview</label>
      <br />
      <input
        type="datetime-local"
        name="interview_datetime"
        value={form.interview_datetime}
        disabled={driveCompleted || !canEditDate(status?.interview_status)}
        onChange={handleChange}
      />
      <p>Status: {status?.interview_status}</p>

      <hr />

      {/* -------- COMPENSATION -------- */}
      <input
        name="internship_stipend"
        value={form.internship_stipend}
        placeholder="Internship Stipend"
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="fte_ctc"
        value={form.fte_ctc}
        placeholder="FTE CTC"
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="fte_base"
        value={form.fte_base}
        placeholder="FTE Base"
        onChange={handleChange}
      />

      <br />
      <br />

      <input
        name="expected_hires"
        value={form.expected_hires}
        placeholder="Expected Hires"
        onChange={handleChange}
      />

      <br />
      <br />

      {!driveCompleted && !isLocked && (
        <button onClick={submit}>Submit / Update Drive</button>
      )}

      {driveCompleted && (
        <p style={{ color: "orange", fontWeight: "bold" }}>
          🛑 Drive is completed. Editing disabled.
        </p>
      )}

      {/* -------- RESULTS -------- */}
      {canPublishResults && (
        <>
          <hr />
          <h3>Publish Results</h3>

          <textarea
            rows={6}
            placeholder="Enter selected student roll numbers (comma separated)"
            style={{ width: "100%", padding: 8 }}
            value={results}
            onChange={(e) => setResults(e.target.value)}
          />

          <br />
          <br />

          <button
            onClick={async () => {
              if (!results.trim()) {
                alert("Please enter results");
                return;
              }

              await api.post(
                "/drives/results",
                {
                  request_id: requestId,
                  results,
                },
                { headers: { Authorization: `Bearer ${auth.token}` } }
              );

              alert("Results published successfully");
            }}
          >
            Publish Results
          </button>
        </>
      )}
    </div>
</div>
  );
}
