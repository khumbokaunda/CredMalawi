import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLearner,
  getCredentialsForLearner,
  learners,
} from "@/lib/data";
import CredentialMiniCard from "@/components/CredentialMiniCard";
import WalletActions from "./WalletActions";
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
      <section className="bg-ink text-white">
        <div className="container-page py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-psc/20 text-2xl font-bold text-psc-light">
                {initials}
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {learner.fullName}
                </h1>
                <p className="mt-1 text-slate-300">{learner.headline}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {learner.city}, {learner.region} Region
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center">
              <p className="text-3xl font-bold text-psc-light">{valid.length}</p>
              <p className="text-xs text-slate-400">verified credentials</p>
            </div>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-psc-light" />
            Public learner wallet · Every badge below links to its independent
            verification page.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <h2 className="text-xl font-bold text-ink">Earned credentials</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creds.map((c) => (
            <div key={c.id} className="flex flex-col gap-3">
              <CredentialMiniCard credential={c} />
              <WalletActions
                credentialId={c.id}
                skill={c.skill}
                disabled={c.status === "revoked"}
              />
            </div>
          ))}
        </div>

        {creds.length === 0 && (
          <p className="mt-6 text-slate-500">
            This learner has not earned any credentials yet.
          </p>
        )}

        <div className="mt-10">
          <Link href="/registry" className="text-sm font-semibold text-ictam-blue hover:underline">
            ← Explore accredited providers
          </Link>
        </div>
      </div>
    </div>
  );
}
