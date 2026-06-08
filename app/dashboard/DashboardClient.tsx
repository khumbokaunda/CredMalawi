"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Credential, Provider } from "@/lib/types";
import { CheckBadge, XCircle, ShieldCheck } from "@/components/icons";
import Sparkline from "@/components/Sparkline";
import IssueModal from "./IssueModal";

interface Template {
  id: string;
  skill: string;
  category: string;
  level: Credential["level"];
  openBadgeVersion: Credential["openBadgeVersion"];
}

type Section = "overview" | "issue" | "templates" | "history";

const seedTemplates = (provider: Provider): Template[] =>
  provider.programmes.map((skill, i) => ({
    id: `tpl-${i}`,
    skill,
    category:
      skill.includes("Security") || skill.includes("Cyber")
        ? "Security"
        : skill.includes("Cloud")
        ? "Cloud"
        : skill.includes("Data")
        ? "Data"
        : "Networking",
    level: "Associate",
    openBadgeVersion: "3.0",
  }));

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "issue", label: "Issue credential", icon: "✚" },
  { id: "templates", label: "Badge templates", icon: "◆" },
  { id: "history", label: "Issuance history", icon: "≣" },
];

export default function DashboardClient({
  provider,
  initialCredentials,
}: {
  provider: Provider;
  initialCredentials: Credential[];
}) {
  const [section, setSection] = useState<Section>("overview");
  const [templates, setTemplates] = useState<Template[]>(seedTemplates(provider));
  const [credentials, setCredentials] = useState<Credential[]>(initialCredentials);
  const [modalOpen, setModalOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  function notify(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3500);
  }

  // ---- derived stats ----
  const valid = credentials.filter((c) => c.status === "valid").length;
  const revoked = credentials.filter((c) => c.status === "revoked").length;
  const thisYear = new Date().getFullYear();
  const issuedThisYear = credentials.filter(
    (c) => new Date(c.issueDate).getFullYear() === thisYear
  ).length;

  const recent = useMemo(
    () =>
      [...credentials]
        .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
        .slice(0, 6),
    [credentials]
  );

  // ---- template creation ----
  const [newTpl, setNewTpl] = useState({
    skill: "",
    category: "Security",
    level: "Associate" as Credential["level"],
    openBadgeVersion: "3.0" as Credential["openBadgeVersion"],
  });

  function addTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTpl.skill.trim()) return;
    setTemplates((t) => [...t, { id: `tpl-${Date.now()}`, ...newTpl }]);
    notify(`Template "${newTpl.skill}" created.`);
    setNewTpl({ ...newTpl, skill: "" });
  }

  // ---- issue credential (from modal) ----
  function issueCredential(data: {
    learnerName: string;
    templateId: string;
    issueDate: string;
    expiryDate: string;
  }) {
    const tpl = templates.find((t) => t.id === data.templateId);
    if (!tpl) return;
    const id = `MW-CRED-${Math.floor(2000 + Math.random() * 7999)}`;
    const cred: Credential = {
      id,
      code: `${tpl.skill.slice(0, 3).toUpperCase()}-${thisYear}-${Math.floor(
        1000 + Math.random() * 8999
      )}`,
      skill: tpl.skill,
      category: tpl.category,
      learnerId: "learner-demo",
      learnerName: data.learnerName.trim(),
      providerId: provider.id,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate || null,
      status: "valid",
      region: provider.region,
      level: tpl.level,
      openBadgeVersion: tpl.openBadgeVersion,
      criteria: [
        "Completed the programme coursework",
        "Passed the required assessment",
      ],
    };
    setCredentials((c) => [cred, ...c]);
    setModalOpen(false);
    notify(`Credential ${id} issued to ${cred.learnerName}.`);
    setSection("history");
  }

  function revoke(id: string) {
    setCredentials((cs) =>
      cs.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "revoked",
              revocationReason:
                "Revoked by the issuing provider from the dashboard (demo action).",
            }
          : c
      )
    );
    notify(`Credential ${id} revoked.`);
  }
  function reinstate(id: string) {
    setCredentials((cs) =>
      cs.map((c) =>
        c.id === id ? { ...c, status: "valid", revocationReason: undefined } : c
      )
    );
    notify(`Credential ${id} reinstated.`);
  }

  return (
    <div className="container-page py-8">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* ---------- Sidebar ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="border-b border-base-600/60 bg-base-700/40 p-4">
              <span className="tag border border-psc/30 bg-psc/10 text-psc-light">
                Provider workspace
              </span>
              <p className="mt-2.5 font-bold leading-tight text-ink">{provider.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
                <ShieldCheck className="h-3.5 w-3.5 text-ictam-light" />
                {provider.tier} tier · {provider.city}
              </p>
            </div>
            <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col">
              {NAV.map((n) => {
                const active = section === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setSection(n.id)}
                    className={`relative flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-base-700 text-ink"
                        : "text-ink-muted hover:bg-white/5 hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="dash-active"
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-ictam to-psc"
                      />
                    )}
                    <span className="text-ink-faint">{n.icon}</span>
                    {n.label}
                  </button>
                );
              })}
            </nav>
            <div className="border-t border-base-600/60 p-3">
              <button onClick={() => setModalOpen(true)} className="btn-red w-full">
                ✚ New credential
              </button>
              <Link
                href={`/registry/${provider.id}`}
                className="mt-2 block text-center text-xs text-ink-faint transition hover:text-psc-light"
              >
                View public profile →
              </Link>
            </div>
          </div>
        </aside>

        {/* ---------- Main ---------- */}
        <div>
          <AnimatePresence>
            {flash && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 flex items-center gap-2 rounded-xl border border-verified/30 bg-verified/10 px-4 py-3 text-sm font-medium text-verified-light"
              >
                <CheckBadge className="h-4 w-4" />
                {flash}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {section === "overview" && (
                <Overview
                  total={credentials.length}
                  valid={valid}
                  revoked={revoked}
                  issuedThisYear={issuedThisYear}
                  recent={recent}
                  onIssue={() => setModalOpen(true)}
                />
              )}

              {section === "issue" && (
                <div className="card p-8 text-center">
                  <h2 className="text-lg font-bold text-ink">Issue a credential</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
                    Issuing opens a guided, validated flow — pick the learner, the
                    badge template, and the dates, then review before it&apos;s
                    minted with a unique verification ID and QR.
                  </p>
                  <button onClick={() => setModalOpen(true)} className="btn-red mx-auto mt-6">
                    ✚ Start issuance
                  </button>
                </div>
              )}

              {section === "templates" && (
                <Templates
                  templates={templates}
                  newTpl={newTpl}
                  setNewTpl={setNewTpl}
                  onAdd={addTemplate}
                />
              )}

              {section === "history" && (
                <History
                  credentials={credentials}
                  onRevoke={revoke}
                  onReinstate={reinstate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <IssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        templates={templates}
        onIssue={issueCredential}
      />
    </div>
  );
}

/* ---------------- Overview ---------------- */

const SPARKS: Record<string, number[]> = {
  total: [2, 3, 3, 4, 5, 6, 6, 8],
  valid: [2, 3, 3, 4, 4, 5, 6, 7],
  year: [0, 1, 1, 2, 2, 3, 4, 5],
  revoked: [0, 0, 1, 1, 1, 1, 1, 1],
};

function Overview({
  total,
  valid,
  revoked,
  issuedThisYear,
  recent,
  onIssue,
}: {
  total: number;
  valid: number;
  revoked: number;
  issuedThisYear: number;
  recent: Credential[];
  onIssue: () => void;
}) {
  const stats = [
    { key: "total", label: "Total issued", value: total, trend: "+18%", up: true, color: "#E11D2A", text: "text-ictam-light" },
    { key: "valid", label: "Currently valid", value: valid, trend: "+12%", up: true, color: "#22C55E", text: "text-verified-light" },
    { key: "year", label: "Issued this year", value: issuedThisYear, trend: "+25%", up: true, color: "#F5A623", text: "text-psc-light" },
    { key: "revoked", label: "Revoked", value: revoked, trend: "0%", up: false, color: "#94A3B8", text: "text-ink" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Overview</h1>
          <p className="text-sm text-ink-faint">Your issuance at a glance.</p>
        </div>
        <button onClick={onIssue} className="btn-red hidden sm:inline-flex">
          ✚ New credential
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="card hover-glow-soft p-5"
          >
            <div className="flex items-center justify-between">
              <p className="eyebrow">{s.label}</p>
              <span
                className={`tag px-2 py-0.5 text-[10px] ${
                  s.trend === "0%"
                    ? "bg-base-700/60 text-ink-muted"
                    : "bg-verified/10 text-verified-light"
                }`}
              >
                {s.up ? "▴" : "▾"} {s.trend}
              </span>
            </div>
            <p className={`mt-1 text-3xl font-bold ${s.text}`}>{s.value}</p>
            <div className="mt-2 h-10">
              <Sparkline data={SPARKS[s.key]} color={s.color} id={s.key} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent activity feed */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-base-600/60 px-5 py-4">
          <h2 className="font-bold text-ink">Recent issuance activity</h2>
          <span className="text-xs text-ink-faint">Live · in-memory demo</span>
        </div>
        <ul className="divide-y divide-base-600/50">
          {recent.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-4 px-5 py-3.5"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  c.status === "valid"
                    ? "bg-verified/10 text-verified-light"
                    : "bg-ictam/10 text-ictam-light"
                }`}
              >
                {c.learnerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {c.learnerName}
                </p>
                <p className="truncate text-xs text-ink-muted">{c.skill}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-ink-faint">
                  {new Date(c.issueDate).toLocaleDateString("en-GB")}
                </p>
                <Link
                  href={`/verify/${c.id}`}
                  className="font-mono text-[11px] text-ictam-light hover:underline"
                >
                  {c.id}
                </Link>
              </div>
              {c.status === "valid" ? (
                <span className="tag border border-verified/30 bg-verified/10 text-verified-light">
                  <CheckBadge className="h-3.5 w-3.5" /> Valid
                </span>
              ) : (
                <span className="tag border border-ictam/30 bg-ictam/10 text-ictam-light">
                  <XCircle className="h-3.5 w-3.5" /> Revoked
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Templates ---------------- */

function Templates({
  templates,
  newTpl,
  setNewTpl,
  onAdd,
}: {
  templates: Template[];
  newTpl: any;
  setNewTpl: (v: any) => void;
  onAdd: (e: React.FormEvent) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-4 text-2xl font-bold text-ink">
          Badge templates{" "}
          <span className="text-base font-normal text-ink-faint">
            ({templates.length})
          </span>
        </h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card hover-lift hover-glow-gold p-5"
            >
              <span className="tag border border-base-600 bg-base-700/50 text-ink-muted">
                {t.category} · {t.level}
              </span>
              <h3 className="mt-3 font-bold text-ink">{t.skill}</h3>
              <p className="mt-1 text-xs text-ink-faint">
                Open Badge {t.openBadgeVersion}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <form onSubmit={onAdd} className="card h-fit space-y-4 p-6">
        <h3 className="font-bold text-ink">Create template</h3>
        <Labelled label="Skill / programme name">
          <input
            value={newTpl.skill}
            onChange={(e) => setNewTpl({ ...newTpl, skill: e.target.value })}
            placeholder="e.g. DevOps Foundations"
            className="input"
          />
        </Labelled>
        <Labelled label="Category">
          <select
            value={newTpl.category}
            onChange={(e) => setNewTpl({ ...newTpl, category: e.target.value })}
            className="input"
          >
            {["Security", "Cloud", "Data", "Networking", "Software"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Labelled>
        <Labelled label="Level">
          <select
            value={newTpl.level}
            onChange={(e) =>
              setNewTpl({ ...newTpl, level: e.target.value as Credential["level"] })
            }
            className="input"
          >
            {["Foundation", "Associate", "Professional"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Labelled>
        <button type="submit" className="btn-gold w-full">
          Add template
        </button>
      </form>
    </div>
  );
}

/* ---------------- History ---------------- */

function History({
  credentials,
  onRevoke,
  onReinstate,
}: {
  credentials: Credential[];
  onRevoke: (id: string) => void;
  onReinstate: (id: string) => void;
}) {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-ink">
        Issuance history{" "}
        <span className="text-base font-normal text-ink-faint">
          ({credentials.length})
        </span>
      </h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-base-600/60 bg-base-700/40 text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Credential</th>
                <th className="px-4 py-3">Learner</th>
                <th className="px-4 py-3">Skill</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-600/40">
              {credentials.map((c) => (
                <tr key={c.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/verify/${c.id}`}
                      className="font-mono text-xs font-semibold text-ictam-light hover:underline"
                    >
                      {c.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{c.learnerName}</td>
                  <td className="px-4 py-3 text-ink-muted">{c.skill}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {new Date(c.issueDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    {c.status === "valid" ? (
                      <span className="tag border border-verified/30 bg-verified/10 text-verified-light">
                        <CheckBadge className="h-3.5 w-3.5" /> Valid
                      </span>
                    ) : (
                      <span className="tag border border-ictam/30 bg-ictam/10 text-ictam-light">
                        <XCircle className="h-3.5 w-3.5" /> Revoked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {c.status === "valid" ? (
                      <button
                        onClick={() => onRevoke(c.id)}
                        className="rounded-lg border border-ictam/30 px-3 py-1.5 text-xs font-semibold text-ictam-light transition hover:bg-ictam/10"
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        onClick={() => onReinstate(c.id)}
                        className="rounded-lg border border-base-600 px-3 py-1.5 text-xs font-semibold text-ink-muted transition hover:bg-white/5"
                      >
                        Reinstate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {credentials.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-muted">
            No credentials issued yet.
          </p>
        )}
      </div>
    </div>
  );
}

function Labelled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
