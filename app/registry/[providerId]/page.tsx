import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProvider,
  getCredentialsForProvider,
  providers,
} from "@/lib/data";
import CredentialMiniCard from "@/components/CredentialMiniCard";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { MapPin, CheckBadge, ShieldCheck } from "@/components/icons";

export function generateStaticParams() {
  return providers.map((p) => ({ providerId: p.id }));
}

export default function ProviderProfilePage({
  params,
}: {
  params: { providerId: string };
}) {
  const provider = getProvider(params.providerId);
  if (!provider) notFound();

  const issued = getCredentialsForProvider(provider.id);
  const validCount = issued.filter((c) => c.status === "valid").length;

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-base-600/60 bg-mesh">
        <div className="container-page py-12">
          <Link
            href="/registry"
            className="text-sm text-ink-faint transition hover:text-psc-light"
          >
            ← Back to registry
          </Link>
          <Reveal className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-base-700 text-2xl font-bold text-psc-light ring-1 ring-base-600">
              {provider.shortName}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-ink">
                  {provider.name}
                </h1>
                <span
                  className={`tag ${
                    provider.status === "Accredited"
                      ? "border border-verified/30 bg-verified/10 text-verified-light"
                      : "border border-psc/30 bg-psc/10 text-psc-light"
                  }`}
                >
                  {provider.status}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-ink-muted">
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
            <h2 className="text-xl font-bold text-ink">About</h2>
            <p className="mt-3 leading-relaxed text-ink-muted">{provider.about}</p>
          </Reveal>

          <Reveal>
            <h2 className="text-xl font-bold text-ink">Authorised programmes</h2>
            <p className="mt-1 text-sm text-ink-faint">
              Programmes ICTAM has authorised this provider to credential.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {provider.programmes.map((pr) => (
                <div
                  key={pr}
                  className="flex items-center gap-3 rounded-xl border border-base-600/60 bg-base-800/60 p-4"
                >
                  <CheckBadge className="h-5 w-5 shrink-0 text-verified-light" />
                  <span className="text-sm font-semibold text-ink">{pr}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div>
            <h2 className="text-xl font-bold text-ink">
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
              <p className="mt-4 text-sm text-ink-muted">
                No credentials issued yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Reveal direction="left" className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-ink">
              <ShieldCheck className="h-5 w-5 text-ictam-light" />
              Accreditation
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <SideRow k="Accrediting authority" v="ICTAM" accent />
              <SideRow
                k="Accredited since"
                v={new Date(provider.accreditedSince).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              />
              <SideRow k="Status" v={provider.status} />
              <SideRow k="Subscription tier" v={provider.tier} />
            </dl>
          </Reveal>

          <Reveal direction="left" delay={0.08} className="card p-6">
            <h3 className="font-bold text-ink">At a glance</h3>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-ink-faint">Credentials issued</dt>
                <dd className="text-2xl font-bold text-ink">{issued.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Currently valid</dt>
                <dd className="text-2xl font-bold text-verified-light">{validCount}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal direction="left" delay={0.16} className="card p-6 text-sm">
            <h3 className="font-bold text-ink">Contact</h3>
            <p className="mt-3 text-ink-muted">{provider.website}</p>
            <p className="text-ink-muted">{provider.contactEmail}</p>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}

function SideRow({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-faint">{k}</dt>
      <dd className={`font-semibold ${accent ? "text-ictam-light" : "text-ink"}`}>{v}</dd>
    </div>
  );
}
