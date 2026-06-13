"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Role } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { portals } from "./nav";
import NavIcon from "./NavIcon";

export default function Sidebar({
  role,
  collapsed,
  onToggle,
  onNavigate,
}: {
  role: Role;
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const meta = portals[role];

  const initials = (user?.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function doLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex h-full flex-col bg-navy text-slate-200">
      {/* Brand + collapse toggle */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-4">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
            <span className="text-psc">C</span>
            <span className="text-ictam-light">M</span>
          </span>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap text-base font-bold text-white"
              >
                Cred<span className="text-psc">Malawi</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="ml-auto hidden rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:block"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {collapsed ? <path d="M9 6l6 6-6 6" /> : <path d="M15 6l-6 6 6 6" />}
          </svg>
        </button>
      </div>

      {/* Portal label */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"
          >
            {meta.title}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {meta.items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full ${meta.accentBg}`}
                />
              )}
              <NavIcon name={item.icon} className={`h-5 w-5 shrink-0 ${active ? meta.accentText : ""}`} />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User block + logout */}
      <div className="border-t border-white/10 p-3">
        <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-psc/30 to-ictam/30 text-xs font-bold text-white ring-1 ring-white/10">
            {initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs capitalize text-slate-400">{role}</p>
            </div>
          )}
        </div>
        <button
          onClick={doLogout}
          title="Log out"
          className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-ictam/15 hover:text-ictam-light ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <NavIcon name="logout" className="h-5 w-5 shrink-0" />
          {!collapsed && "Log out"}
        </button>
      </div>
    </div>
  );
}
