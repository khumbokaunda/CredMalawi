"use client";

import Link from "next/link";
import { getLearner } from "@/lib/data";
import { useCredentialsForLearner } from "@/lib/store";
import CredentialMiniCard from "@/components/CredentialMiniCard";
import WalletActions from "./WalletActions";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MapPin, ShieldCheck, QuestionCircle } from "@/components/icons";

export default function WalletPage({
  params,
}: {
  params: { learnerId: string };
}) {
  const learner = getLearner(params.learnerId);
  const creds = useCredentialsForLearner(params.learnerId);

  if (!learner) {
    return (
      <div className="container-page py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-soft">
          <QuestionCircle className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Learner not found</h1>
        <Link href="/registry" className="btn-outline mt-6">
          Back to registry
        </Link>
      </div>
    );
  }

  const valid = creds.filter((c) => c.status === "valid");
  const initials = learner.fullName.split(" ").map((n) => n[0]).join("");

  return (
    <div>
      {/* Profile header */}
      <section className="border-b border-slate-200 bg-navy text-white">
        <div className="container-page py-12">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-psc/25 to-ictam/20 text-2xl font-bold text-psc-light ring-1 ring-psc/30">
                {initials}
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{learner.fullName}</h1>
                <p className="mt-1 text-slate-300">{learner.headline}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {learner.city}, {learner.region} Region
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
              <p className="text-3xl font-bold text-verified-light">{valid.length}</p>
              <p className="text-xs text-slate-400">verified credentials</p>
            </div>
          </Reveal>

          <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck className="h-4 w-4 text-psc-light" />
            Public learner profile · Every badge below links to its independent
            verification page.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <h2 className="text-xl font-bold text-slate-900">Earned credentials</h2>
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
          <p className="mt-6 text-slate-500">
            This learner has not earned any credentials yet.
          </p>
        )}

        <div className="mt-10">
          <Link href="/registry" className="text-sm font-semibold text-brandblue hover:underline">
            ← Explore accredited providers
          </Link>
        </div>
      </div>
    </div>
  );
}
