"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/registry", label: "Registry" },
  { href: "/dashboard", label: "Provider Dashboard" },
  { href: "/ictam", label: "ICTAM Analytics" },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-base-600/60 bg-base-900/70 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          {/* PSC gold + ICTAM red co-brand mark */}
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-base-700 text-sm font-bold ring-1 ring-base-600">
            <span className="text-gradient-gold">C</span>
            <span className="text-ictam-light">M</span>
            <span className="absolute -bottom-px left-1.5 right-1.5 h-px bg-gradient-to-r from-ictam to-psc" />
          </span>
          <span className="text-lg font-bold tracking-tight text-ink">
            Cred<span className="text-psc">Malawi</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-ictam to-psc"
                  />
                )}
              </Link>
            );
          })}
          <Link href="/verify/MW-CRED-1001" className="btn-red ml-2">
            Verify a Credential
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-ink-muted hover:bg-white/5 hover:text-ink md:hidden"
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
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-base-600/60 bg-base-900/95 md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-white/5 hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
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
