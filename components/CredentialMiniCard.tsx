import Link from "next/link";
import type { Credential } from "@/lib/types";
import { getProviderName } from "@/lib/data";
import { CheckBadge, XCircle } from "./icons";

function formatDate(iso: string | null): string {
  if (!iso) return "No expiry";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Compact credential card used in learner wallets and provider profiles. */
export default function CredentialMiniCard({
  credential,
}: {
  credential: Credential;
}) {
  const revoked = credential.status === "revoked";

  return (
    <div
      className={`card hover-lift flex flex-col p-5 ${
        revoked ? "opacity-75 hover-glow-soft" : "hover-glow-gold"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="tag border border-base-600 bg-base-700/60 text-ink-muted">
          {credential.category} · {credential.level}
        </span>
        {revoked ? (
          <span className="tag border border-ictam/30 bg-ictam/10 text-ictam-light">
            <XCircle className="h-3.5 w-3.5" /> Revoked
          </span>
        ) : (
          <span className="tag border border-verified/30 bg-verified/10 text-verified-light">
            <CheckBadge className="h-3.5 w-3.5" /> Verified
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-tight text-ink">
        {credential.skill}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        {getProviderName(credential.providerId)}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-ink-faint">Issued</dt>
          <dd className="font-semibold text-ink-muted">
            {formatDate(credential.issueDate)}
          </dd>
        </div>
        <div>
          <dt className="text-ink-faint">Expires</dt>
          <dd className="font-semibold text-ink-muted">
            {formatDate(credential.expiryDate)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-base-600/60 pt-4">
        <span className="font-mono text-xs text-ink-faint">{credential.id}</span>
        <Link
          href={`/verify/${credential.id}`}
          className="text-sm font-semibold text-ictam-light hover:text-ictam"
        >
          View &amp; verify →
        </Link>
      </div>
    </div>
  );
}
