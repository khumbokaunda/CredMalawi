"use client";

import { useState } from "react";

/** Mocked share actions for a wallet credential. */
export default function WalletActions({
  credentialId,
  skill,
  disabled = false,
}: {
  credentialId: string;
  skill: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/verify/${credentialId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore in sandbox
    }
  }

  if (disabled) {
    return (
      <p className="px-1 text-xs text-slate-400">
        Sharing disabled — this credential is no longer valid.
      </p>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={copyLink}
        className="btn-outline flex-1 px-3 py-2 text-xs"
        title="Copy the public verification link"
      >
        {copied ? "Link copied!" : "Copy verification link"}
      </button>
      <button
        onClick={() =>
          alert(
            `(Demo) This would share your "${skill}" badge to LinkedIn using the public verification URL.`
          )
        }
        className="btn px-3 py-2 text-xs bg-ictam-blue text-white hover:bg-ictam-blue/90"
        title="Mocked LinkedIn share"
      >
        Share to LinkedIn
      </button>
    </div>
  );
}
