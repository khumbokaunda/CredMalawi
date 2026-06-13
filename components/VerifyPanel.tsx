"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

/**
 * Right-rail panel on the verification page: shows the QR code that encodes
 * the unique verification URL plus a copy-to-clipboard action.
 */
export default function VerifyPanel({
  credentialId,
}: {
  credentialId: string;
}) {
  const [url, setUrl] = useState(`/verify/${credentialId}`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/verify/${credentialId}`);
  }, [credentialId]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable; ignore for the demo */
    }
  }

  return (
    <div className="card p-6">
      <p className="text-sm font-semibold text-slate-900">Scan to verify</p>
      <p className="mt-1 text-xs text-slate-500">
        Anyone can scan this code to open the public verification page — no
        login required.
      </p>

      <div className="mt-4 flex justify-center rounded-2xl border border-slate-200 bg-white p-4">
        <QRCodeSVG value={url} size={176} fgColor="#0F1B33" bgColor="#ffffff" level="M" />
      </div>

      <div className="mt-4">
        <p className="eyebrow">Verification URL</p>
        <p className="mt-1 break-all rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
          {url}
        </p>
        <button onClick={copy} className="btn-outline mt-3 w-full">
          {copied ? "Copied!" : "Copy verification link"}
        </button>
      </div>
    </div>
  );
}
