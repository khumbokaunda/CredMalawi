import { credentials, providers, learners } from "@/lib/data";
import IctamCharts from "./IctamCharts";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import CountUp from "@/components/motion/CountUp";
import { ShieldCheck } from "@/components/icons";

export const metadata = {
  title: "ICTAM Analytics — CredMalawi",
};

export default function IctamPage() {
  const totalCreds = credentials.length;
  const validCreds = credentials.filter((c) => c.status === "valid").length;
  const revokedCreds = credentials.filter((c) => c.status === "revoked").length;
  const activeProviders = providers.filter((p) => p.status === "Accredited").length;

  const byRegion = ["Northern", "Central", "Southern"].map((region) => ({
    region,
    credentials: credentials.filter((c) => c.region === region).length,
  }));

  const skillCounts = new Map<string, number>();
  credentials.forEach((c) =>
    skillCounts.set(c.skill, (skillCounts.get(c.skill) ?? 0) + 1)
  );
  const topSkills = Array.from(skillCounts.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  const catCounts = new Map<string, number>();
  credentials.forEach((c) =>
    catCounts.set(c.category, (catCounts.get(c.category) ?? 0) + 1)
  );
  const categories = Array.from(catCounts.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const monthCounts = new Map<string, number>();
  credentials
    .slice()
    .sort((a, b) => a.issueDate.localeCompare(b.issueDate))
    .forEach((c) => {
      const d = new Date(c.issueDate);
      const key = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    });
  const issuanceTrend = Array.from(monthCounts.entries()).map(
    ([month, issued]) => ({ month, issued })
  );

  return (
    <div>
      {/* Admin header — led with ICTAM red */}
      <section className="relative overflow-hidden border-b border-base-600/60 bg-mesh">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,29,42,0.16),transparent_55%)]" />
        <div className="container-page relative flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <span className="tag border border-ictam/40 bg-ictam/15 text-ictam-light">
              ICTAM · Admin view
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">
              National Credentialing Analytics
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Aggregate insight across all accredited providers and issued
              credentials.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex items-center gap-2 rounded-xl border border-base-600/60 bg-base-800/60 px-4 py-2 text-sm text-ink-muted">
            <ShieldCheck className="h-4 w-4 text-ictam-light" />
            Private dashboard
          </Reveal>
        </div>
      </section>

      <div className="container-page py-8">
        {/* KPI cards */}
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Total credentials issued" value={totalCreds} tone="red" trend="+18%" />
          <Kpi label="Currently valid" value={validCreds} tone="green" trend="+12%" />
          <Kpi label="Active providers" value={activeProviders} tone="gold" trend="+1" />
          <Kpi label="Revoked" value={revokedCreds} tone="muted" trend="0%" />
        </Stagger>

        <Stagger className="mt-4 grid gap-4 sm:grid-cols-3" delay={0.1}>
          <Kpi label="Registered learners" value={learners.length} tone="muted" small />
          <Kpi label="Distinct skills" value={topSkills.length} tone="muted" small />
          <Kpi
            label="Regions covered"
            value={byRegion.filter((r) => r.credentials > 0).length}
            tone="muted"
            small
          />
        </Stagger>

        <IctamCharts
          byRegion={byRegion}
          topSkills={topSkills}
          categories={categories}
          issuanceTrend={issuanceTrend}
        />

        <p className="mt-8 text-center text-xs text-ink-faint">
          Figures are computed from prototype seed data. A production system
          would pull these from the live credential registry.
        </p>
      </div>
    </div>
  );
}

const toneMap = {
  red: { text: "text-ictam-light", bar: "from-ictam to-ictam-dark" },
  green: { text: "text-verified-light", bar: "from-verified to-verified-dark" },
  gold: { text: "text-psc-light", bar: "from-psc to-psc-dark" },
  muted: { text: "text-ink", bar: "from-base-500 to-base-600" },
} as const;

function Kpi({
  label,
  value,
  tone,
  trend,
  small = false,
}: {
  label: string;
  value: number;
  tone: keyof typeof toneMap;
  trend?: string;
  small?: boolean;
}) {
  const t = toneMap[tone];
  const down = trend?.startsWith("-");
  return (
    <StaggerItem>
      <div className="card hover-lift hover-glow-soft relative overflow-hidden p-5">
        <span className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${t.bar}`} />
        <div className="flex items-start justify-between gap-2">
          <p className="eyebrow">{label}</p>
          {trend && (
            <span
              className={`tag px-2 py-0.5 text-[10px] ${
                trend === "0%" || trend === "+1"
                  ? "bg-base-700/60 text-ink-muted"
                  : down
                  ? "bg-ictam/10 text-ictam-light"
                  : "bg-verified/10 text-verified-light"
              }`}
            >
              {down ? "▾" : "▴"} {trend}
            </span>
          )}
        </div>
        <p className={`mt-2 font-bold ${t.text} ${small ? "text-2xl" : "text-4xl"}`}>
          <CountUp value={value} />
        </p>
      </div>
    </StaggerItem>
  );
}
