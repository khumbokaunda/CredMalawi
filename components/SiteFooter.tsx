import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-ink text-slate-300">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-psc-light">
              CM
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Cred<span className="text-psc-light">Malawi</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            Malawi&apos;s national digital credentialing platform for the ICT
            sector. Accredited providers issue verifiable digital badges that
            anyone can confirm — publicly, instantly, and without a login.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Platform</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-psc-light" href="/registry">Provider Registry</Link></li>
            <li><Link className="hover:text-psc-light" href="/verify/MW-CRED-1001">Verify a Credential</Link></li>
            <li><Link className="hover:text-psc-light" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-psc-light" href="/ictam">ICTAM Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Governance</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>Operated by Phantom Stack Collective (PSC)</li>
            <li>Accrediting authority: ICTAM</li>
            <li>Open Badges 2.0 / 3.0 aligned</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} CredMalawi · Operated by{" "}
            <span className="font-semibold text-slate-300">Phantom Stack Collective</span>
          </p>
          <p>
            Under the institutional authority of{" "}
            <span className="font-semibold text-ictam-red">ICTAM</span> — ICT
            Association of Malawi
          </p>
        </div>
      </div>
    </footer>
  );
}
