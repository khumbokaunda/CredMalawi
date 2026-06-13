import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export interface PortalMeta {
  /** Tailwind text accent class for the active state. */
  accentText: string;
  /** Tailwind bg accent for active pill. */
  accentBg: string;
  ring: string;
  title: string;
  items: NavItem[];
}

export const portals: Record<Role, PortalMeta> = {
  institution: {
    accentText: "text-psc",
    accentBg: "bg-psc",
    ring: "ring-psc/40",
    title: "Institution Portal",
    items: [
      { href: "/institution/dashboard", label: "Dashboard", icon: "grid" },
      { href: "/institution/issue", label: "Issue Credential", icon: "plus" },
      { href: "/institution/templates", label: "Badge Templates", icon: "template" },
      { href: "/institution/history", label: "Issuance History", icon: "list" },
      { href: "/institution/revocations", label: "Revocations", icon: "ban" },
      { href: "/institution/accreditation", label: "Accreditation Status", icon: "shield" },
    ],
  },
  student: {
    accentText: "text-verified",
    accentBg: "bg-verified",
    ring: "ring-verified/40",
    title: "Student Portal",
    items: [
      { href: "/student/credentials", label: "My Credentials", icon: "badge" },
      { href: "/student/public", label: "Public Profile", icon: "link" },
      { href: "/student/verify", label: "Verify a Credential", icon: "check" },
      { href: "/student/profile", label: "Profile", icon: "user" },
    ],
  },
  admin: {
    accentText: "text-ictam",
    accentBg: "bg-ictam",
    ring: "ring-ictam/40",
    title: "ICTAM Administrator",
    items: [
      { href: "/admin/overview", label: "Overview", icon: "grid" },
      { href: "/admin/institutions", label: "Institutions", icon: "users" },
      { href: "/admin/requests", label: "Accreditation Requests", icon: "inbox" },
      { href: "/admin/registry", label: "Registry", icon: "registry" },
      { href: "/admin/credentials", label: "All Credentials", icon: "list" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
};
