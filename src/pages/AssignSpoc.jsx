import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./styles/AssignSpoc.css";

export default function AssignSpoc() {
  const { token } = useAuth();

  const [company, setCompany] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  const search = async (value) => {
    setQuery(value);
    setSelected(null);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    const res = await api.get(`/users/spocs?q=${value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setResults(res.data.users);
  };

  const assign = async () => {
    if (!company) {
      alert("Company is required");
      return;
    }

    if (!selected || !selected.email) {
      alert("Please select a SPOC from suggestions");
      return;
    }

    console.log("Assigning:", company, selected.email); // 🔍 DEBUG

    await api.post(
      "/companies/assign",
      {
        company,
        spoc_email: selected.email, // ✅ guaranteed now
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("SPOC assigned successfully");

    // reset
    setCompany("");
    setQuery("");
    setSelected(null);
    setResults([]);
  };

  return (
    <div className="assign-spoc-wrapper">
      <div className="assign-spoc-card">
        <div className="assign-header">
          <span className="assign-icon">🧑‍💼</span>
          <h2>Assign SPOC</h2>
        </div>

        <p className="subtitle">
          🔗 Link a company with its Single Point of Contact
        </p>

        <div className="form-group">
          <label>🏢 Company Name</label>
          <input
            placeholder="Enter company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>🔍 SPOC Name</label>
          <input
            placeholder="Type SPOC name"
            value={query}
            onChange={(e) => search(e.target.value)}
          />

          {results.length > 0 && (
            <ul className="suggestions">
              {results.map((u, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setSelected(u);
                    setQuery(u.name);
                    setResults([]);
                  }}
                >
                  <span className="name">👤 {u.name}</span>
                  <span className="email">{u.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <div className="selected-box">
            ✅ Selected SPOC: <b>{selected.name}</b>
          </div>
        )}

        <button className="primary-btn" onClick={assign}>
          🚀 Assign SPOC
        </button>
      </div>
    </div>
  );
}
