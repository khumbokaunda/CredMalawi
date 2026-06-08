import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProvider,
  getCredentialsForProvider,
  providers,
} from "@/lib/data";
import CredentialMiniCard from "@/components/CredentialMiniCard";
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
      <section className="border-b border-slate-200 bg-ink text-white">
        <div className="container-page py-12">
          <Link
            href="/registry"
            className="text-sm text-slate-400 hover:text-psc-light"
          >
            ← Back to registry
          </Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-psc-light">
              {provider.shortName}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  {provider.name}
                </h1>
                <span
                  className={`tag ${
                    provider.status === "Accredited"
                      ? "bg-verified text-white"
                      : "bg-psc text-white"
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
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-ink">About</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              {provider.about}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-ink">
              Authorised programmes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Programmes ICTAM has authorised this provider to credential.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {provider.programmes.map((pr) => (
                <div
                  key={pr}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <CheckBadge className="h-5 w-5 shrink-0 text-verified" />
                  <span className="text-sm font-semibold text-ink">{pr}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">
                Credentials issued ({issued.length})
              </h2>
            </div>
            {issued.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {issued.map((c) => (
                  <CredentialMiniCard key={c.id} credential={c} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No credentials issued yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-ink">
              <ShieldCheck className="h-5 w-5 text-psc" />
              Accreditation
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <SideRow k="Accrediting authority" v="ICTAM" />
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
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-ink">At a glance</h3>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-slate-400">Credentials issued</dt>
                <dd className="text-2xl font-bold text-ink">{issued.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Currently valid</dt>
                <dd className="text-2xl font-bold text-verified">{validCount}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-6 text-sm">
            <h3 className="font-bold text-ink">Contact</h3>
            <p className="mt-3 text-slate-600">{provider.website}</p>
            <p className="text-slate-600">{provider.contactEmail}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SideRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{k}</dt>
      <dd className="font-semibold text-ink">{v}</dd>
    </div>
  );
}
