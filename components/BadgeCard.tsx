"use client";

import type { Credential } from "@/lib/types";
import { useProvider } from "@/lib/store";
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
 * The signature CredMalawi "Digital Credential" badge card. Light surface with
 * a premium navy header. ICTAM red carries national authority; PSC gold carries
 * the Open Badge / platform shine; verified green is reserved for the status.
 */
export default function BadgeCard({ credential }: { credential: Credential }) {
  const provider = useProvider(credential.providerId);
  const revoked = credential.status === "revoked";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-white shadow-soft ${
        revoked ? "border-ictam/30" : "border-slate-200"
      }`}
    >
      {/* Header band — navy */}
      <div className="relative overflow-hidden bg-navy px-6 py-6 text-white sm:px-8">
        {!revoked && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-psc to-transparent" />
        )}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ictam/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-psc/10 blur-2xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-psc-light">
            <ShieldCheck className="h-4 w-4" />
            Issued under national authority
          </div>
          <span className="tag border border-psc/30 bg-psc/15 text-psc-light">
            Open Badge {credential.openBadgeVersion} Compliant
          </span>
        </div>

        <div className="relative mt-6 flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 ${
              revoked
                ? "bg-ictam/20 text-ictam-light ring-ictam/40"
                : "bg-gradient-to-br from-psc/25 to-ictam/20 text-psc-light ring-psc/30"
            }`}
          >
            <CheckBadge className="h-10 w-10" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {credential.level} · {credential.category}
            </p>
            <h2 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">
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
        <div className="flex items-center gap-2 bg-ictam px-6 py-3 text-sm font-semibold text-white sm:px-8">
          This credential has been REVOKED and is no longer valid.
        </div>
      ) : (
        <div className="flex items-center gap-2 border-y border-verified/20 bg-verified-tint px-6 py-3 text-sm font-semibold text-verified-dark sm:px-8">
          <CheckBadge className="h-5 w-5 text-verified" />
          Verified — this is a genuine, currently valid credential.
        </div>
      )}

      {/* Body */}
      <div className="px-6 py-6 sm:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <Field label="Issuing Provider">
            {provider?.name ?? "Unknown"}
            <span className="block text-xs font-normal text-slate-400">
              {provider?.city}, {provider?.region} Region
            </span>
          </Field>
          <Field label="Accrediting Authority">
            <span className="text-ictam">ICTAM</span>
            <span className="block text-xs font-normal text-slate-400">
              ICT Association of Malawi
            </span>
          </Field>
          <Field label="Credential Code">{credential.code}</Field>
          <Field label="Credential ID">{credential.id}</Field>
          <Field label="Issue Date">{formatDate(credential.issueDate)}</Field>
          <Field label="Expiry Date">{formatDate(credential.expiryDate)}</Field>
        </dl>

        {revoked && credential.revocationReason && (
          <div className="mt-6 rounded-xl border border-ictam/30 bg-ictam-tint p-4 text-sm">
            <p className="font-semibold text-ictam-dark">Reason for revocation</p>
            <p className="mt-1 text-slate-600">{credential.revocationReason}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="eyebrow">Assessment Criteria</p>
          <ul className="mt-3 space-y-2">
            {credential.criteria.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckBadge
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    revoked ? "text-slate-300" : "text-verified"
                  }`}
                />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs text-slate-400 sm:px-8">
        Operated by{" "}
        <span className="font-semibold text-psc-dark">Phantom Stack Collective</span>{" "}
        under the institutional authority of{" "}
        <span className="font-semibold text-ictam">ICTAM</span>.
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
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{children}</dd>
    </div>
  );
}
