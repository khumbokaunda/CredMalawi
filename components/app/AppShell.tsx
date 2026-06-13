"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Role } from "@/lib/types";
import { useAuth, homePathForRole } from "@/lib/auth";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AREAS: Role[] = ["institution", "student", "admin"];

function areaFromPath(pathname: string): Role | null {
  const seg = pathname.split("/")[1] as Role;
  return AREAS.includes(seg) ? seg : null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const area = areaFromPath(pathname);

  // Restore collapse preference.
  useEffect(() => {
    const saved = localStorage.getItem("credmalawi:sidebar-collapsed");
    if (saved) setCollapsed(saved === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("credmalawi:sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Auth + role guard.
  useEffect(() => {
    if (!ready) return;
    if (!user) {
      // Unauthenticated (incl. just-logged-out) → public landing.
      router.replace("/");
    } else if (area && user.role !== area) {
      router.replace(homePathForRole(user.role));
    }
  }, [ready, user, area, router]);

  // Loading / redirecting state.
  if (!ready || !user || (area && user.role !== area)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-psc" />
          <p className="text-sm">Loading workspace…</p>
        </div>
      </div>
    );
  }

  const role = user.role;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 248 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 hidden h-screen shrink-0 lg:block"
      >
        <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <Sidebar
                role={role}
                collapsed={false}
                onToggle={() => setMobileOpen(false)}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
