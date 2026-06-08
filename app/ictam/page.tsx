import { credentials, providers, learners } from "@/lib/data";
import IctamCharts from "./IctamCharts";
import { ShieldCheck } from "@/components/icons";

export const metadata = {
  title: "ICTAM Analytics — CredMalawi",
};

export default function IctamPage() {
  const totalCreds = credentials.length;
  const validCreds = credentials.filter((c) => c.status === "valid").length;
  const revokedCreds = credentials.filter((c) => c.status === "revoked").length;
  const activeProviders = providers.filter(
    (p) => p.status === "Accredited"
  ).length;

  // Credentials by region
  const byRegion = ["Northern", "Central", "Southern"].map((region) => ({
    region,
    credentials: credentials.filter((c) => c.region === region).length,
  }));

  // Top skills
  const skillCounts = new Map<string, number>();
  credentials.forEach((c) =>
    skillCounts.set(c.skill, (skillCounts.get(c.skill) ?? 0) + 1)
  );
  const topSkills = Array.from(skillCounts.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  // Categories
  const catCounts = new Map<string, number>();
  credentials.forEach((c) =>
    catCounts.set(c.category, (catCounts.get(c.category) ?? 0) + 1)
  );
  const categories = Array.from(catCounts.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  // Issuance by month (cumulative-ish, simple monthly count)
  const monthCounts = new Map<string, number>();
  credentials
    .slice()
    .sort((a, b) => a.issueDate.localeCompare(b.issueDate))
    .forEach((c) => {
      const d = new Date(c.issueDate);
      const key = d.toLocaleDateString("en-GB", {
        month: "short",
        year: "2-digit",
      });
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    });
  const issuanceTrend = Array.from(monthCounts.entries()).map(
    ([month, issued]) => ({ month, issued })
  );

  return (
    <div className="bg-slate-100 min-h-full">
      {/* Admin header */}
      <section className="border-b border-slate-800 bg-ink text-white">
        <div className="container-page flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="tag bg-ictam-red text-white">ICTAM · Admin view</span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              National Credentialing Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Aggregate insight across all accredited providers and issued
              credentials.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            <ShieldCheck className="h-4 w-4 text-psc-light" />
            Private dashboard
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Total credentials issued" value={totalCreds} accent="text-ink" />
          <Kpi label="Currently valid" value={validCreds} accent="text-verified" />
          <Kpi label="Active providers" value={activeProviders} accent="text-ictam-blue" />
          <Kpi label="Revoked" value={revokedCreds} accent="text-ictam-red" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Kpi label="Registered learners" value={learners.length} accent="text-ink" small />
          <Kpi label="Distinct skills" value={topSkills.length} accent="text-ink" small />
          <Kpi label="Regions covered" value={byRegion.filter((r) => r.credentials > 0).length} accent="text-ink" small />
        </div>

        <IctamCharts
          byRegion={byRegion}
          topSkills={topSkills}
          categories={categories}
          issuanceTrend={issuanceTrend}
        />

        <p className="mt-8 text-center text-xs text-slate-400">
          Figures are computed from prototype seed data. A production system
          would pull these from the live credential registry.
        </p>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
  small = false,
}: {
  label: string;
  value: number;
  accent: string;
  small?: boolean;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 font-bold ${accent} ${small ? "text-2xl" : "text-4xl"}`}>
        {value}
      </p>
    </div>
  );
}
