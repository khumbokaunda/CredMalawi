import Link from "next/link";
import { getCredential, getLearner } from "@/lib/data";
import BadgeCard from "@/components/BadgeCard";
import VerifyPanel from "@/components/VerifyPanel";
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
      <div className="container-page py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <QuestionCircle className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink">
            Credential not found
          </h1>
          <p className="mt-3 text-slate-600">
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
            <Link href="/verify/MW-CRED-1001" className="btn-gold">
              Try a sample credential
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const learner = getLearner(credential.learnerId);

  return (
    <div className="bg-slate-50">
      {/* Verification context header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page flex items-center gap-2 py-4 text-sm text-slate-500">
          <ShieldCheck className="h-4 w-4 text-psc" />
          Public credential verification · No login required
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BadgeCard credential={credential} />
        </div>

        <div className="space-y-6">
          <VerifyPanel credentialId={credential.id} />

          {learner && (
            <div className="card p-6">
              <p className="text-sm font-semibold text-ink">Credential holder</p>
              <p className="mt-2 text-base font-bold text-ink">
                {learner.fullName}
              </p>
              <p className="text-sm text-slate-500">{learner.headline}</p>
              <Link
                href={`/wallet/${learner.id}`}
                className="mt-4 inline-block text-sm font-semibold text-ictam-blue hover:underline"
              >
                View full learner wallet →
              </Link>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-6 text-xs leading-relaxed text-slate-500">
            <p className="font-semibold text-slate-600">About this check</p>
            <p className="mt-2">
              This page reflects the credential&apos;s current status in the
              CredMalawi registry. A genuine credential shows a green verified
              banner; revoked credentials are clearly marked in red.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
