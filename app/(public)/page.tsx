import Link from "next/link";
import { CheckBadge, ShieldCheck } from "@/components/icons";
import { providers, credentials } from "@/lib/data";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import CountUp from "@/components/motion/CountUp";

const steps = [
  {
    n: "01",
    title: "Training provider issues",
    body: "An ICTAM-accredited provider creates a badge template and issues a credential to a learner who has met the assessment criteria.",
    accent: "text-ictam",
    ring: "ring-ictam/20 bg-ictam-tint",
  },
  {
    n: "02",
    title: "CredMalawi signs & stores",
    body: "CredMalawi records the credential under national authority, attaches Open Badge metadata, and generates a unique, permanent verification URL.",
    accent: "text-psc-dark",
    ring: "ring-psc/30 bg-psc-tint",
  },
  {
    n: "03",
    title: "Learner shares, employer verifies",
    body: "The learner shares a link or QR code. Anyone, whether an employer, a partner, or a border agency, can verify it instantly with no login.",
    accent: "text-verified-dark",
    ring: "ring-verified/20 bg-verified-tint",
  },
];

export default function HomePage() {
  const activeProviders = providers.filter((p) => p.status === "Accredited").length;
  const validCreds = credentials.filter((c) => c.status === "valid").length;

  return (
    <div>
      {/* Hero, navy panel */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,29,42,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(245,166,35,0.12),transparent_55%)]" />
        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <Reveal>
              <span className="tag border border-ictam/40 bg-ictam/15 text-ictam-light">
                <ShieldCheck className="h-3.5 w-3.5" /> National authority · ICTAM accredited
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Verifiable digital credentials for Malawi&apos;s{" "}
                <span className="text-psc-light">ICT sector</span>.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                CredMalawi is the national platform where accredited training
                providers issue tamper-evident digital badges. Every credential
                is publicly verifiable by URL or QR code, instantly and without
                a login.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/verify/MW-CRED-1001" className="btn-red">
                  Verify a credential
                </Link>
                <Link href="/registry" className="btn-on-dark">
                  Browse the provider registry
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
                <Stat value={activeProviders} label="Accredited providers" tone="text-psc-light" />
                <Stat value={validCreds} label="Valid credentials" tone="text-ictam-light" />
                <Stat value={3} label="Regions covered" tone="text-verified-light" />
              </dl>
            </Reveal>
          </div>

          {/* Floating badge preview */}
          <Reveal direction="left" delay={0.2} className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-ictam/25 via-transparent to-psc/25 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-psc to-transparent" />
              <div className="flex items-center justify-between">
                <span className="tag border border-psc/30 bg-psc/15 text-psc-light">
                  Open Badge 3.0 Compliant
                </span>
                <span className="tag border border-verified/30 bg-verified/15 text-verified-light">
                  <CheckBadge className="h-3.5 w-3.5" /> Verified
                </span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-psc/25 to-ictam/20 text-psc-light ring-1 ring-psc/30">
                  <CheckBadge className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Associate · Networking
                  </p>
                  <p className="text-xl font-bold">Network Security Fundamentals</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm">
                <Row k="Awarded to" v="Peter Chimbuto" />
                <Row k="Issuing provider" v="Blantyre Institute of Technology" />
                <Row k="Accrediting authority" v="ICTAM" accent />
              </div>
              <Link href="/verify/MW-CRED-1001" className="btn-red mt-6 w-full">
                Open verification page →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-psc-dark">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            From classroom to verified credential
          </h2>
          <p className="mt-3 text-slate-500">
            Three steps connect accredited training to instant, trustworthy
            verification anyone can rely on.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <StaggerItem key={s.n}>
              <div className="card hover-lift h-full p-7">
                <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold ring-1 ${s.ring} ${s.accent}`}>
                  {s.n}
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Trust band */}
      <section className="border-y border-slate-200 bg-white">
        <Stagger className="container-page grid gap-8 py-14 md:grid-cols-3">
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
        </Stagger>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-12 text-center text-white shadow-lift sm:px-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ictam/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-psc/15 blur-3xl" />
            <h2 className="relative text-3xl font-bold">Ready to explore the platform?</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-slate-300">
              Sign in to a role-based portal, or verify a live credential, browse
              the registry, and open a learner profile.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/login" className="btn-gold">
                Sign in to a portal
              </Link>
              <Link href="/wallet/learner-peter-chimbuto" className="btn-on-dark">
                Open a learner profile
              </Link>
              <Link href="/registry" className="btn-on-dark">
                Provider registry
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div>
      <dt className={`text-4xl font-bold ${tone}`}>
        <CountUp value={value} />
      </dt>
      <dd className="mt-1 text-xs text-slate-400">{label}</dd>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{k}</span>
      <span className={`text-right font-medium ${accent ? "text-ictam-light" : "text-white"}`}>
        {v}
      </span>
    </div>
  );
}

function TrustItem({ title, body }: { title: string; body: string }) {
  return (
    <StaggerItem>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-verified-tint text-verified ring-1 ring-verified/20">
          <CheckBadge className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{body}</p>
        </div>
      </div>
    </StaggerItem>
  );
}
