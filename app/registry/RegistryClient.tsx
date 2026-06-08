"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
          <label className="eyebrow">Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Provider name or city…"
            className="input mt-1"
          />
        </div>
        <div>
          <label className="eyebrow">Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "All")}
            className="input mt-1"
          >
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="eyebrow">Programme</label>
          <select
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
            className="input mt-1"
          >
            {allProgrammes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-ink-faint">
        Showing {filtered.length} of {providers.length} providers
      </p>

      <motion.div layout className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}
            >
              <Link
                href={`/registry/${p.id}`}
                className="card hover-lift hover-glow-gold flex h-full flex-col p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-700 text-sm font-bold text-psc-light ring-1 ring-base-600">
                      {p.shortName}
                    </span>
                    <div>
                      <h3 className="font-bold leading-tight text-ink">{p.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.city}, {p.region} Region
                      </p>
                    </div>
                  </div>
                  <span
                    className={`tag ${
                      p.status === "Accredited"
                        ? "border border-verified/30 bg-verified/10 text-verified-light"
                        : "border border-psc/30 bg-psc/10 text-psc-light"
                    }`}
                  >
                    {p.status === "Accredited" && <CheckBadge className="h-3.5 w-3.5" />}
                    {p.status}
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-ink-muted">{p.about}</p>

                <div className="mt-4">
                  <p className="eyebrow">Authorised programmes</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.programmes.map((pr) => (
                      <span key={pr} className="tag border border-base-600 bg-base-700/50 text-ink-muted">
                        {pr}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="mt-5 text-sm font-semibold text-ictam-light">
                  View provider profile →
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center text-ink-muted">
          No providers match your filters.
        </div>
      )}
    </div>
  );
}
