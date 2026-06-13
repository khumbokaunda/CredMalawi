"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Credential } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { useData, useProvider } from "@/lib/store";
import { getProvider } from "@/lib/data";
import IssueModal, { type IssueTemplate, type IssueData } from "@/components/IssueModal";
import { SectionHeader, StatCard, StatusPill, Avatar } from "./ui";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CheckBadge, ShieldCheck } from "@/components/icons";

function categoryFor(skill: string) {
  if (skill.includes("Security") || skill.includes("Cyber")) return "Security";
  if (skill.includes("Cloud")) return "Cloud";
  if (skill.includes("Data")) return "Data";
  return "Networking";
}

export default function InstitutionPortal({ section }: { section: string }) {
  const { user } = useAuth();
  const providerId = user?.refId ?? "prov-blantyre-tech";
  const provider = getProvider(providerId)!;
  const { credentials, issueCredential, setCredentialStatus } = useData();

  const mine = useMemo(
    () => credentials.filter((c) => c.providerId === providerId),
    [credentials, providerId]
  );

  const [templates, setTemplates] = useState<IssueTemplate[]>(
    provider.programmes.map((skill, i) => ({
      id: `tpl-${i}`,
      skill,
      category: categoryFor(skill),
      level: "Associate",
    }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  function notify(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3500);
  }

  function handleIssue(data: IssueData) {
    const tpl = templates.find((t) => t.id === data.templateId);
    if (!tpl) return;
    const id = `MW-CRED-${Math.floor(2000 + Math.random() * 7999)}`;
    const cred: Credential = {
      id,
      code: `${tpl.skill.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`,
      skill: tpl.skill,
      category: tpl.category,
      learnerId: "learner-demo",
      learnerName: data.learnerName.trim(),
      providerId,
      issueDate: data.issueDate,
      expiryDate: data.expiryDate || null,
      status: "valid",
      region: provider.region,
      level: tpl.level,
      openBadgeVersion: "3.0",
      criteria: ["Completed the programme coursework", "Passed the required assessment"],
    };
    issueCredential(cred);
    setModalOpen(false);
    notify(`Credential ${id} issued to ${cred.learnerName}.`);
  }

  return (
    <div>
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-center gap-2 rounded-xl border border-verified/20 bg-verified-tint px-4 py-3 text-sm font-medium text-verified-dark"
          >
            <CheckBadge className="h-4 w-4 text-verified" />
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
          {section === "dashboard" && (
            <Dashboard mine={mine} onIssue={() => setModalOpen(true)} templateCount={templates.length} />
          )}
          {section === "issue" && <IssueLanding onIssue={() => setModalOpen(true)} />}
          {section === "templates" && (
            <Templates templates={templates} setTemplates={setTemplates} notify={notify} />
          )}
          {section === "history" && <History credentials={mine} />}
          {section === "revocations" && (
            <Revocations credentials={mine} onRevoke={(id) => { setCredentialStatus(id, "revoked", "Revoked by the issuing institution (demo action)."); notify(`Credential ${id} revoked.`); }} onReinstate={(id) => { setCredentialStatus(id, "valid"); notify(`Credential ${id} reinstated.`); }} />
          )}
          {section === "accreditation" && <Accreditation />}
        </motion.div>
      </AnimatePresence>

      <IssueModal open={modalOpen} onClose={() => setModalOpen(false)} templates={templates} onIssue={handleIssue} />
    </div>
  );
}

/* -------- Dashboard -------- */
const SPARKS: Record<string, number[]> = {
  total: [2, 3, 3, 4, 5, 6, 6, 8],
  valid: [2, 3, 3, 4, 4, 5, 6, 7],
  month: [0, 1, 1, 2, 2, 3, 4, 5],
};

function Dashboard({ mine, onIssue, templateCount }: { mine: Credential[]; onIssue: () => void; templateCount: number }) {
  const valid = mine.filter((c) => c.status === "valid").length;
  const thisMonth = mine.filter((c) => {
    const d = new Date(c.issueDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const recent = [...mine].sort((a, b) => b.issueDate.localeCompare(a.issueDate)).slice(0, 6);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard"
        subtitle="Your issuance at a glance."
        action={<button onClick={onIssue} className="btn-gold hidden sm:inline-flex">✚ Issue credential</button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Credentials issued" value={mine.length} tone="gold" trend="+18%" spark={SPARKS.total} index={0} />
        <StatCard label="Currently valid" value={valid} tone="green" trend="+12%" spark={SPARKS.valid} index={1} />
        <StatCard label="Issued this month" value={thisMonth} tone="blue" trend="+25%" spark={SPARKS.month} index={2} />
        <StatCard label="Active templates" value={templateCount} tone="slate" trend="—" index={3} />
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-slate-900">Recent issuance activity</h3>
          <span className="text-xs text-slate-400">Live · in-memory demo</span>
        </div>
        <ul className="divide-y divide-slate-100">
          {recent.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-4 px-5 py-3.5"
            >
              <Avatar name={c.learnerName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{c.learnerName}</p>
                <p className="truncate text-xs text-slate-500">{c.skill}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-400">{new Date(c.issueDate).toLocaleDateString("en-GB")}</p>
                <Link href={`/verify/${c.id}`} className="font-mono text-[11px] text-brandblue hover:underline">{c.id}</Link>
              </div>
              <StatusPill status={c.status} />
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IssueLanding({ onIssue }: { onIssue: () => void }) {
  return (
    <div>
      <SectionHeader title="Issue Credential" subtitle="Mint a verifiable badge for a learner." />
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-psc-tint text-psc-dark ring-1 ring-psc/30">
          <CheckBadge className="h-8 w-8" />
        </div>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-500">
          Issuing opens a guided, validated flow — pick the learner, the badge
          template, and the dates, then review before it&apos;s minted with a
          unique verification ID and QR.
        </p>
        <button onClick={onIssue} className="btn-gold mx-auto mt-6">✚ Start issuance</button>
      </div>
    </div>
  );
}

/* -------- Templates -------- */
function Templates({
  templates,
  setTemplates,
  notify,
}: {
  templates: IssueTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<IssueTemplate[]>>;
  notify: (m: string) => void;
}) {
  const [form, setForm] = useState({ skill: "", category: "Security", level: "Associate" as Credential["level"] });

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.skill.trim()) return;
    setTemplates((t) => [...t, { id: `tpl-${Date.now()}`, ...form }]);
    notify(`Template "${form.skill}" created.`);
    setForm({ ...form, skill: "" });
  }

  return (
    <div>
      <SectionHeader title="Badge Templates" subtitle={`${templates.length} templates available to issue.`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {templates.map((t) => (
            <StaggerItem key={t.id}>
              <div className="card hover-lift p-5">
                <span className="tag border border-slate-200 bg-slate-50 text-slate-500">{t.category} · {t.level}</span>
                <h3 className="mt-3 font-bold text-slate-900">{t.skill}</h3>
                <p className="mt-1 text-xs text-slate-400">Open Badge 3.0</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <form onSubmit={add} className="card h-fit space-y-4 p-6">
          <h3 className="font-bold text-slate-900">Create template</h3>
          <label className="block">
            <span className="eyebrow">Skill / programme name</span>
            <input value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} placeholder="e.g. DevOps Foundations" className="input mt-1" />
          </label>
          <label className="block">
            <span className="eyebrow">Category</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input mt-1">
              {["Security", "Cloud", "Data", "Networking", "Software"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow">Level</span>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Credential["level"] })} className="input mt-1">
              {["Foundation", "Associate", "Professional"].map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <button type="submit" className="btn-gold w-full">Add template</button>
        </form>
      </div>
    </div>
  );
}

/* -------- History -------- */
function History({ credentials }: { credentials: Credential[] }) {
  return (
    <div>
      <SectionHeader title="Issuance History" subtitle={`${credentials.length} credentials issued by your institution.`} />
      <CredentialTable credentials={credentials} />
    </div>
  );
}

/* -------- Revocations -------- */
function Revocations({
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
      <SectionHeader title="Revocations" subtitle="Revoke a credential — the public verification page updates instantly." />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Credential</th>
                <th className="px-4 py-3">Learner</th>
                <th className="px-4 py-3">Skill</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {credentials.map((c) => (
                <tr key={c.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/verify/${c.id}`} className="font-mono text-xs font-semibold text-brandblue hover:underline">{c.id}</Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.learnerName}</td>
                  <td className="px-4 py-3 text-slate-500">{c.skill}</td>
                  <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {c.status === "valid" ? (
                      <button onClick={() => onRevoke(c.id)} className="rounded-lg border border-ictam/30 px-3 py-1.5 text-xs font-semibold text-ictam transition hover:bg-ictam-tint">Revoke</button>
                    ) : (
                      <button onClick={() => onReinstate(c.id)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">Reinstate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------- Accreditation -------- */
function Accreditation() {
  const { user } = useAuth();
  const provider = useProvider(user?.refId ?? "prov-blantyre-tech")!;
  return (
    <div>
      <SectionHeader title="Accreditation Status" subtitle="Your standing with ICTAM." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-verified-tint text-verified ring-1 ring-verified/20">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">ICTAM Accredited</p>
              <p className="text-sm text-slate-500">{provider.name}</p>
            </div>
            <span className="ml-auto"><StatusPill status={provider.status} /></span>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info k="Accrediting authority" v="ICTAM — ICT Association of Malawi" />
            <Info k="Accredited since" v={provider.accreditedSince ? new Date(provider.accreditedSince).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
            <Info k="Subscription tier" v={provider.tier} />
            <Info k="Region" v={`${provider.city}, ${provider.region}`} />
          </dl>
          <Link href={`/registry/${provider.id}`} className="btn-outline mt-6">View public registry profile →</Link>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-slate-900">Authorised programmes</h3>
          <ul className="mt-4 space-y-2">
            {provider.programmes.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckBadge className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="eyebrow">{k}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{v}</dd>
    </div>
  );
}

export function CredentialTable({ credentials }: { credentials: Credential[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Credential</th>
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Issued</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {credentials.map((c) => (
              <tr key={c.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/verify/${c.id}`} className="font-mono text-xs font-semibold text-brandblue hover:underline">{c.id}</Link>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{c.learnerName}</td>
                <td className="px-4 py-3 text-slate-500">{c.skill}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(c.issueDate).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-3"><StatusPill status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {credentials.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No credentials yet.</p>}
    </div>
  );
}
