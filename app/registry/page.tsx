import RegistryClient from "./RegistryClient";
import { providers } from "@/lib/data";

export const metadata = {
  title: "Provider Registry — CredMalawi",
};

export default function RegistryPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-ink text-white">
        <div className="container-page py-14">
          <h1 className="text-3xl font-bold tracking-tight">
            ICTAM-Accredited Provider Registry
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            A public list of training providers authorised to issue credentials
            on CredMalawi. Search by name, filter by region, and click through
            to see the programmes each provider can credential.
          </p>
        </div>
      </section>

      <RegistryClient providers={providers} />
    </div>
  );
}
