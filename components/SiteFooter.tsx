import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-base-600/60 bg-base-900/60 text-ink-muted backdrop-blur-sm">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-base-700 text-sm font-bold ring-1 ring-base-600">
              <span className="text-gradient-gold">C</span>
              <span className="text-ictam-light">M</span>
            </span>
            <span className="text-lg font-bold tracking-tight text-ink">
              Cred<span className="text-psc">Malawi</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-faint">
            Malawi&apos;s national digital credentialing platform for the ICT
            sector. Accredited providers issue verifiable digital badges that
            anyone can confirm — publicly, instantly, and without a login.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="tag border border-ictam/30 bg-ictam/10 text-ictam-light">
              ICTAM authority
            </span>
            <span className="tag border border-psc/30 bg-psc/10 text-psc-light">
              PSC platform
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Platform</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-faint">
            <li><Link className="transition hover:text-psc-light" href="/registry">Provider Registry</Link></li>
            <li><Link className="transition hover:text-ictam-light" href="/verify/MW-CRED-1001">Verify a Credential</Link></li>
            <li><Link className="transition hover:text-psc-light" href="/pricing">Pricing</Link></li>
            <li><Link className="transition hover:text-ictam-light" href="/ictam">ICTAM Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Governance</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-faint">
            <li>Operated by Phantom Stack Collective (PSC)</li>
            <li>Accrediting authority: ICTAM</li>
            <li>Open Badges 2.0 / 3.0 aligned</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-base-600/60">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-faint sm:flex-row">
          <p>
            © {new Date().getFullYear()} CredMalawi · Operated by{" "}
            <span className="font-semibold text-psc-light">Phantom Stack Collective</span>
          </p>
          <p>
            Under the institutional authority of{" "}
            <span className="font-semibold text-ictam-light">ICTAM</span> — ICT
            Association of Malawi
          </p>
        </div>
      </div>
    </footer>
  );
}
