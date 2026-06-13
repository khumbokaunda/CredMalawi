"use client";

import Link from "next/link";
import { useProvider, useCredentialsForProvider } from "@/lib/store";
import CredentialMiniCard from "@/components/CredentialMiniCard";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MapPin, CheckBadge, ShieldCheck, QuestionCircle } from "@/components/icons";

export default function ProviderProfilePage({
  params,
}: {
  params: { providerId: string };
}) {
  const provider = useProvider(params.providerId);
  const issued = useCredentialsForProvider(params.providerId);

  if (!provider) {
    return (
      <div className="container-page py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-soft">
          <QuestionCircle className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Provider not found</h1>
        <Link href="/registry" className="btn-outline mt-6">
          Back to registry
        </Link>
      </div>
    );
  }

  const validCount = issued.filter((c) => c.status === "valid").length;

  return (
    <div>
      {/* Header */}
      <section className="border-b border-slate-200 bg-navy text-white">
        <div className="container-page py-12">
          <Link href="/registry" className="text-sm text-slate-400 transition hover:text-psc-light">
            ← Back to registry
          </Link>
          <Reveal className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-psc-light">
              {provider.shortName}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{provider.name}</h1>
                <span
                  className={`tag ${
                    provider.status === "Accredited"
                      ? "border border-verified/30 bg-verified/15 text-verified-light"
                      : "border border-psc/30 bg-psc/15 text-psc-light"
                  }`}
                >
                  {provider.status}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-slate-300">
                <MapPin className="h-4 w-4" />
                {provider.city}, {provider.region} Region
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Reveal>
            <h2 className="text-xl font-bold text-slate-900">About</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{provider.about}</p>
          </Reveal>

          <Reveal>
            <h2 className="text-xl font-bold text-slate-900">Authorised programmes</h2>
            <p className="mt-1 text-sm text-slate-400">
              Programmes ICTAM has authorised this provider to credential.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {provider.programmes.map((pr) => (
                <div
                  key={pr}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <CheckBadge className="h-5 w-5 shrink-0 text-verified" />
                  <span className="text-sm font-semibold text-slate-900">{pr}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Credentials issued ({issued.length})
            </h2>
            {issued.length > 0 ? (
              <Stagger className="mt-4 grid gap-4 sm:grid-cols-2">
                {issued.map((c) => (
                  <StaggerItem key={c.id}>
                    <CredentialMiniCard credential={c} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No credentials issued yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Reveal direction="left" className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="h-5 w-5 text-ictam" />
              Accreditation
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <SideRow k="Accrediting authority" v="ICTAM" accent />
              <SideRow
                k="Accredited since"
                v={
                  provider.accreditedSince
                    ? new Date(provider.accreditedSince).toLocaleDateString("en-GB", {
                        month: "long",
                        year: "numeric",
                      })
                    : "—"
                }
              />
              <SideRow k="Status" v={provider.status} />
              <SideRow k="Subscription tier" v={provider.tier} />
            </dl>
          </Reveal>

          <Reveal direction="left" delay={0.08} className="card p-6">
            <h3 className="font-bold text-slate-900">At a glance</h3>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-slate-400">Credentials issued</dt>
                <dd className="text-2xl font-bold text-slate-900">{issued.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Currently valid</dt>
                <dd className="text-2xl font-bold text-verified">{validCount}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal direction="left" delay={0.16} className="card p-6 text-sm">
            <h3 className="font-bold text-slate-900">Contact</h3>
            <p className="mt-3 text-slate-600">{provider.website}</p>
            <p className="text-slate-600">{provider.contactEmail}</p>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}

function SideRow({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{k}</dt>
      <dd className={`font-semibold ${accent ? "text-ictam" : "text-slate-900"}`}>{v}</dd>
    </div>
  );
}
