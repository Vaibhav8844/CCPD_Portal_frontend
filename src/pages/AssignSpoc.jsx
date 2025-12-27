import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

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
    <div>
      <h2>Assign SPOC</h2>

      <input
        placeholder="Company Name"
        value={company}
        onChange={e => setCompany(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Type SPOC name"
        value={query}
        onChange={e => search(e.target.value)}
      />

      {/* Suggestions */}
      {results.length > 0 && (
        <ul style={{ border: "1px solid #ccc", maxWidth: 300 }}>
          {results.map((u, i) => (
            <li
              key={i}
              style={{ cursor: "pointer", padding: 4 }}
              onClick={() => {
                setSelected(u);
                setQuery(u.name);
                setResults([]);
              }}
            >
              {u.name} ({u.email})
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <p>
          Selected: <b>{selected.name}</b>
        </p>
      )}

      <br />
      <button onClick={assign}>Assign</button>
    </div>
  );
}
