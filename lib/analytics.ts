import type { Credential } from "./types";

export function buildAnalytics(credentials: Credential[]) {
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

  return { byRegion, topSkills, categories, issuanceTrend };
}
