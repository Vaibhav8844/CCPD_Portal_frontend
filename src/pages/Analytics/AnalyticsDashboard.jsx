import { useEffect, useState } from "react";
import AnalyticsOverviewCard from "../Analytics/AnalyticsOverviewCard";
import '../Analytics/styles/AnalyticsDashboard.css';

export default function DataAnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [branch, setBranch] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);
    const res = await fetch(
      "http://localhost:5000/api/analytics/overview?spreadsheetId=1T20_S40uoJqSq-CiNrkXS8OSAoy7Svk-jUxXg9EdsUU"
    );
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  if (loading) return <div className="analytics-loading">Loading analytics…</div>;
  if (!data) return <div className="analytics-loading">No data available</div>;

  return (
    <div className="analytics-page">
      {/* HEADER */}
      <div className="analytics-header">
        <h1>📈 Placement Analytics</h1>

        {/* BRANCH FILTER */}
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="branch-filter"
        >
          <option value="ALL">All Branches</option>
          {data.branchWise.map((b) => (
            <option key={b.branch} value={b.branch}>
              {b.branch}
            </option>
          ))}
        </select>
      </div>

      {/* OVERVIEW CARD */}
      <AnalyticsOverviewCard
        data={{
          ...data,
          branchWise:
            branch === "ALL"
              ? data.branchWise
              : data.branchWise.filter(
                  (b) => b.branch === branch
                ),
        }}
      />
    </div>
  );
}