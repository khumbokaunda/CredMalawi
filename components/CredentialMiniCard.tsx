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

/** Compact credential card used in wallets, profiles and portals. */
export default function CredentialMiniCard({
  credential,
}: {
  credential: Credential;
}) {
  const revoked = credential.status === "revoked";

  return (
    <div
      className={`card hover-lift flex h-full flex-col p-5 ${
        revoked ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="tag border border-slate-200 bg-slate-50 text-slate-500">
          {credential.category} · {credential.level}
        </span>
        {revoked ? (
          <span className="tag border border-ictam/20 bg-ictam-tint text-ictam-dark">
            <XCircle className="h-3.5 w-3.5" /> Revoked
          </span>
        ) : (
          <span className="tag border border-verified/20 bg-verified-tint text-verified-dark">
            <CheckBadge className="h-3.5 w-3.5 text-verified" /> Verified
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-tight text-slate-900">
        {credential.skill}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {getProviderName(credential.providerId)}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-slate-400">Issued</dt>
          <dd className="font-semibold text-slate-600">
            {formatDate(credential.issueDate)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">Expires</dt>
          <dd className="font-semibold text-slate-600">
            {formatDate(credential.expiryDate)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="font-mono text-xs text-slate-400">{credential.id}</span>
        <Link
          href={`/verify/${credential.id}`}
          className="text-sm font-semibold text-brandblue hover:underline"
        >
          View &amp; verify →
        </Link>
      </div>
    </div>
  );
}
