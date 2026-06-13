import InstitutionPortal from "@/components/portal/InstitutionPortal";

const VALID = ["dashboard", "issue", "templates", "history", "revocations", "accreditation"];

export default function InstitutionSectionPage({
  params,
}: {
  params: { section?: string[] };
}) {
  const section = params.section?.[0] ?? "dashboard";
  return <InstitutionPortal section={VALID.includes(section) ? section : "dashboard"} />;
}
