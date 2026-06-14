"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "scanning" | "revealed";

/**
 * The signature trust moment. For a valid credential we play a deliberate
 * ~1s "Verifying credential…" scan (a progress ring plus shimmer) that resolves
 * into a green check drawing itself in, then reveals the badge card beneath.
 * Revoked credentials skip the green resolve and reveal directly.
 */
export default function VerifyReveal({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("scanning");

  useEffect(() => {
    const t = setTimeout(() => setPhase("revealed"), valid ? 1150 : 700);
    return () => clearTimeout(t);
  }, [valid]);

  return (
    <div className="relative">
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 z-20 flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-soft"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <motion.div
                className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-psc/15 to-transparent"
                animate={{ x: ["0%", "400%"] }}
                transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
              />
            </div>

            <div className="relative flex flex-col items-center">
              <ProgressRing valid={valid} />
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 text-sm font-semibold tracking-wide text-slate-900"
              >
                Verifying credential…
              </motion.p>
              <p className="mt-1 text-xs text-slate-400">
                Checking the national registry
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={phase === "revealed" ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ProgressRing({ valid }: { valid: boolean }) {
  const stroke = valid ? "#16A34A" : "#E11D2A";
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#E2E8F0" strokeWidth="6" />
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: valid ? 1.0 : 0.6, ease: "easeInOut" }}
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 m-auto h-10 w-10"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {valid ? (
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.7, ease: "easeOut" }}
          />
        ) : (
          <motion.path
            d="M7 7l10 10M17 7L7 17"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          />
        )}
      </svg>
    </div>
  );
}
