import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Calendar() {
  const { token, logout } = useAuth();
  const [requests, setRequests] = useState([]);

  // ---------- SUGGEST MODAL STATE ----------
  const [suggesting, setSuggesting] = useState(null);
  // { request_id, company, slot }
  const [suggestedDate, setSuggestedDate] = useState("");

  // ---------- HELPERS ----------
  const hasDate = (dt) => dt && dt.trim() !== "";

  // 🔥 FINAL RULE: only PENDING keeps card open
  const isActionable = (status) => status === "PENDING";

  const hasAnyActionableSlot = (r) =>
    (hasDate(r.ppt_datetime) && isActionable(r.ppt_status)) ||
    (hasDate(r.ot_datetime) && isActionable(r.ot_status)) ||
    (hasDate(r.interview_datetime) &&
      isActionable(r.interview_status));

  // ---------- LOAD ----------
  const load = async () => {
    const res = await api.get("/drives/pending", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 🔥 AUTO-CLOSE LOGIC
    setRequests(res.data.pending.filter(hasAnyActionableSlot));
  };

  useEffect(() => {
    load();
  }, []);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  // ---------- SUBMIT SUGGESTION ----------
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuggesting(null);
      setSuggestedDate("");

      await load(); // 🔥 closes card now
    } catch (err) {
      alert(err.response?.data?.message || "Suggestion failed");
    }
  };

  // ---------- UI ----------
  return (
    <div>
      <h2>Calendar Team – Approvals</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      {requests.map((r) => (
        <div
          key={r.request_id}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 16,
            borderRadius: 8,
          }}
        >
          <h3>{r.company}</h3>
          <p><b>Request ID:</b> {r.request_id}</p>

          {/* PPT */}
          <p>
            <b>PPT:</b> {r.ppt_datetime || "Not scheduled"} | Status:{" "}
            {r.ppt_status}

            {hasDate(r.ppt_datetime) &&
              r.ppt_status === "PENDING" && (
                <>
                  <button
                    onClick={() =>
                      takeAction(r.request_id, r.company, "PPT", "APPROVE")
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      takeAction(r.request_id, r.company, "PPT", "REJECT")
                    }
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      takeAction(r.request_id, r.company, "PPT", "SUGGEST")
                    }
                  >
                    Suggest
                  </button>
                </>
              )}
          </p>

          {/* OT */}
          <p>
            <b>OT:</b> {r.ot_datetime || "Not scheduled"} | Status:{" "}
            {r.ot_status}

            {hasDate(r.ot_datetime) &&
              r.ot_status === "PENDING" && (
                <>
                  <button
                    onClick={() =>
                      takeAction(r.request_id, r.company, "OT", "APPROVE")
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      takeAction(r.request_id, r.company, "OT", "REJECT")
                    }
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      takeAction(r.request_id, r.company, "OT", "SUGGEST")
                    }
                  >
                    Suggest
                  </button>
                </>
              )}
          </p>

          {/* INTERVIEW */}
          <p>
            <b>Interview:</b>{" "}
            {r.interview_datetime || "Not scheduled"} | Status:{" "}
            {r.interview_status}

            {hasDate(r.interview_datetime) &&
              r.interview_status === "PENDING" && (
                <>
                  <button
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
                </>
              )}
          </p>
        </div>
      ))}

      {/* -------- SUGGEST MODAL -------- */}
      {suggesting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              minWidth: 320,
            }}
          >
            <h3>Suggest {suggesting.slot} Date</h3>

            <input
              type="datetime-local"
              value={suggestedDate}
              onChange={(e) =>
                setSuggestedDate(e.target.value)
              }
            />

            <br /><br />

            <button onClick={submitSuggestion}>Submit</button>
            <button
              onClick={() => {
                setSuggesting(null);
                setSuggestedDate("");
              }}
              style={{ marginLeft: 10 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
