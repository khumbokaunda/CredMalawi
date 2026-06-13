"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Credential } from "@/lib/types";
import { CheckBadge } from "@/components/icons";

export interface IssueTemplate {
  id: string;
  skill: string;
  category: string;
  level: Credential["level"];
}

export interface IssueData {
  learnerName: string;
  templateId: string;
  issueDate: string;
  expiryDate: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const STEPS = ["Learner", "Badge & dates", "Review"];

export default function IssueModal({
  open,
  onClose,
  templates,
  onIssue,
}: {
  open: boolean;
  onClose: () => void;
  templates: IssueTemplate[];
  onIssue: (data: IssueData) => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IssueData>({
    learnerName: "",
    templateId: "",
    issueDate: todayISO(),
    expiryDate: "",
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(0);
      setData({ learnerName: "", templateId: "", issueDate: todayISO(), expiryDate: "" });
      setTouched(false);
    }
  }, [open]);

  const tpl = templates.find((t) => t.id === data.templateId);

  const stepValid =
    step === 0
      ? data.learnerName.trim().length >= 2
      : step === 1
      ? !!data.templateId && !!data.issueDate
      : true;

  function next() {
    if (!stepValid) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setTouched(false);
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ictam via-psc to-ictam" />

            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Issue a credential</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex flex-1 items-center gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                        i < step
                          ? "bg-verified text-white"
                          : i === step
                          ? "bg-ictam text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {i < step ? "✓" : i + 1}
                    </span>
                    <span className={`text-xs font-medium ${i === step ? "text-slate-900" : "text-slate-400"}`}>
                      {label}
                    </span>
                    {i < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-slate-200 sm:block" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {step === 0 && (
                    <Field
                      label="Learner full name"
                      error={touched && data.learnerName.trim().length < 2 ? "Enter the learner's full name." : ""}
                    >
                      <input
                        autoFocus
                        value={data.learnerName}
                        onChange={(e) => setData({ ...data, learnerName: e.target.value })}
                        placeholder="e.g. Grace Mwale"
                        className="input"
                      />
                    </Field>
                  )}

                  {step === 1 && (
                    <>
                      <Field
                        label="Badge template"
                        error={touched && !data.templateId ? "Select a badge template." : ""}
                      >
                        <select
                          value={data.templateId}
                          onChange={(e) => setData({ ...data, templateId: e.target.value })}
                          className="input"
                        >
                          <option value="">Select a template…</option>
                          {templates.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.skill} ({t.level})
                            </option>
                          ))}
                        </select>
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Issue date">
                          <input
                            type="date"
                            value={data.issueDate}
                            onChange={(e) => setData({ ...data, issueDate: e.target.value })}
                            className="input"
                          />
                        </Field>
                        <Field label="Expiry (optional)">
                          <input
                            type="date"
                            value={data.expiryDate}
                            onChange={(e) => setData({ ...data, expiryDate: e.target.value })}
                            className="input"
                          />
                        </Field>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center gap-2 text-verified-dark">
                        <CheckBadge className="h-5 w-5 text-verified" />
                        <span className="text-sm font-semibold">Ready to issue</span>
                      </div>
                      <dl className="mt-4 space-y-2.5 text-sm">
                        <Review k="Learner" v={data.learnerName} />
                        <Review k="Skill" v={tpl?.skill ?? "—"} />
                        <Review k="Level" v={tpl?.level ?? "—"} />
                        <Review k="Issue date" v={data.issueDate} />
                        <Review k="Expiry" v={data.expiryDate || "No expiry"} />
                        <Review k="Authority" v="ICTAM" accent />
                      </dl>
                      <p className="mt-4 text-xs text-slate-400">
                        A unique verification ID + QR will be minted. Demo only —
                        nothing is cryptographically signed.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button onClick={step === 0 ? onClose : back} className="btn-ghost">
                {step === 0 ? "Cancel" : "← Back"}
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={next} className="btn-red">
                  Continue →
                </button>
              ) : (
                <button onClick={() => onIssue(data)} className="btn-red">
                  ✓ Issue credential
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-1">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs font-medium text-ictam"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}

function Review({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{k}</dt>
      <dd className={`text-right font-semibold ${accent ? "text-ictam" : "text-slate-900"}`}>{v}</dd>
    </div>
  );
}
