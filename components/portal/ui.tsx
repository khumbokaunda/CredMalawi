"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/motion/CountUp";
import Sparkline from "@/components/Sparkline";
import type { ProviderStatus } from "@/lib/types";

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const toneMap = {
  gold: { text: "text-psc-dark", bar: "from-psc to-psc-dark", spark: "#F5A623" },
  red: { text: "text-ictam", bar: "from-ictam to-ictam-dark", spark: "#E11D2A" },
  green: { text: "text-verified", bar: "from-verified to-verified-dark", spark: "#16A34A" },
  blue: { text: "text-brandblue", bar: "from-brandblue to-brandblue-light", spark: "#1D4ED8" },
  slate: { text: "text-slate-900", bar: "from-slate-300 to-slate-400", spark: "#94A3B8" },
} as const;

export type StatTone = keyof typeof toneMap;

export function StatCard({
  label,
  value,
  tone = "slate",
  trend,
  spark,
  index = 0,
}: {
  label: string;
  value: number;
  tone?: StatTone;
  trend?: string;
  spark?: number[];
  index?: number;
}) {
  const t = toneMap[tone];
  const down = trend?.startsWith("-");
  const flat = trend === "0%" || trend === "Stable";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="card relative overflow-hidden p-5"
    >
      <span className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${t.bar}`} />
      <div className="flex items-start justify-between gap-2">
        <p className="eyebrow">{label}</p>
        {trend && (
          <span
            className={`tag px-2 py-0.5 text-[10px] ${
              flat
                ? "bg-slate-100 text-slate-500"
                : down
                ? "bg-ictam-tint text-ictam-dark"
                : "bg-verified-tint text-verified-dark"
            }`}
          >
            {flat ? "•" : down ? "▾" : "▴"} {trend}
          </span>
        )}
      </div>
      <p className={`mt-1 text-3xl font-bold ${t.text}`}>
        <CountUp value={value} />
      </p>
      {spark && (
        <div className="mt-2 h-10">
          <Sparkline data={spark} color={t.spark} id={label.replace(/\s/g, "")} />
        </div>
      )}
    </motion.div>
  );
}

const statusStyles: Record<string, string> = {
  Accredited: "border border-verified/20 bg-verified-tint text-verified-dark",
  Provisional: "border border-psc/30 bg-psc-tint text-psc-dark",
  Pending: "border border-amber-200 bg-amber-50 text-amber-700",
  Suspended: "border border-ictam/20 bg-ictam-tint text-ictam-dark",
  valid: "border border-verified/20 bg-verified-tint text-verified-dark",
  revoked: "border border-ictam/20 bg-ictam-tint text-ictam-dark",
};

export function StatusPill({ status }: { status: ProviderStatus | "valid" | "revoked" }) {
  const label = status === "valid" ? "Valid" : status === "revoked" ? "Revoked" : status;
  return (
    <span className={`tag ${statusStyles[status] ?? "bg-slate-100 text-slate-500"}`}>
      {label}
    </span>
  );
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
      {initials}
    </span>
  );
}
