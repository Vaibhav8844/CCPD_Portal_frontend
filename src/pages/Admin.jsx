import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAcademicYear, setAcademicYear } from "../api/academicYear";
import "./styles/CommonDashboard.css";

export default function Admin() {
	const navigate = useNavigate();
	const [academicYear, setYear] = useState("");
	const [editMode, setEditMode] = useState(false);
	const [input, setInput] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		getAcademicYear().then(setYear).catch(() => setYear(""));
	}, []);

	const handleSave = async () => {
		setSaving(true);
		setError("");
		try {
			const updated = await setAcademicYear(input.trim());
			setYear(updated);
			setEditMode(false);
		} catch (e) {
			setError("Failed to update academic year");
		} finally {
			setSaving(false);
		}
	};

	const Card = ({ title, description, path, icon }) => (
		<div className="dashboard-card" onClick={() => navigate(path)}>
			<div className="card-icon">{icon}</div>
			<div className="card-content">
				<h3>{title}</h3>
				<p>{description}</p>
			</div>
		</div>
	);

	return (
		<div className="dashboard-wrapper">
			<div className="dashboard-header">
				<h1>🛠️ Admin Dashboard</h1>
			</div>

			<div className="dashboard-grid">
				<div className="dashboard-card" style={{ minHeight: 120 }}>
					<div className="card-icon">📅</div>
					<div className="card-content">
						<h3>Academic Year</h3>
						{editMode ? (
							<>
								<input
									value={input}
									onChange={e => setInput(e.target.value)}
									placeholder="e.g. 2025-26"
									style={{ fontSize: 16, padding: 4, marginRight: 8 }}
									disabled={saving}
								/>
								<button onClick={handleSave} disabled={saving || !input.trim()} style={{ marginRight: 8 }}>
									Save
								</button>
								<button onClick={() => setEditMode(false)} disabled={saving}>Cancel</button>
								{error && <div style={{ color: "#ef4444", marginTop: 4 }}>{error}</div>}
							</>
						) : (
							<>
								<div style={{ fontSize: 18, fontWeight: 500 }}>{academicYear || "-"}</div>
								<button style={{ marginTop: 8 }} onClick={() => { setInput(academicYear); setEditMode(true); }}>Edit</button>
							</>
						)}
					</div>
				</div>

				<Card
					title="Modify Associates"
					description="Add or remove Associates (SPOCs, Calendar, Data)"
					path="/admin/associates"
					icon="👥"
				/>

				<Card
					title="Placement Analytics"
					description="Visualize placement statistics and trends"
					path="/analytics"
					icon="📊"
				/>
			</div>
		</div>
	);
}
