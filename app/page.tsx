import Link from "next/link";
import { CheckBadge, ShieldCheck } from "@/components/icons";
import { providers, credentials } from "@/lib/data";

const steps = [
  {
    n: "01",
    title: "Training provider issues",
    body: "An ICTAM-accredited provider creates a badge template and issues a credential to a learner who has met the assessment criteria.",
    accent: "text-ictam-blue",
  },
  {
    n: "02",
    title: "CredMalawi signs & stores",
    body: "CredMalawi records the credential under national authority, attaches Open Badge metadata, and generates a unique, permanent verification URL.",
    accent: "text-psc",
  },
  {
    n: "03",
    title: "Learner shares, employer verifies",
    body: "The learner shares a link or QR code. Anyone — an employer, a partner, a border agency — can verify it instantly with no login.",
    accent: "text-verified",
  },
];

export default function HomePage() {
  const activeProviders = providers.filter((p) => p.status === "Accredited").length;
  const validCreds = credentials.filter((c) => c.status === "valid").length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,146,14,0.18),transparent_55%)]" />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="tag border border-psc/40 bg-psc/10 text-psc-light">
              <ShieldCheck className="h-3.5 w-3.5" /> National authority · ICTAM accredited
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Verifiable digital credentials for Malawi&apos;s{" "}
              <span className="text-psc-light">ICT sector</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              CredMalawi is the national platform where accredited training
              providers issue tamper-evident digital badges. Every credential is
              publicly verifiable by URL or QR code — instantly, and without a
              login.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/verify/MW-CRED-1001" className="btn-gold">
                Verify a credential
              </Link>
              <Link href="/registry" className="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10">
                Browse the provider registry
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              <Stat value={`${activeProviders}`} label="Accredited providers" />
              <Stat value={`${validCreds}`} label="Valid credentials" />
              <Stat value="3" label="Regions covered" />
            </dl>
          </div>

          {/* Floating badge preview */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-2xl border border-psc/30 bg-ink-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="tag bg-white/10 text-psc-light">
                  Open Badge 3.0 Compliant
                </span>
                <span className="tag bg-verified text-white">
                  <CheckBadge className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-psc/20 text-psc-light">
                  <CheckBadge className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Associate · Networking
                  </p>
                  <p className="text-xl font-bold">Network Security Fundamentals</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
                <Row k="Awarded to" v="Tadala Phiri" />
                <Row k="Issuing provider" v="Blantyre Institute of Technology" />
                <Row k="Accrediting authority" v="ICTAM" />
              </div>
              <Link
                href="/verify/MW-CRED-1001"
                className="mt-6 block rounded-lg bg-psc px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-psc-dark"
              >
                Open verification page →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-psc">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            From classroom to verified credential
          </h2>
          <p className="mt-3 text-slate-600">
            Three steps connect accredited training to instant, trustworthy
            verification anyone can rely on.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card p-7">
              <span className={`text-4xl font-bold ${s.accent}`}>{s.n}</span>
              <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="border-y border-slate-200 bg-white">
        <div className="container-page grid gap-8 py-14 md:grid-cols-3">
          <TrustItem
            title="Government-grade credibility"
            body="Issued under the institutional authority of ICTAM and operated by Phantom Stack Collective."
          />
          <TrustItem
            title="Open standards"
            body="Credentials align with Open Badges 2.0 / 3.0 metadata so they travel across platforms and borders."
          />
          <TrustItem
            title="Public by default"
            body="Verification needs no account. A link or a QR code is all an employer needs to confirm a skill."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div className="overflow-hidden rounded-2xl bg-ink px-8 py-12 text-center text-white sm:px-16">
          <h2 className="text-3xl font-bold">Ready to explore the platform?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Walk the full flow — verify a live credential, browse the registry,
            open a learner wallet, or step into the provider dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/wallet/learner-tadala-phiri" className="btn-gold">
              Open a learner wallet
            </Link>
            <Link href="/dashboard" className="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10">
              Provider dashboard
            </Link>
            <Link href="/ictam" className="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10">
              ICTAM analytics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-3xl font-bold text-psc-light">{value}</dt>
      <dd className="mt-1 text-xs text-slate-400">{label}</dd>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{k}</span>
      <span className="text-right font-medium text-white">{v}</span>
    </div>
  );
}

function TrustItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-verified-bg text-verified">
        <CheckBadge className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{body}</p>
      </div>
    </div>
  );
}
