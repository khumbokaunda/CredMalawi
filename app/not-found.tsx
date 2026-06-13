import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-psc-dark">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-500">
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
