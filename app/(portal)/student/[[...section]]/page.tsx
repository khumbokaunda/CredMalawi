import StudentPortal from "@/components/portal/StudentPortal";

const VALID = ["credentials", "public", "verify", "profile"];

export default function StudentSectionPage({
  params,
}: {
  params: { section?: string[] };
}) {
  const section = params.section?.[0] ?? "credentials";
  return <StudentPortal section={VALID.includes(section) ? section : "credentials"} />;
}
