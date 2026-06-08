import { pricingTiers } from "@/lib/seed";
import { CheckBadge } from "@/components/icons";

export const metadata = {
  title: "Pricing — CredMalawi",
};

export default function PricingPage() {
  return (
    <div>
      <section className="bg-ink text-white">
        <div className="container-page py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-psc-light">
            Subscription tiers
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Simple, transparent pricing in Kwacha
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Annual subscriptions for ICTAM-accredited training providers. Every
            tier includes public verification pages and QR-code sharing. Prices
            shown in Malawian Kwacha (MWK).
          </p>
        </div>
      </section>

      <div className="container-page py-12">
        <div className="grid gap-6 lg:grid-cols-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 ${
                tier.highlighted
                  ? "border-psc shadow-xl ring-1 ring-psc"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-psc px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-bold text-ink">
                  {tier.priceLabel}
                </span>
                <span className="ml-1 text-sm text-slate-500">
                  / {tier.priceNote}
                </span>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-ink">
                {tier.badgeLimit}
              </p>
              {tier.extraBadge && (
                <p className="mt-2 text-xs font-medium text-psc-dark">
                  {tier.extraBadge}
                </p>
              )}

              <ul className="mt-5 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckBadge className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-6 w-full ${
                  tier.highlighted ? "btn-gold" : "btn-outline"
                }`}
              >
                {tier.name === "Enterprise" ? "Contact PSC" : "Choose " + tier.name}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          Prototype pricing for stakeholder review. No real payment is processed.
        </p>
      </div>
    </div>
  );
}
