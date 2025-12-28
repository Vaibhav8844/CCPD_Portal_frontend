import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./styles/AssignSpoc.css";

export default function AdminAssociates() {
  const { auth } = useAuth();
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("SPOC");
  const [loading, setLoading] = useState(false);

  async function fetchAssociates() {
    try {
      const res = await api.get(`/users/spocs?q=`); // empty -> returns all
      // if diagnostics provided, backend may return in warning — but users field is used
      setRows(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchAssociates();
  }, []);

  async function handleAdd() {
    if (!name || !email || !role) return alert("All fields required");
    setLoading(true);
    try {
      await api.post(
        "/calendar/associates/append",
        { name, email, role },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setName("");
      setEmail("");
      setRole("SPOC");
      await fetchAssociates();
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(emailToRemove) {
    if (!confirm(`Remove associate ${emailToRemove}?`)) return;
    try {
      await api.post(
        "/calendar/associates/delete",
        { email: emailToRemove },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      await fetchAssociates();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to remove");
    }
  }

  return (
    <div className="assign-spoc-wrapper">
      <div className="assign-spoc-card">
        <div className="assign-header">
          <span className="assign-icon">👥</span>
          <h2>Modify Associates</h2>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="SPOC">SPOC</option>
            <option value="CALENDAR_TEAM">CALENDAR_TEAM</option>
            <option value="DATA_TEAM">DATA_TEAM</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <button className="primary-btn" onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add Associate"}
        </button>

        <h3 style={{ marginTop: 18 }}>Existing Associates</h3>
        <div style={{ maxHeight: 300, overflow: "auto", marginTop: 8 }}>
          {rows.length === 0 ? (
            <div>No associates</div>
          ) : (
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.role}</td>
                    <td>
                      <button onClick={() => handleRemove(r.email)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
