import RegistryClient from "./RegistryClient";
import { providers } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";

export const metadata = {
  title: "Provider Registry — CredMalawi",
};

export default function RegistryPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-base-600/60 bg-mesh">
        <div className="container-page py-14">
          <Reveal>
            <span className="tag border border-ictam/40 bg-ictam/10 text-ictam-light">
              ICTAM accredited
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
              Provider Registry
            </h1>
            <p className="mt-3 max-w-2xl text-ink-muted">
              A public list of training providers authorised to issue
              credentials on CredMalawi. Search by name, filter by region, and
              click through to see the programmes each provider can credential.
            </p>
          </Reveal>
        </div>
      </section>

      <RegistryClient providers={providers} />
    </div>
  );
}
