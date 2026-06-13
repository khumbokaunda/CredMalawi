import { pricingTiers } from "@/lib/seed";
import { CheckBadge } from "@/components/icons";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export const metadata = {
  title: "Pricing — CredMalawi",
};

export default function PricingPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-navy text-white">
        <div className="container-page py-16 text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-psc-light">
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
          </Reveal>
        </div>
      </section>

      <div className="container-page py-12">
        <Stagger className="grid gap-6 lg:grid-cols-4">
          {pricingTiers.map((tier) => {
            const enterprise = tier.name === "Enterprise";
            const popular = tier.highlighted;
            return (
              <StaggerItem key={tier.name}>
                <div
                  className={`hover-lift relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-soft ${
                    enterprise
                      ? "border-psc/50 ring-1 ring-psc/40"
                      : popular
                      ? "border-ictam/50 ring-1 ring-ictam/30"
                      : "border-slate-200"
                  }`}
                >
                  {popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ictam px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}
                  {enterprise && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-psc px-3 py-1 text-xs font-semibold text-slate-900">
                      Premium
                    </span>
                  )}
                  <h3 className={`text-lg font-bold ${enterprise ? "text-psc-dark" : "text-slate-900"}`}>
                    {tier.name}
                  </h3>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-slate-900">{tier.priceLabel}</span>
                    <span className="ml-1 text-sm text-slate-400">/ {tier.priceNote}</span>
                  </div>
                  <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900">
                    {tier.badgeLimit}
                  </p>
                  {tier.extraBadge && (
                    <p className="mt-2 text-xs font-medium text-psc-dark">{tier.extraBadge}</p>
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
                      enterprise ? "btn-gold" : popular ? "btn-red" : "btn-outline"
                    }`}
                  >
                    {enterprise ? "Contact PSC" : "Choose " + tier.name}
                  </button>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <p className="mt-10 text-center text-xs text-slate-400">
          Prototype pricing for stakeholder review. No real payment is processed.
        </p>
      </div>
    </div>
  );
}
