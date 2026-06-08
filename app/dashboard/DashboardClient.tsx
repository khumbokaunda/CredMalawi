"use client";

import { useState } from "react";
import Link from "next/link";
import type { Credential, Provider } from "@/lib/types";
import { CheckBadge, XCircle, ShieldCheck } from "@/components/icons";

interface Template {
  id: string;
  skill: string;
  category: string;
  level: Credential["level"];
  openBadgeVersion: Credential["openBadgeVersion"];
}

type Tab = "templates" | "issue" | "history";

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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardClient({
  provider,
  initialCredentials,
}: {
  provider: Provider;
  initialCredentials: Credential[];
}) {
  const [tab, setTab] = useState<Tab>("issue");
  const [templates, setTemplates] = useState<Template[]>(seedTemplates(provider));
  const [credentials, setCredentials] = useState<Credential[]>(
    initialCredentials
  );
  const [flash, setFlash] = useState<string | null>(null);

  function notify(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 3500);
  }

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
    setTemplates((t) => [
      ...t,
      { id: `tpl-${Date.now()}`, ...newTpl },
    ]);
    notify(`Template "${newTpl.skill}" created.`);
    setNewTpl({ ...newTpl, skill: "" });
  }

  // ---- issue credential ----
  const [issueForm, setIssueForm] = useState({
    learnerName: "",
    templateId: "",
    issueDate: todayISO(),
    expiryDate: "",
  });

  function issueCredential(e: React.FormEvent) {
    e.preventDefault();
    const tpl = templates.find((t) => t.id === issueForm.templateId);
    if (!tpl || !issueForm.learnerName.trim()) {
      notify("Please enter a learner name and select a badge template.");
      return;
    }
    const id = `MW-CRED-${Math.floor(2000 + Math.random() * 7999)}`;
    const cred: Credential = {
      id,
      code: `${tpl.skill.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 8999
      )}`,
      skill: tpl.skill,
      category: tpl.category,
      learnerId: "learner-demo",
      learnerName: issueForm.learnerName.trim(),
      providerId: provider.id,
      issueDate: issueForm.issueDate,
      expiryDate: issueForm.expiryDate || null,
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
    notify(`Credential ${id} issued to ${cred.learnerName}.`);
    setIssueForm({
      learnerName: "",
      templateId: "",
      issueDate: todayISO(),
      expiryDate: "",
    });
    setTab("history");
  }

  // ---- revoke ----
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
        c.id === id
          ? { ...c, status: "valid", revocationReason: undefined }
          : c
      )
    );
    notify(`Credential ${id} reinstated.`);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "issue", label: "Issue a credential" },
    { id: "templates", label: "Badge templates" },
    { id: "history", label: "Issuance history" },
  ];

  return (
    <div>
      {/* Dashboard header */}
      <section className="border-b border-slate-800 bg-ink text-white">
        <div className="container-page py-8">
          <span className="tag bg-psc text-white">Provider workspace · Mocked session</span>
          <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{provider.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                <ShieldCheck className="h-4 w-4 text-psc-light" />
                {provider.tier} tier · {provider.city}, {provider.region} Region
              </p>
            </div>
            <Link
              href={`/registry/${provider.id}`}
              className="text-sm text-slate-300 hover:text-psc-light"
            >
              View public profile →
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        {flash && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-verified/30 bg-verified-bg px-4 py-3 text-sm font-medium text-verified">
            <CheckBadge className="h-4 w-4" />
            {flash}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                tab === t.id
                  ? "border-psc text-ink"
                  : "border-transparent text-slate-500 hover:text-ink"
              }`}
            >
              {t.label}
              {t.id === "history" && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {credentials.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ----- Issue tab ----- */}
        {tab === "issue" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <form
              onSubmit={issueCredential}
              className="card space-y-4 p-6 lg:col-span-2"
            >
              <h2 className="text-lg font-bold text-ink">Issue a credential</h2>
              <Labelled label="Learner full name">
                <input
                  value={issueForm.learnerName}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, learnerName: e.target.value })
                  }
                  placeholder="e.g. Grace Mwale"
                  className="input"
                />
              </Labelled>
              <Labelled label="Badge template">
                <select
                  value={issueForm.templateId}
                  onChange={(e) =>
                    setIssueForm({ ...issueForm, templateId: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Select a template…</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.skill} ({t.level})
                    </option>
                  ))}
                </select>
              </Labelled>
              <div className="grid gap-4 sm:grid-cols-2">
                <Labelled label="Issue date">
                  <input
                    type="date"
                    value={issueForm.issueDate}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, issueDate: e.target.value })
                    }
                    className="input"
                  />
                </Labelled>
                <Labelled label="Expiry date (optional)">
                  <input
                    type="date"
                    value={issueForm.expiryDate}
                    onChange={(e) =>
                      setIssueForm({ ...issueForm, expiryDate: e.target.value })
                    }
                    className="input"
                  />
                </Labelled>
              </div>
              <button type="submit" className="btn-gold">
                Issue credential
              </button>
              <p className="text-xs text-slate-400">
                Demo only — issued credentials live in memory and reset on
                refresh. No Open Badge is cryptographically signed.
              </p>
            </form>

            <div className="card p-6">
              <h3 className="font-bold text-ink">How issuance works</h3>
              <ol className="mt-4 space-y-3 text-sm text-slate-600">
                <li>1. Pick a badge template you&apos;re authorised to issue.</li>
                <li>2. Enter the learner who met the criteria.</li>
                <li>3. CredMalawi mints a unique verification ID + QR.</li>
                <li>4. The credential appears in issuance history instantly.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ----- Templates tab ----- */}
        {tab === "templates" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-lg font-bold text-ink">
                Badge templates ({templates.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {templates.map((t) => (
                  <div key={t.id} className="card p-5">
                    <span className="tag bg-slate-100 text-slate-600">
                      {t.category} · {t.level}
                    </span>
                    <h3 className="mt-3 font-bold text-ink">{t.skill}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Open Badge {t.openBadgeVersion}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={addTemplate} className="card h-fit space-y-4 p-6">
              <h3 className="font-bold text-ink">Create template</h3>
              <Labelled label="Skill / programme name">
                <input
                  value={newTpl.skill}
                  onChange={(e) =>
                    setNewTpl({ ...newTpl, skill: e.target.value })
                  }
                  placeholder="e.g. DevOps Foundations"
                  className="input"
                />
              </Labelled>
              <Labelled label="Category">
                <select
                  value={newTpl.category}
                  onChange={(e) =>
                    setNewTpl({ ...newTpl, category: e.target.value })
                  }
                  className="input"
                >
                  {["Security", "Cloud", "Data", "Networking", "Software"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    )
                  )}
                </select>
              </Labelled>
              <Labelled label="Level">
                <select
                  value={newTpl.level}
                  onChange={(e) =>
                    setNewTpl({
                      ...newTpl,
                      level: e.target.value as Credential["level"],
                    })
                  }
                  className="input"
                >
                  {["Foundation", "Associate", "Professional"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Labelled>
              <button type="submit" className="btn-ink w-full">
                Add template
              </button>
            </form>
          </div>
        )}

        {/* ----- History tab ----- */}
        {tab === "history" && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Credential</th>
                    <th className="px-4 py-3">Learner</th>
                    <th className="px-4 py-3">Skill</th>
                    <th className="px-4 py-3">Issued</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {credentials.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/verify/${c.id}`}
                          className="font-mono text-xs font-semibold text-ictam-blue hover:underline"
                        >
                          {c.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">
                        {c.learnerName}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.skill}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(c.issueDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        {c.status === "valid" ? (
                          <span className="tag bg-verified-bg text-verified">
                            <CheckBadge className="h-3.5 w-3.5" /> Valid
                          </span>
                        ) : (
                          <span className="tag bg-red-50 text-ictam-red">
                            <XCircle className="h-3.5 w-3.5" /> Revoked
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.status === "valid" ? (
                          <button
                            onClick={() => revoke(c.id)}
                            className="rounded-md border border-ictam-red/30 px-3 py-1.5 text-xs font-semibold text-ictam-red hover:bg-red-50"
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => reinstate(c.id)}
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
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
              <p className="p-8 text-center text-sm text-slate-500">
                No credentials issued yet.
              </p>
            )}
          </div>
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
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
