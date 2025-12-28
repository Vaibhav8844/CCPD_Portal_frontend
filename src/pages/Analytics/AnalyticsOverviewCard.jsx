import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AnalyticsOverviewCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-xl font-semibold mb-6">
        Placement Overview
      </h2>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KPI title="Total Students" value={data.totalStudents} />
        <KPI title="Placed Students" value={data.placedStudents} />
        <KPI title="Placement %" value={`${data.placementPercentage}%`} />
        <KPI title="Avg CTC (LPA)" value={data.avgCTC} />
        <KPI title="Median CTC" value={data.medianCTC} />
        <KPI title="Highest CTC" value={data.highestCTC} />
      </div>

      {/* BRANCH-WISE BAR CHART */}
      <div className="h-72">
        <h3 className="text-lg font-medium mb-2">
          Branch-wise Placements
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.branchWise}>
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="placed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-gray-900">
        {value}
      </div>
    </div>
  );
}
