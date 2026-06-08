import Link from "next/link";
import { getCredential, getLearner } from "@/lib/data";
import BadgeCard from "@/components/BadgeCard";
import VerifyPanel from "@/components/VerifyPanel";
import VerifyReveal from "@/components/VerifyReveal";
import Reveal from "@/components/motion/Reveal";
import { QuestionCircle, ShieldCheck } from "@/components/icons";

export default function VerifyPage({
  params,
}: {
  params: { credentialId: string };
}) {
  const credential = getCredential(params.credentialId);

  // ----- Not found state -----
  if (!credential) {
    return (
      <div className="container-page py-24">
        <Reveal className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-base-600 bg-base-800 text-ink-faint">
            <QuestionCircle className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink">
            Credential not found
          </h1>
          <p className="mt-3 text-ink-muted">
            No credential matches the ID{" "}
            <span className="font-mono font-semibold text-ink">
              {params.credentialId}
            </span>
            . The link may be mistyped, or this credential was never issued
            through CredMalawi.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/registry" className="btn-outline">
              Browse the registry
            </Link>
            <Link href="/verify/MW-CRED-1001" className="btn-red">
              Try a sample credential
            </Link>
          </div>
        </Reveal>
      </div>
    );
  }

  const learner = getLearner(credential.learnerId);
  const valid = credential.status === "valid";

  return (
    <div>
      {/* Verification context header */}
      <div className="border-b border-base-600/60 bg-base-900/50">
        <div className="container-page flex items-center gap-2 py-4 text-sm text-ink-muted">
          <ShieldCheck className="h-4 w-4 text-ictam-light" />
          Public credential verification · No login required
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VerifyReveal valid={valid}>
            <BadgeCard credential={credential} />
          </VerifyReveal>
        </div>

        <div className="space-y-6">
          <Reveal delay={valid ? 1.2 : 0.2}>
            <VerifyPanel credentialId={credential.id} />
          </Reveal>

          {learner && (
            <Reveal delay={valid ? 1.3 : 0.3}>
              <div className="card p-6">
                <p className="eyebrow">Credential holder</p>
                <p className="mt-2 text-base font-bold text-ink">
                  {learner.fullName}
                </p>
                <p className="text-sm text-ink-muted">{learner.headline}</p>
                <Link
                  href={`/wallet/${learner.id}`}
                  className="mt-4 inline-block text-sm font-semibold text-ictam-light hover:text-ictam"
                >
                  View full learner wallet →
                </Link>
              </div>
            </Reveal>
          )}

          <Reveal delay={valid ? 1.4 : 0.4}>
            <div className="panel p-6 text-xs leading-relaxed text-ink-faint">
              <p className="font-semibold text-ink-muted">About this check</p>
              <p className="mt-2">
                This page reflects the credential&apos;s current status in the
                CredMalawi registry. A genuine credential shows a green verified
                banner; revoked credentials are clearly marked in red.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
