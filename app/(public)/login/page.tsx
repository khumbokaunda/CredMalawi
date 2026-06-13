"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, homePathForRole } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { demoAccounts } from "@/lib/seed";
import { BrandMark } from "@/components/PublicHeader";
import { ShieldCheck } from "@/components/icons";

const quickRoles: { role: Role; label: string; accent: string; sub: string }[] = [
  { role: "institution", label: "Enter as Institution", accent: "btn-gold", sub: "Blantyre Institute of Technology" },
  { role: "student", label: "Enter as Student", accent: "btn-blue", sub: "Tadala Phiri" },
  { role: "admin", label: "Enter as ICTAM Admin", accent: "btn-red", sub: "ICTAM Administrator" },
];

export default function LoginPage() {
  const { login, quickLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function go(role: Role) {
    router.push(homePathForRole(role));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const acc = login(email);
    if (!acc) {
      setError("No demo account matches that email. Try one of the demo accounts below.");
      return;
    }
    go(acc.role);
  }

  function onQuick(role: Role) {
    quickLogin(role);
    go(role);
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        {/* Quick demo login — the presenter's fast path */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="order-2 rounded-3xl bg-navy p-8 text-white lg:order-1"
        >
          <span className="tag border border-psc/40 bg-psc/15 text-psc-light">
            <ShieldCheck className="h-3.5 w-3.5" /> Quick demo login
          </span>
          <h2 className="mt-4 text-2xl font-bold">Jump straight into a role</h2>
          <p className="mt-2 text-sm text-slate-300">
            One click each — no typing. Switch roles any time from the account
            menu in the top bar.
          </p>

          <div className="mt-6 space-y-3">
            {quickRoles.map((q, i) => (
              <motion.button
                key={q.role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => onQuick(q.role)}
                className={`${q.accent} w-full justify-between`}
              >
                <span>{q.label}</span>
                <span className="text-xs font-normal opacity-80">{q.sub}</span>
              </motion.button>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Prototype · mock data only. No real authentication or backend.
          </p>
        </motion.div>

        {/* Email / password form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <div className="card p-8">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Cred<span className="text-psc-dark">Malawi</span>
              </span>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Sign in</h1>
            <p className="mt-1 text-sm text-slate-500">
              Use a seeded demo account. Any password works.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="eyebrow">Email</span>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="institution@demo.mw"
                  className="input mt-1"
                  autoComplete="username"
                />
              </label>
              <label className="block">
                <span className="eyebrow">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="any password"
                  className="input mt-1"
                  autoComplete="current-password"
                />
              </label>

              {error && (
                <p className="rounded-lg border border-ictam/30 bg-ictam-tint px-3 py-2 text-xs font-medium text-ictam-dark">
                  {error}
                </p>
              )}

              <button type="submit" className="btn-gold w-full">
                Sign in
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <p className="eyebrow">Demo accounts</p>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
                {demoAccounts.map((a) => (
                  <li key={a.email} className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => setEmail(a.email)}
                      className="font-mono text-brandblue hover:underline"
                    >
                      {a.email}
                    </button>
                    <span className="capitalize text-slate-400">{a.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
