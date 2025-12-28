import { useState, useEffect } from "react";
import "./styles/EnrollStudents.css";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { getAcademicYear } from "../api/academicYear";

export default function EnrollStudents() {
  const { auth } = useAuth();

  const [file, setFile] = useState(null);
  const [academicYear, setAcademicYear] = useState("");
  const [branch, setBranch] = useState("CS");
  const [degreeType, setDegreeType] = useState("UG");
  const [program, setProgram] = useState("BTech");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch academic year from backend
  useEffect(() => {
    getAcademicYear().then(setAcademicYear);
  }, []);

  /* ✅ AUTH GUARD — TOP LEVEL */
  useEffect(() => {
    if (!auth?.token) {
      setMessage("⏳ Waiting for authentication...");
    }
  }, [auth]);

  async function handleSubmit(e) {
    e.preventDefault();

    /* ✅ HARD AUTH CHECK */
    if (!auth?.token) {
      setMessage("❌ You are not authenticated. Please login again.");
      return;
    }

    if (!file) {
      setMessage("❌ Please upload an Excel file");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("file", file);
      // Do NOT send year; backend will use admin-set year
      form.append("branch", branch);
      form.append("degreeType", degreeType);
      form.append("program", program);

      const res = await api.post(
        "/data/enroll/students",
        form,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;

      setMessage(
        `✅ Enrolled ${data.inserted} students into ${data.workbook} (${data.sheet})`
      );
      setFile(null);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "❌ Enrollment failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="enroll-page">
      <h1>🧑‍🎓 Enroll Students</h1>
      <p className="subtitle">
        Upload Excel file and enroll students into Google Sheets
      </p>

      <form className="enroll-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Academic Year</label>
          <div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{academicYear || "-"}</div>
        </div>

        <div className="form-group">
          <label>Degree Type</label>
          <select
            value={degreeType}
            onChange={(e) => setDegreeType(e.target.value)}
          >
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </select>
        </div>

        <div className="form-group">
          <label>Program</label>
          <select value={program} onChange={(e) => setProgram(e.target.value)}>
            <option value="BTech">BTech</option>
            <option value="MTech">MTech</option>
          </select>
        </div>

        <div className="form-group">
          <label>Branch</label>
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="CS">CS - Computer Science</option>
            <option value="EC">EC - Electronics & Communication</option>
            <option value="EE">EE - Electrical Engineering</option>
            <option value="ME">ME - Mechanical Engineering</option>
          </select>
        </div>

        <div className="form-group">
          <label>Excel File</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading || !auth?.token}>
          {loading ? "Enrolling..." : "Enroll Students"}
        </button>

        {message && <div className="form-message">{message}</div>}
      </form>
    </div>
  );
}