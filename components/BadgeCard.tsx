import type { Credential } from "@/lib/types";
import { getProvider } from "@/lib/data";
import { CheckBadge, ShieldCheck } from "./icons";

function formatDate(iso: string | null): string {
  if (!iso) return "No expiry";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * The signature CredMalawi "Digital Credential" badge card. Used as the
 * centrepiece of the public verification page. Renders a revoked treatment
 * when the credential status is "revoked".
 */
export default function BadgeCard({ credential }: { credential: Credential }) {
  const provider = getProvider(credential.providerId);
  const revoked = credential.status === "revoked";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border shadow-xl ${
        revoked ? "border-ictam-red/40" : "border-psc/30"
      }`}
    >
      {/* Header band */}
      <div className="bg-ink px-6 py-5 text-white sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-psc-light">
            <ShieldCheck className="h-4 w-4" />
            Issued under national authority
          </div>
          <span className="tag bg-white/10 text-psc-light">
            Open Badge {credential.openBadgeVersion} Compliant
          </span>
        </div>

        <div className="mt-5 flex items-start gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
              revoked ? "bg-ictam-red/20 text-ictam-red" : "bg-psc/20 text-psc-light"
            }`}
          >
            <CheckBadge className="h-9 w-9" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {credential.level} · {credential.category}
            </p>
            <h2 className="mt-0.5 text-2xl font-bold leading-tight sm:text-3xl">
              {credential.skill}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Awarded to{" "}
              <span className="font-semibold text-white">
                {credential.learnerName}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Verified / revoked status strip */}
      {revoked ? (
        <div className="flex items-center gap-2 bg-ictam-red px-6 py-3 text-sm font-semibold text-white sm:px-8">
          This credential has been REVOKED and is no longer valid.
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-verified px-6 py-3 text-sm font-semibold text-white sm:px-8">
          <CheckBadge className="h-5 w-5" />
          Verified — this is a genuine, currently valid credential.
        </div>
      )}

      {/* Body */}
      <div className="bg-white px-6 py-6 sm:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <Field label="Issuing Provider">
            {provider?.name ?? "Unknown"}
            <span className="block text-xs font-normal text-slate-500">
              {provider?.city}, {provider?.region} Region
            </span>
          </Field>
          <Field label="Accrediting Authority">
            ICTAM
            <span className="block text-xs font-normal text-slate-500">
              ICT Association of Malawi
            </span>
          </Field>
          <Field label="Credential Code">{credential.code}</Field>
          <Field label="Credential ID">{credential.id}</Field>
          <Field label="Issue Date">{formatDate(credential.issueDate)}</Field>
          <Field label="Expiry Date">{formatDate(credential.expiryDate)}</Field>
        </dl>

        {revoked && credential.revocationReason && (
          <div className="mt-6 rounded-lg border border-ictam-red/30 bg-red-50 p-4 text-sm text-ictam-red">
            <p className="font-semibold">Reason for revocation</p>
            <p className="mt-1 text-red-800/90">{credential.revocationReason}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Assessment Criteria
          </p>
          <ul className="mt-2 space-y-2">
            {credential.criteria.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckBadge
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    revoked ? "text-slate-400" : "text-verified"
                  }`}
                />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs text-slate-500 sm:px-8">
        Operated by Phantom Stack Collective (PSC) under the institutional
        authority of ICTAM.
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}
