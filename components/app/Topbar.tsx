"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Role } from "@/lib/types";
import { useAuth, homePathForRole } from "@/lib/auth";
import { portals } from "./nav";

const roleLabels: Record<Role, string> = {
  institution: "Institution",
  student: "Student",
  admin: "ICTAM Admin",
};

export default function Topbar({
  role,
  onOpenMobile,
}: {
  role: Role;
  onOpenMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchRole, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = portals[role];
  const current = meta.items.find(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/")
  );

  const initials = (user?.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function onSwitch(r: Role) {
    switchRole(r);
    setMenuOpen(false);
    router.push(homePathForRole(r));
  }

  function onLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p className="text-[11px] font-medium text-slate-400">{meta.title}</p>
          <h1 className="text-base font-bold leading-tight text-slate-900">
            {current?.label ?? "Dashboard"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 sm:inline-flex">
          Prototype · mock data
        </span>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 transition hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold leading-tight text-slate-900">
                {user?.name?.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="block text-[10px] capitalize leading-tight text-slate-400">
                {role}
              </span>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>

                  <div className="p-1.5">
                    <Link
                      href={role === "student" ? "/student/profile" : homePathForRole(role)}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
                    >
                      Profile
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 px-1.5 py-1.5">
                    <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch role (demo)
                    </p>
                    {(Object.keys(roleLabels) as Role[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => onSwitch(r)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-slate-100 ${
                          r === role ? "font-semibold text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {roleLabels[r]}
                        {r === role && <span className="text-xs text-verified">● current</span>}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 p-1.5">
                    <button
                      onClick={onLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ictam transition hover:bg-ictam-tint"
                    >
                      Log out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
