import DashboardClient from "./DashboardClient";
import { getProvider, getCredentialsForProvider } from "@/lib/data";

export const metadata = {
  title: "Provider Dashboard — CredMalawi",
};

// The mocked "logged-in" provider for the demo.
const ACTIVE_PROVIDER_ID = "prov-blantyre-tech";

export default function DashboardPage() {
  const provider = getProvider(ACTIVE_PROVIDER_ID)!;
  const issued = getCredentialsForProvider(ACTIVE_PROVIDER_ID);

  return <DashboardClient provider={provider} initialCredentials={issued} />;
}
