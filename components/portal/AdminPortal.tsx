"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/lib/store";
import { buildAnalytics } from "@/lib/analytics";
import IctamCharts from "@/components/IctamCharts";
import { SectionHeader, StatCard, StatusPill } from "./ui";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MapPin, CheckBadge, XCircle } from "@/components/icons";

export default function AdminPortal({ section }: { section: string }) {
  const [flash, setFlash] = useState<string | null>(null);
  function notify(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3500);
  }
  return (
    <div>
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-center gap-2 rounded-xl border border-ictam/20 bg-ictam-tint px-4 py-3 text-sm font-medium text-ictam-dark"
          >
            <CheckBadge className="h-4 w-4 text-ictam" />
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
          {section === "overview" && <Overview />}
          {section === "institutions" && <Institutions notify={notify} />}
          {section === "requests" && <Requests notify={notify} />}
          {section === "registry" && <RegistryManage notify={notify} />}
          {section === "credentials" && <AllCredentials />}
          {section === "settings" && <Settings notify={notify} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* -------- Overview -------- */
function Overview() {
  const { credentials, providers } = useData();
  const analytics = useMemo(() => buildAnalytics(credentials), [credentials]);
  const valid = credentials.filter((c) => c.status === "valid").length;
  const revoked = credentials.filter((c) => c.status === "revoked").length;
  const active = providers.filter((p) => p.status === "Accredited").length;

  return (
    <div>
      <SectionHeader title="Overview" subtitle="Platform-wide credentialing analytics, led by ICTAM." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total credentials" value={credentials.length} tone="red" trend="+18%" index={0} />
        <StatCard label="Currently valid" value={valid} tone="green" trend="+12%" index={1} />
        <StatCard label="Active providers" value={active} tone="gold" trend="+1" index={2} />
        <StatCard label="Revoked" value={revoked} tone="slate" trend="0%" index={3} />
      </div>
      <IctamCharts
        byRegion={analytics.byRegion}
        topSkills={analytics.topSkills}
        categories={analytics.categories}
        issuanceTrend={analytics.issuanceTrend}
      />
    </div>
  );
}

/* -------- Institutions -------- */
function Institutions({ notify }: { notify: (m: string) => void }) {
  const { providers, setProviderStatus } = useData();
  const visible = providers.filter((p) => p.status !== "Pending");
  return (
    <div>
      <SectionHeader title="Institutions" subtitle="Every training provider and its current standing." />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Institution</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((p) => (
                <tr key={p.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-xs font-bold text-psc-light">{p.shortName}</span>
                      <Link href={`/registry/${p.id}`} className="font-medium text-slate-900 hover:underline">{p.name}</Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.city}, {p.region}</td>
                  <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {p.status === "Suspended" ? (
                      <button onClick={() => { setProviderStatus(p.id, "Accredited"); notify(`${p.name} reinstated.`); }} className="rounded-lg border border-verified/30 px-3 py-1.5 text-xs font-semibold text-verified-dark transition hover:bg-verified-tint">Reinstate</button>
                    ) : (
                      <button onClick={() => { setProviderStatus(p.id, "Suspended"); notify(`${p.name} suspended.`); }} className="rounded-lg border border-ictam/30 px-3 py-1.5 text-xs font-semibold text-ictam transition hover:bg-ictam-tint">Suspend</button>
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

/* -------- Accreditation Requests -------- */
function Requests({ notify }: { notify: (m: string) => void }) {
  const { pendingProviders, approveApplicant, rejectApplicant } = useData();
  return (
    <div>
      <SectionHeader title="Accreditation Requests" subtitle="Institutions applying to issue on CredMalawi. Approving surfaces them in the public registry." />
      {pendingProviders.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          <CheckBadge className="mx-auto h-10 w-10 text-verified" />
          <p className="mt-3 font-medium text-slate-700">The queue is clear.</p>
          <p className="text-sm">All accreditation requests have been processed.</p>
        </div>
      ) : (
        <Stagger className="grid gap-4 lg:grid-cols-2">
          {pendingProviders.map((p) => (
            <StaggerItem key={p.id}>
              <div className="card p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-sm font-bold text-psc-light">{p.shortName}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{p.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" />{p.city}, {p.region} Region</p>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <p className="mt-3 text-sm text-slate-500">{p.about}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.programmes.map((pr) => (
                    <span key={pr} className="tag border border-slate-200 bg-slate-50 text-slate-500">{pr}</span>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => { approveApplicant(p.id); notify(`${p.name} accredited and now public in the registry.`); }} className="btn-red flex-1">
                    <CheckBadge className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => { rejectApplicant(p.id); notify(`${p.name} rejected.`); }} className="btn-outline flex-1">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

/* -------- Registry management -------- */
function RegistryManage({ notify }: { notify: (m: string) => void }) {
  const { providers, setProviderStatus } = useData();
  const manageable = providers.filter((p) => p.status !== "Pending");
  return (
    <div>
      <SectionHeader title="Registry" subtitle="Control which providers appear in the public registry." />
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {manageable.map((p) => {
          const visible = p.status === "Accredited" || p.status === "Provisional";
          return (
            <StaggerItem key={p.id}>
              <div className="card flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-xs font-bold text-psc-light">{p.shortName}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-400">{visible ? "Visible in public registry" : "Hidden from registry"}</p>
                </div>
                <button
                  onClick={() => {
                    if (visible) { setProviderStatus(p.id, "Suspended"); notify(`${p.name} hidden from registry.`); }
                    else { setProviderStatus(p.id, "Accredited"); notify(`${p.name} published to registry.`); }
                  }}
                  role="switch"
                  aria-checked={visible}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${visible ? "bg-verified" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${visible ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

/* -------- All Credentials -------- */
function AllCredentials() {
  const { credentials } = useData();
  const [q, setQ] = useState("");
  const filtered = credentials.filter((c) => {
    const s = q.toLowerCase();
    return !s || c.id.toLowerCase().includes(s) || c.learnerName.toLowerCase().includes(s) || c.skill.toLowerCase().includes(s);
  });
  return (
    <div>
      <SectionHeader title="All Credentials" subtitle={`${credentials.length} credentials issued platform-wide.`} />
      <div className="card mb-4 p-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by ID, learner, or skill…" className="input" />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Credential</th>
                <th className="px-4 py-3">Learner</th>
                <th className="px-4 py-3">Skill</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3"><Link href={`/verify/${c.id}`} className="font-mono text-xs font-semibold text-brandblue hover:underline">{c.id}</Link></td>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.learnerName}</td>
                  <td className="px-4 py-3 text-slate-500">{c.skill}</td>
                  <td className="px-4 py-3 text-slate-500">{c.region}</td>
                  <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No credentials match your search.</p>}
      </div>
    </div>
  );
}

/* -------- Settings -------- */
function Settings({ notify }: { notify: (m: string) => void }) {
  const { resetDemo } = useData();
  return (
    <div>
      <SectionHeader title="Settings" subtitle="Administrator preferences (mock)." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-bold text-slate-900">Platform</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row k="Operator" v="Phantom Stack Collective (PSC)" />
            <Row k="Authority" v="ICTAM" />
            <Row k="Open Badges" v="2.0 / 3.0 aligned" />
            <Row k="Currency" v="Malawian Kwacha (MWK)" />
          </dl>
        </div>
        <div className="card p-6">
          <h3 className="font-bold text-slate-900">Demo data</h3>
          <p className="mt-2 text-sm text-slate-500">
            Issuances, revocations, and accreditation decisions are stored in your
            browser for the demo. Reset to return everything to the seeded state.
          </p>
          <button
            onClick={() => { resetDemo(); notify("Demo data reset to the seeded state."); }}
            className="btn-outline mt-4"
          >
            Reset demo data
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{k}</dt>
      <dd className="font-semibold text-slate-900">{v}</dd>
    </div>
  );
}
