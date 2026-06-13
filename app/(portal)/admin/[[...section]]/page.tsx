import AdminPortal from "@/components/portal/AdminPortal";

const VALID = ["overview", "institutions", "requests", "registry", "credentials", "settings"];

export default function AdminSectionPage({
  params,
}: {
  params: { section?: string[] };
}) {
  const section = params.section?.[0] ?? "overview";
  return <AdminPortal section={VALID.includes(section) ? section : "overview"} />;
}
