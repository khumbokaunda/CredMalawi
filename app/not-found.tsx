import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-psc">404</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-3 text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist on CredMalawi.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-red">
          Back to home
        </Link>
        <Link href="/registry" className="btn-outline">
          Provider registry
        </Link>
      </div>
    </div>
  );
}
