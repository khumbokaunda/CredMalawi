"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Provider, Region } from "@/lib/types";
import { MapPin, CheckBadge } from "@/components/icons";

const regions: (Region | "All")[] = ["All", "Northern", "Central", "Southern"];

export default function RegistryClient({
  providers,
}: {
  providers: Provider[];
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");
  const [programme, setProgramme] = useState("All");

  const allProgrammes = useMemo(() => {
    const set = new Set<string>();
    providers.forEach((p) => p.programmes.forEach((pr) => set.add(pr)));
    return ["All", ...Array.from(set).sort()];
  }, [providers]);

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase()) ||
        p.shortName.toLowerCase().includes(query.toLowerCase());
      const matchesRegion = region === "All" || p.region === region;
      const matchesProgramme =
        programme === "All" || p.programmes.includes(programme);
      return matchesQuery && matchesRegion && matchesProgramme;
    });
  }, [providers, query, region, programme]);

  return (
    <div className="container-page py-10">
      {/* Controls */}
      <div className="card mb-8 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Search
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Provider name or city…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-psc focus:outline-none focus:ring-1 focus:ring-psc"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "All")}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-psc focus:outline-none focus:ring-1 focus:ring-psc"
          >
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Programme
          </label>
          <select
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-psc focus:outline-none focus:ring-1 focus:ring-psc"
          >
            {allProgrammes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        Showing {filtered.length} of {providers.length} providers
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/registry/${p.id}`}
            className="card flex flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-sm font-bold text-psc-light">
                  {p.shortName}
                </span>
                <div>
                  <h3 className="font-bold leading-tight text-ink">{p.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.city}, {p.region} Region
                  </p>
                </div>
              </div>
              <span
                className={`tag ${
                  p.status === "Accredited"
                    ? "bg-verified-bg text-verified"
                    : "bg-amber-50 text-psc-dark"
                }`}
              >
                {p.status === "Accredited" && <CheckBadge className="h-3.5 w-3.5" />}
                {p.status}
              </span>
            </div>

            <p className="mt-4 line-clamp-2 text-sm text-slate-600">{p.about}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Authorised programmes
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.programmes.map((pr) => (
                  <span key={pr} className="tag bg-slate-100 text-slate-600">
                    {pr}
                  </span>
                ))}
              </div>
            </div>

            <span className="mt-5 text-sm font-semibold text-ictam-blue">
              View provider profile →
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center text-slate-500">
          No providers match your filters.
        </div>
      )}
    </div>
  );
}
