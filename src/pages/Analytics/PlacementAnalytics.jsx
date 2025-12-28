import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../api/client";
import "./styles/Analytics.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function AnalyticsDashboard() {
  const [view, setView] = useState("overall");
  const [degreeType, setDegreeType] = useState("UG");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [view, degreeType]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = "";
      switch (view) {
        case "overall":
          endpoint = "/analytics/overall";
          break;
        case "branchwise":
          endpoint = `/analytics/branchwise/${degreeType}`;
          break;
        case "ctc":
          endpoint = "/analytics/ctc-distribution";
          break;
        case "demographic":
          endpoint = "/analytics/demographic";
          break;
        case "trends":
          endpoint = "/analytics/trends";
          break;
        case "companies":
          endpoint = "/analytics/companies";
          break;
        case "snapshot":
          endpoint = "/analytics/snapshot";
          break;
        default:
          endpoint = "/analytics/overall";
      }

      const response = await api.get(endpoint);
      setData(response.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError(err.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // First recalculate stats
      await api.post("/analytics/recalculate");
      // Then reload data
      await loadData();
    } catch (err) {
      console.error("Error refreshing analytics:", err);
      setError(err.response?.data?.error || "Failed to refresh analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateFormulas = async () => {
    if (!confirm("This will force recalculate all formulas in the placement workbooks. This fixes #N/A and #REF! errors. Continue?")) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/analytics/recalculate-formulas");
      alert(response.data.message || "Formulas recalculated successfully!");
      // Reload data
      await loadData();
    } catch (err) {
      console.error("Error recalculating formulas:", err);
      setError(err.response?.data?.error || "Failed to recalculate formulas");
    } finally {
      setLoading(false);
    }
  };

  const renderOverallStats = () => {
    if (!data) return null;
    return (
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">{data.totalStudents}</div>
        </div>
        <div className="stat-card">
          <h3>Total Placed</h3>
          <div className="stat-value">{data.totalPlaced}</div>
        </div>
        <div className="stat-card">
          <h3>Placement %</h3>
          <div className="stat-value">{data.placementPercentage}%</div>
        </div>
        <div className="stat-card">
          <h3>Average CTC</h3>
          <div className="stat-value">₹{data.averageCTC} LPA</div>
        </div>
        <div className="stat-card">
          <h3>Highest CTC</h3>
          <div className="stat-value">₹{data.highestCTC} LPA</div>
        </div>
        <div className="stat-card">
          <h3>Companies Visited</h3>
          <div className="stat-value">{data.companiesVisited}</div>
        </div>
      </div>
    );
  };

  const renderBranchwiseStats = () => {
    if (!data || !Array.isArray(data)) return null;
    return (
      <div className="branchwise-container">
        <div className="chart-container">
          <h3>Placement Overview</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalStudents" fill="#8884d8" name="Total Students" />
              <Bar dataKey="placed" fill="#82ca9d" name="Placed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Gender-wise Placement</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="maleStudents" fill="#0088FE" name="Male Students" />
              <Bar dataKey="femaleStudents" fill="#FF69B4" name="Female Students" />
              <Bar dataKey="malePlaced" fill="#00C49F" name="Male Placed" />
              <Bar dataKey="femalePlaced" fill="#FF1493" name="Female Placed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>CTC Distribution by Branch</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="highestCTC" fill="#FFD700" name="Highest CTC" />
              <Bar dataKey="averageCTC" fill="#4169E1" name="Average CTC" />
              <Bar dataKey="medianCTC" fill="#32CD32" name="Median CTC" />
              <Bar dataKey="lowestCTC" fill="#FF6347" name="Lowest CTC" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {data.map((branch) => (
          <div key={branch.branch} className="branch-detailed-stats">
            <h3>{branch.branch} - Detailed Statistics</h3>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Students</h4>
                <div className="stat-value">{branch.totalStudents}</div>
                <div className="stat-detail">
                  Male: {branch.maleStudents} | Female: {branch.femaleStudents}
                </div>
              </div>
              
              <div className="stat-card">
                <h4>Eligible Students</h4>
                <div className="stat-value">{branch.eligibleStudents}</div>
                <div className="stat-detail">
                  Male: {branch.maleEligible} | Female: {branch.femaleEligible}
                </div>
              </div>
              
              <div className="stat-card">
                <h4>Placed Students</h4>
                <div className="stat-value">{branch.placed}</div>
                <div className="stat-detail">
                  Male: {branch.malePlaced} | Female: {branch.femalePlaced}
                </div>
              </div>
              
              <div className="stat-card">
                <h4>Placement Rate</h4>
                <div className="stat-value">{branch.placementPercentage}%</div>
                <div className="stat-detail">
                  Of Total: {branch.placementPercentageOfTotal}%
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h4>Male Placement %</h4>
                <div className="stat-value">{branch.malePlacedPercentageOfEligible}%</div>
                <div className="stat-detail">
                  Of Total: {branch.malePlacedPercentageOfTotal}%
                </div>
              </div>
              
              <div className="stat-card">
                <h4>Female Placement %</h4>
                <div className="stat-value">{branch.femalePlacedPercentageOfEligible}%</div>
                <div className="stat-detail">
                  Of Total: {branch.femalePlacedPercentageOfTotal}%
                </div>
              </div>
              
              <div className="stat-card">
                <h4>Highest CTC</h4>
                <div className="stat-value">₹{branch.highestCTC} LPA</div>
              </div>
              
              <div className="stat-card">
                <h4>Average CTC</h4>
                <div className="stat-value">₹{branch.averageCTC} LPA</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h4>Median CTC</h4>
                <div className="stat-value">₹{branch.medianCTC} LPA</div>
              </div>
              
              <div className="stat-card">
                <h4>Lowest CTC</h4>
                <div className="stat-value">₹{branch.lowestCTC} LPA</div>
              </div>
              
              <div className="stat-card">
                <h4>Internship Only</h4>
                <div className="stat-value">{branch.onlyInternship}</div>
              </div>
              
              <div className="stat-card">
                <h4>FTE Only</h4>
                <div className="stat-value">{branch.onlyFTE}</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h4>Both Offers</h4>
                <div className="stat-value">{branch.bothOffers}</div>
              </div>
              
              <div className="stat-card">
                <h4>Unplaced (CGPA ≥ 8)</h4>
                <div className="stat-value">{branch.unplacedCGPA8Plus}</div>
              </div>
              
              <div className="stat-card">
                <h4>Unplaced (CGPA ≥ 7.5)</h4>
                <div className="stat-value">{branch.unplacedCGPA7_5Plus}</div>
              </div>
              
              <div className="stat-card">
                <h4>Unplaced (CGPA ≥ 7)</h4>
                <div className="stat-value">{branch.unplacedCGPA7Plus}</div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h4>Unplaced (CGPA ≥ 6.5)</h4>
                <div className="stat-value">{branch.unplacedCGPA6_5Plus}</div>
              </div>
            </div>
          </div>
        ))}

        <div className="comparison-table">
          <h3>Branch Comparison Table</h3>
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Total</th>
                <th>M/F</th>
                <th>Eligible</th>
                <th>Placed</th>
                <th>Place %</th>
                <th>Avg CTC</th>
                <th>High CTC</th>
                <th>Median</th>
                <th>Int</th>
                <th>FTE</th>
                <th>Both</th>
              </tr>
            </thead>
            <tbody>
              {data.map((branch) => (
                <tr key={branch.branch}>
                  <td><strong>{branch.branch}</strong></td>
                  <td>{branch.totalStudents}</td>
                  <td>{branch.maleStudents}/{branch.femaleStudents}</td>
                  <td>{branch.eligibleStudents}</td>
                  <td>{branch.placed}</td>
                  <td>{branch.placementPercentage}%</td>
                  <td>₹{branch.averageCTC}</td>
                  <td>₹{branch.highestCTC}</td>
                  <td>₹{branch.medianCTC}</td>
                  <td>{branch.onlyInternship}</td>
                  <td>{branch.onlyFTE}</td>
                  <td>{branch.bothOffers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCTCDistribution = () => {
    if (!data || !Array.isArray(data)) return null;
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0088FE" name="Number of Students" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="range"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderDemographic = () => {
    if (!data || !data.gender || !data.placementByGender) return null;
    const genderData = [
      { name: "Male", value: data.gender.M || 0, placed: data.placementByGender.M || 0 },
      { name: "Female", value: data.gender.F || 0, placed: data.placementByGender.F || 0 },
      { name: "Other", value: data.gender.other || 0, placed: data.placementByGender.other || 0 },
    ];

    const degreeData = [
      { name: "UG", value: data.degree?.UG || 0, placed: data.placementByDegree?.UG || 0 },
      { name: "PG", value: data.degree?.PG || 0, placed: data.placementByDegree?.PG || 0 },
    ];

    return (
      <div className="demographic-container">
        <div className="chart-section">
          <h3>Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>Degree Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={degreeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Total" />
              <Bar dataKey="placed" fill="#82ca9d" name="Placed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderTrends = () => {
    if (!data || !Array.isArray(data)) return null;
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="academicYear" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalStudents" stroke="#8884d8" name="Total Students" />
            <Line type="monotone" dataKey="placed" stroke="#82ca9d" name="Placed" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="academicYear" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="averageCTC" stroke="#0088FE" name="Avg CTC (LPA)" />
            <Line type="monotone" dataKey="highestCTC" stroke="#FF8042" name="Highest CTC (LPA)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderCompanies = () => {
    if (!data || !Array.isArray(data)) return null;
    return (
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data.slice(0, 15)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="company" type="category" width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="offers" fill="#8884d8" name="Offers" />
          </BarChart>
        </ResponsiveContainer>

        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Offers</th>
                <th>Avg CTC</th>
                <th>Highest CTC</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 20).map((company, idx) => (
                <tr key={idx}>
                  <td>{company.company}</td>
                  <td>{company.offers}</td>
                  <td>₹{company.averageCTC} LPA</td>
                  <td>₹{company.highestCTC} LPA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSnapshot = () => {
    if (!data) return null;
    return (
      <div className="snapshot-container">
        <h2>Placement Snapshot - {data.academicYear}</h2>
        <p className="generated-time">Generated: {new Date(data.generatedAt).toLocaleString()}</p>

        <div className="snapshot-section">
          <h3>Overall Statistics</h3>
          {renderOverallStats()}
        </div>

        <div className="snapshot-section">
          <h3>CTC Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ctcDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="snapshot-section">
          <h3>Top Companies</h3>
          <div className="company-grid">
            {data.topCompanies.slice(0, 10).map((company, idx) => (
              <div key={idx} className="company-card">
                <h4>{company.company}</h4>
                <p>Offers: {company.offers}</p>
                <p>Avg: ₹{company.averageCTC} LPA</p>
              </div>
            ))}
          </div>
        </div>

        <div className="snapshot-section">
          <h3>Historical Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="academicYear" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="placed" stroke="#82ca9d" name="Placed" />
              <Line type="monotone" dataKey="averageCTC" stroke="#0088FE" name="Avg CTC" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Placement Analytics</h1>
        <div className="view-controls">
          <select value={view} onChange={(e) => setView(e.target.value)}>
            <option value="overall">Overall Statistics</option>
            <option value="branchwise">Branch-wise Analysis</option>
            <option value="ctc">CTC Distribution</option>
            <option value="demographic">Demographic Split</option>
            <option value="trends">Trend Analysis</option>
            <option value="companies">Company Statistics</option>
            <option value="snapshot">Placement Snapshot</option>
          </select>

          {view === "branchwise" && (
            <select value={degreeType} onChange={(e) => setDegreeType(e.target.value)}>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </select>
          )}

          <button onClick={handleRecalculateFormulas} className="recalc-btn" title="Fix #N/A and #REF! errors">
            Fix Formulas
          </button>

          <button onClick={handleRefresh} className="refresh-btn">
            Refresh Data
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading analytics...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="analytics-content">
          {view === "overall" && renderOverallStats()}
          {view === "branchwise" && renderBranchwiseStats()}
          {view === "ctc" && renderCTCDistribution()}
          {view === "demographic" && renderDemographic()}
          {view === "trends" && renderTrends()}
          {view === "companies" && renderCompanies()}
          {view === "snapshot" && renderSnapshot()}
        </div>
      )}
    </div>
  );
}
