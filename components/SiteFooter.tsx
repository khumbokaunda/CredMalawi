import Link from "next/link";
import { BrandMark } from "./PublicHeader";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Cred<span className="text-psc-dark">Malawi</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">
            Malawi&apos;s national digital credentialing platform for the ICT
            sector. Accredited providers issue verifiable digital badges that
            anyone can confirm — publicly, instantly, and without a login.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="tag border border-ictam/20 bg-ictam-tint text-ictam-dark">
              ICTAM authority
            </span>
            <span className="tag border border-psc/30 bg-psc-tint text-psc-dark">
              PSC platform
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li><Link className="transition hover:text-psc-dark" href="/registry">Provider Registry</Link></li>
            <li><Link className="transition hover:text-ictam" href="/verify/MW-CRED-1001">Verify a Credential</Link></li>
            <li><Link className="transition hover:text-psc-dark" href="/pricing">Pricing</Link></li>
            <li><Link className="transition hover:text-brandblue" href="/login">Log in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Governance</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li>Operated by Phantom Stack Collective (PSC)</li>
            <li>Accrediting authority: ICTAM</li>
            <li>Open Badges 2.0 / 3.0 aligned</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} CredMalawi · Operated by{" "}
            <span className="font-semibold text-psc-dark">Phantom Stack Collective</span>
          </p>
          <p>
            Under the institutional authority of{" "}
            <span className="font-semibold text-ictam">ICTAM</span> — ICT
            Association of Malawi
          </p>
        </div>
      </div>
    </footer>
  );
}
