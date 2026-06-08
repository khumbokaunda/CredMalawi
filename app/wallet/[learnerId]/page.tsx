import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLearner,
  getCredentialsForLearner,
  learners,
} from "@/lib/data";
import CredentialMiniCard from "@/components/CredentialMiniCard";
import WalletActions from "./WalletActions";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MapPin, ShieldCheck } from "@/components/icons";

export function generateStaticParams() {
  return learners.map((l) => ({ learnerId: l.id }));
}

export default function WalletPage({
  params,
}: {
  params: { learnerId: string };
}) {
  const learner = getLearner(params.learnerId);
  if (!learner) notFound();

  const creds = getCredentialsForLearner(learner.id);
  const valid = creds.filter((c) => c.status === "valid");
  const initials = learner.fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div>
      {/* Profile header */}
      <section className="relative overflow-hidden border-b border-base-600/60 bg-mesh">
        <div className="container-page py-12">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-psc/25 to-ictam/15 text-2xl font-bold text-psc-light ring-1 ring-psc/30">
                {initials}
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-ink">
                  {learner.fullName}
                </h1>
                <p className="mt-1 text-ink-muted">{learner.headline}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-faint">
                  <MapPin className="h-4 w-4" />
                  {learner.city}, {learner.region} Region
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-base-600/60 bg-base-800/60 px-5 py-4 text-center">
              <p className="text-3xl font-bold text-verified-light">{valid.length}</p>
              <p className="text-xs text-ink-faint">verified credentials</p>
            </div>
          </Reveal>

          <p className="mt-6 flex items-center gap-2 text-sm text-ink-faint">
            <ShieldCheck className="h-4 w-4 text-ictam-light" />
            Public learner wallet · Every badge below links to its independent
            verification page.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <h2 className="text-xl font-bold text-ink">Earned credentials</h2>
        <Stagger className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creds.map((c) => (
            <StaggerItem key={c.id} className="flex flex-col gap-3">
              <CredentialMiniCard credential={c} />
              <WalletActions
                credentialId={c.id}
                skill={c.skill}
                disabled={c.status === "revoked"}
              />
            </StaggerItem>
          ))}
        </Stagger>

        {creds.length === 0 && (
          <p className="mt-6 text-ink-muted">
            This learner has not earned any credentials yet.
          </p>
        )}

        <div className="mt-10">
          <Link href="/registry" className="text-sm font-semibold text-ictam-light hover:text-ictam">
            ← Explore accredited providers
          </Link>
        </div>
      </div>
    </div>
  );
}
