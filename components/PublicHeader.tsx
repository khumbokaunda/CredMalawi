"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, homePathForRole } from "@/lib/auth";

const links = [
  { href: "/registry", label: "Registry" },
  { href: "/pricing", label: "Pricing" },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Cred<span className="text-psc-dark">Malawi</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {user ? (
            <Link href={homePathForRole(user.role)} className="btn-gold ml-2">
              Go to dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-outline ml-2">
              Log in
            </Link>
          )}
          <Link href="/verify/MW-CRED-1001" className="btn-red ml-1">
            Verify a Credential
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href={user ? homePathForRole(user.role) : "/login"}
                onClick={() => setOpen(false)}
                className="btn-outline mt-1"
              >
                {user ? "Go to dashboard" : "Log in"}
              </Link>
              <Link
                href="/verify/MW-CRED-1001"
                onClick={() => setOpen(false)}
                className="btn-red mt-1"
              >
                Verify a Credential
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-sm font-bold ${className}`}
    >
      <span className="text-psc">C</span>
      <span className="text-ictam-light">M</span>
      <span className="absolute -bottom-px left-1.5 right-1.5 h-px bg-gradient-to-r from-ictam to-psc" />
    </span>
  );
}
