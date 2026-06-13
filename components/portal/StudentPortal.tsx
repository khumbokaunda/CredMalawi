"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useCredentialsForLearner } from "@/lib/store";
import { getLearner } from "@/lib/data";
import CredentialMiniCard from "@/components/CredentialMiniCard";
import { SectionHeader, StatCard } from "./ui";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CheckBadge, ShieldCheck } from "@/components/icons";

export default function StudentPortal({ section }: { section: string }) {
  const { user } = useAuth();
  const learnerId = user?.refId ?? "learner-tadala-phiri";
  const learner = getLearner(learnerId)!;
  const creds = useCredentialsForLearner(learnerId);
  const valid = creds.filter((c) => c.status === "valid");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {section === "credentials" && (
          <div>
            <SectionHeader title="My Credentials" subtitle="Every badge you've earned, verifiable by anyone." />
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <StatCard label="Total badges" value={creds.length} tone="gold" index={0} />
              <StatCard label="Currently valid" value={valid.length} tone="green" index={1} />
              <StatCard label="Skills covered" value={new Set(creds.map((c) => c.category)).size} tone="blue" index={2} />
            </div>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {creds.map((c) => (
                <StaggerItem key={c.id} className="flex flex-col gap-3">
                  <CredentialMiniCard credential={c} />
                  <ShareActions credentialId={c.id} skill={c.skill} disabled={c.status === "revoked"} />
                </StaggerItem>
              ))}
            </Stagger>
            {creds.length === 0 && <p className="text-slate-500">No credentials yet.</p>}
          </div>
        )}

        {section === "public" && <PublicProfile learnerId={learnerId} name={learner.fullName} count={valid.length} />}
        {section === "verify" && <VerifyEmbed creds={creds.map((c) => c.id)} />}
        {section === "profile" && <Profile learner={learner} />}
      </motion.div>
    </AnimatePresence>
  );
}

function ShareActions({ credentialId, skill, disabled }: { credentialId: string; skill: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/verify/${credentialId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {/* ignore */}
  }
  if (disabled) return <p className="px-1 text-xs text-slate-400">Sharing disabled — credential revoked.</p>;
  return (
    <div className="flex gap-2">
      <button onClick={copy} className="btn-outline flex-1 px-3 py-2 text-xs">
        {copied ? "Link copied!" : "Copy verification link"}
      </button>
      <button
        onClick={() => alert(`(Demo) This would share your "${skill}" badge to LinkedIn.`)}
        className="btn bg-[#0A66C2] px-3 py-2 text-xs text-white hover:bg-[#0a5cad]"
      >
        Share to LinkedIn
      </button>
    </div>
  );
}

function PublicProfile({ learnerId, name, count }: { learnerId: string; name: string; count: number }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/wallet/${learnerId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {/* ignore */}
  }
  return (
    <div>
      <SectionHeader title="Public Profile" subtitle="A shareable, read-only view of your verified badges." />
      <div className="card overflow-hidden">
        <div className="bg-navy p-6 text-white">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <ShieldCheck className="h-4 w-4 text-psc-light" /> Public profile · no login required to view
          </div>
          <p className="mt-3 text-2xl font-bold">{name}</p>
          <p className="text-sm text-slate-300">{count} verified credentials on display</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 p-6">
          <Link href={`/wallet/${learnerId}`} className="btn-gold">Open public profile →</Link>
          <button onClick={copy} className="btn-outline">{copied ? "Link copied!" : "Copy profile link"}</button>
          <button onClick={() => alert("(Demo) Shared to LinkedIn.")} className="btn bg-[#0A66C2] text-white hover:bg-[#0a5cad]">Share to LinkedIn</button>
        </div>
      </div>
    </div>
  );
}

function VerifyEmbed({ creds }: { creds: string[] }) {
  const router = useRouter();
  const [id, setId] = useState("");
  return (
    <div>
      <SectionHeader title="Verify a Credential" subtitle="Check any CredMalawi credential by its ID." />
      <div className="card p-6">
        <form
          onSubmit={(e) => { e.preventDefault(); if (id.trim()) router.push(`/verify/${id.trim()}`); }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. MW-CRED-1001" className="input flex-1" />
          <button type="submit" className="btn-red">Verify →</button>
        </form>
        {creds.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow">Quick-check your own</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {creds.map((c) => (
                <Link key={c} href={`/verify/${c}`} className="tag border border-slate-200 bg-slate-50 font-mono text-slate-600 hover:bg-slate-100">{c}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Profile({ learner }: { learner: ReturnType<typeof getLearner> }) {
  const [form, setForm] = useState({
    fullName: learner!.fullName,
    headline: learner!.headline,
    city: learner!.city,
  });
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <SectionHeader title="Profile" subtitle="Your learner profile (mock — edits are local to the demo)." />
      <form
        onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
        className="card max-w-xl space-y-4 p-6"
      >
        <label className="block">
          <span className="eyebrow">Full name</span>
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input mt-1" />
        </label>
        <label className="block">
          <span className="eyebrow">Headline</span>
          <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="input mt-1" />
        </label>
        <label className="block">
          <span className="eyebrow">City</span>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input mt-1" />
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" className="btn-gold">Save changes</button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-verified-dark">
              <CheckBadge className="h-4 w-4 text-verified" /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
