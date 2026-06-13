import AppShell from "@/components/app/AppShell";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
