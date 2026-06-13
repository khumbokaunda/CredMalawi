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
  AreaChart,
  Area,
} from "recharts";
import Reveal from "@/components/motion/Reveal";

const RED = "#E11D2A";
const GOLD = "#F5A623";
const GREEN = "#16A34A";
const BLUE = "#1D4ED8";
const GRID = "#E2E8F0";
const AXIS = "#94A3B8";

const PIE_COLORS = [RED, GOLD, GREEN, BLUE, "#94A3B8"];

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  color: "#0F172A",
  fontSize: 12,
  boxShadow: "0 10px 30px -12px rgba(15,23,42,0.22)",
};

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
      <ChartCard title="Credentials by region of Malawi" accent="red" delay={0}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byRegion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="region" tick={{ fontSize: 12, fill: AXIS }} axisLine={{ stroke: GRID }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.05)" }} />
            <Bar dataKey="credentials" fill={RED} radius={[6, 6, 0, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Badge categories" accent="gold" delay={0.08}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={categories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={92}
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={2}
              animationDuration={900}
              label={{ fill: "#94A3B8", fontSize: 11 }}
            >
              {categories.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top skills / badge categories" accent="gold" delay={0.12}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={topSkills}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="skill"
              width={150}
              tick={{ fontSize: 11, fill: AXIS }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.05)" }} />
            <Bar dataKey="count" fill={GOLD} radius={[0, 6, 6, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Issuance over time" accent="green" delay={0.16}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={issuanceTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="issuedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GREEN} stopOpacity={0.45} />
                <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: AXIS }} axisLine={{ stroke: GRID }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: AXIS }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: GRID }} />
            <Area
              type="monotone"
              dataKey="issued"
              stroke={GREEN}
              strokeWidth={2.5}
              fill="url(#issuedFill)"
              dot={{ r: 3, fill: GREEN }}
              activeDot={{ r: 5 }}
              animationDuration={1100}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

const accentBar = {
  red: "from-ictam to-ictam-dark",
  gold: "from-psc to-psc-dark",
  green: "from-verified to-verified-dark",
} as const;

function ChartCard({
  title,
  children,
  accent,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  accent: keyof typeof accentBar;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="card overflow-hidden p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`h-4 w-1 rounded-full bg-gradient-to-b ${accentBar[accent]}`} />
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </Reveal>
  );
}
