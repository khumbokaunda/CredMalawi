"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const PIE_COLORS = ["#1B4F9C", "#C8920E", "#16A34A", "#C8102E", "#64748B"];

export default function IctamCharts({
  byRegion,
  topSkills,
  categories,
  issuanceTrend,
}: {
  byRegion: { region: string; credentials: number }[];
  topSkills: { skill: string; count: number }[];
  categories: { name: string; value: number }[];
  issuanceTrend: { month: string; issued: number }[];
}) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {/* Credentials by region */}
      <ChartCard title="Credentials by region of Malawi">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byRegion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="region" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="credentials" fill="#1B4F9C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Categories pie */}
      <ChartCard title="Badge categories">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {categories.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top skills */}
      <ChartCard title="Top skills / badge categories">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={topSkills}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="skill"
              width={150}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#C8920E" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Issuance trend */}
      <ChartCard title="Issuance over time">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={issuanceTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="issued"
              stroke="#16A34A"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-bold text-ink">{title}</h3>
      {children}
    </div>
  );
}
