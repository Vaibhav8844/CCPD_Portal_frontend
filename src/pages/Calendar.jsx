import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./styles/Calendar.css";

export default function Calendar() {
  const { auth, logout } = useAuth();
  const [requests, setRequests] = useState([]);

  // ---------- SUGGEST MODAL ----------
  const [suggesting, setSuggesting] = useState(null);
  const [suggestedDate, setSuggestedDate] = useState("");

  // ---------- HELPERS ----------
  const hasDate = (dt) => dt && dt.trim() !== "";
  const isActionable = (status) => status === "PENDING";

  const hasAnyActionableSlot = (r) =>
    (hasDate(r.ppt_datetime) && isActionable(r.ppt_status)) ||
    (hasDate(r.ot_datetime) && isActionable(r.ot_status)) ||
    (hasDate(r.interview_datetime) && isActionable(r.interview_status));

  // ---------- LOAD ----------
  const load = async () => {
    if (!auth?.token) return;

    const res = await api.get("/drives/pending", {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    setRequests(res.data.pending.filter(hasAnyActionableSlot));
  };

  useEffect(() => {
    load();
  }, [auth]);

  // ---------- ACTION ----------
  const takeAction = async (request_id, company, slot, action) => {
    if (action === "SUGGEST") {
      setSuggesting({ request_id, company, slot });
      setSuggestedDate("");
      return;
    }

    try {
      await api.post(
        "/drives/approve",
        { request_id, company, slot, action },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  // ---------- SUBMIT SUGGEST ----------
  const submitSuggestion = async () => {
    if (!suggestedDate) {
      alert("Please select a date & time");
      return;
    }

    try {
      await api.post(
        "/drives/approve",
        {
          request_id: suggesting.request_id,
          company: suggesting.company,
          slot: suggesting.slot,
          action: "SUGGEST",
          suggested_datetime: suggestedDate,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      setSuggesting(null);
      setSuggestedDate("");
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Suggestion failed");
    }
  };

  // ---------- UI ----------
  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2 className="calendar-title">📅 Calendar Team – Approvals</h2>
        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>
      </div>

      {requests.length === 0 && (
        <div className="empty-state">
          No pending approvals 🎉
        </div>
      )}

      {requests.map((r) => (
        <div key={r.request_id} className="request-card">
          <div className="company-title">{r.company}</div>
          <div className="request-id">Request ID: {r.request_id}</div>

          {/* PPT */}
          <div className="slot-row">
            <span className="slot-label">PPT:</span>{" "}
            {r.ppt_datetime || "Not scheduled"} |
            <span className="slot-status"> {r.ppt_status}</span>

            {hasDate(r.ppt_datetime) && r.ppt_status === "PENDING" && (
              <div className="actions">
                <button
                  className="btn btn-approve"
                  onClick={() =>
                    takeAction(r.request_id, r.company, "PPT", "APPROVE")
                  }
                >
                  Approve
                </button>
                <button
                  className="btn btn-reject"
                  onClick={() =>
                    takeAction(r.request_id, r.company, "PPT", "REJECT")
                  }
                >
                  Reject
                </button>
                <button
                  className="btn btn-suggest"
                  onClick={() =>
                    takeAction(r.request_id, r.company, "PPT", "SUGGEST")
                  }
                >
                  Suggest
                </button>
              </div>
            )}
          </div>

          {/* OT */}
          <div className="slot-row">
            <span className="slot-label">OT:</span>{" "}
            {r.ot_datetime || "Not scheduled"} |
            <span className="slot-status"> {r.ot_status}</span>

            {hasDate(r.ot_datetime) && r.ot_status === "PENDING" && (
              <div className="actions">
                <button
                  className="btn btn-approve"
                  onClick={() =>
                    takeAction(r.request_id, r.company, "OT", "APPROVE")
                  }
                >
                  Approve
                </button>
                <button
                  className="btn btn-reject"
                  onClick={() =>
                    takeAction(r.request_id, r.company, "OT", "REJECT")
                  }
                >
                  Reject
                </button>
                <button
                  className="btn btn-suggest"
                  onClick={() =>
                    takeAction(r.request_id, r.company, "OT", "SUGGEST")
                  }
                >
                  Suggest
                </button>
              </div>
            )}
          </div>

          {/* INTERVIEW */}
          <div className="slot-row">
            <span className="slot-label">Interview:</span>{" "}
            {r.interview_datetime || "Not scheduled"} |
            <span className="slot-status"> {r.interview_status}</span>

            {hasDate(r.interview_datetime) &&
              r.interview_status === "PENDING" && (
                <div className="actions">
                  <button
                    className="btn btn-approve"
                    onClick={() =>
                      takeAction(
                        r.request_id,
                        r.company,
                        "INTERVIEW",
                        "APPROVE"
                      )
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() =>
                      takeAction(
                        r.request_id,
                        r.company,
                        "INTERVIEW",
                        "REJECT"
                      )
                    }
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-suggest"
                    onClick={() =>
                      takeAction(
                        r.request_id,
                        r.company,
                        "INTERVIEW",
                        "SUGGEST"
                      )
                    }
                  >
                    Suggest
                  </button>
                </div>
              )}
          </div>
        </div>
      ))}

      {/* -------- MODAL -------- */}
      {suggesting && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Suggest {suggesting.slot} Date</h3>

            <input
              type="datetime-local"
              value={suggestedDate}
              onChange={(e) => setSuggestedDate(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn btn-suggest" onClick={submitSuggestion}>
                Submit
              </button>
              <button
                className="btn btn-reject"
                onClick={() => {
                  setSuggesting(null);
                  setSuggestedDate("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
