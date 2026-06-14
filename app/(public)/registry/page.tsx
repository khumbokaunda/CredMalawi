import RegistryClient from "./RegistryClient";
import Reveal from "@/components/motion/Reveal";

export const metadata = {
  title: "Provider Registry · CredMalawi",
};

export default function RegistryPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-navy text-white">
        <div className="container-page py-14">
          <Reveal>
            <span className="tag border border-ictam/40 bg-ictam/15 text-ictam-light">
              ICTAM accredited
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">
              Provider Registry
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              A public list of training providers authorised to issue
              credentials on CredMalawi. Search by name, filter by region, and
              click through to see the programmes each provider can credential.
            </p>
          </Reveal>
        </div>
      </section>

      <RegistryClient />
    </div>
  );
}
