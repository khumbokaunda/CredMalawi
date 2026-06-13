"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Region } from "@/lib/types";
import { useData } from "@/lib/store";
import { MapPin, CheckBadge } from "@/components/icons";

const regions: (Region | "All")[] = ["All", "Northern", "Central", "Southern"];

export default function RegistryClient() {
  const { publicProviders } = useData();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");
  const [programme, setProgramme] = useState("All");

  const allProgrammes = useMemo(() => {
    const set = new Set<string>();
    publicProviders.forEach((p) => p.programmes.forEach((pr) => set.add(pr)));
    return ["All", ...Array.from(set).sort()];
  }, [publicProviders]);

  const filtered = useMemo(() => {
    return publicProviders.filter((p) => {
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
  }, [publicProviders, query, region, programme]);

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

      <p className="mb-4 text-sm text-slate-400">
        Showing {filtered.length} of {publicProviders.length} providers
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
                className="card hover-lift flex h-full flex-col p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-sm font-bold text-psc-light">
                      {p.shortName}
                    </span>
                    <div>
                      <h3 className="font-bold leading-tight text-slate-900">{p.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.city}, {p.region} Region
                      </p>
                    </div>
                  </div>
                  <span
                    className={`tag ${
                      p.status === "Accredited"
                        ? "border border-verified/20 bg-verified-tint text-verified-dark"
                        : "border border-psc/30 bg-psc-tint text-psc-dark"
                    }`}
                  >
                    {p.status === "Accredited" && <CheckBadge className="h-3.5 w-3.5 text-verified" />}
                    {p.status}
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-slate-500">{p.about}</p>

                <div className="mt-4">
                  <p className="eyebrow">Authorised programmes</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.programmes.map((pr) => (
                      <span key={pr} className="tag border border-slate-200 bg-slate-50 text-slate-500">
                        {pr}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="mt-5 text-sm font-semibold text-brandblue">
                  View provider profile →
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center text-slate-500">
          No providers match your filters.
        </div>
      )}
    </div>
  );
}
