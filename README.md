# CredMalawi — Visual Prototype

A clickable demo of **CredMalawi**, a national digital credentialing platform
for Malawi's ICT sector. Accredited training providers issue verifiable digital
badges to learners; anyone can verify a credential publicly by URL or QR code,
with no login.

> **This is a prototype for stakeholder review — not production.** All data is
> mocked/seed data. There is no authentication, no real payments, and no real
> Open Badge cryptographic signing.

Operated (conceptually) by **Phantom Stack Collective (PSC)** under the
institutional authority of **ICTAM** (ICT Association of Malawi). All prices are
in Malawian Kwacha (MWK).

## Getting started

```bash
npm install && npm run dev
```

Then open **http://localhost:3000**.

## Tech stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** for styling
- **qrcode.react** for verification QR codes
- **recharts** for the ICTAM analytics charts
- All data comes from local seed files in [`lib/seed.ts`](lib/seed.ts) — no
  database, no API keys.

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Landing page: hero, 3-step "How It Works", PSC/ICTAM footer |
| `/verify/[credentialId]` | **Centrepiece** — public credential verification with the badge card + QR |
| `/registry` | Searchable/filterable registry of accredited providers |
| `/registry/[providerId]` | Provider profile + the credentials they've issued |
| `/dashboard` | Mocked provider workspace (templates, issue, history, revoke) |
| `/wallet/[learnerId]` | Public learner wallet of earned badges |
| `/ictam` | Private-feeling ICTAM analytics dashboard with charts |
| `/pricing` | MWK subscription tiers |

## Sample paths to visit

The seed data is wired together so the flows connect end to end:

- **Valid credential:** [`/verify/MW-CRED-1001`](http://localhost:3000/verify/MW-CRED-1001)
  — Network Security Fundamentals, awarded to Tadala Phiri by Blantyre Institute
  of Technology. This same credential appears in the provider profile and the
  learner wallet below.
- **Revoked credential:** [`/verify/MW-CRED-1007`](http://localhost:3000/verify/MW-CRED-1007)
  — demonstrates the revoked state.
- **Unknown credential:** [`/verify/MW-CRED-9999`](http://localhost:3000/verify/MW-CRED-9999)
  — demonstrates the "credential not found" state.
- **Learner wallet:** [`/wallet/learner-tadala-phiri`](http://localhost:3000/wallet/learner-tadala-phiri)
- **Provider profile:** [`/registry/prov-blantyre-tech`](http://localhost:3000/registry/prov-blantyre-tech)
- **ICTAM analytics:** [`/ictam`](http://localhost:3000/ictam)
- **Provider dashboard:** [`/dashboard`](http://localhost:3000/dashboard)

## Seed data

Defined in [`lib/seed.ts`](lib/seed.ts):

- **5 training providers** across Blantyre, Lilongwe, Mzuzu, and Zomba.
- **8 issued credentials** across Network Security Fundamentals, Cloud
  Engineering, Cybersecurity Essentials, and Data Analytics — including one
  **revoked** credential (`MW-CRED-1007`).
- **3 learners** with public wallets.

## What's mocked vs. what a real backend would need

| Area | In this prototype | Production would need |
| --- | --- | --- |
| Data | Static seed files (`lib/seed.ts`) | A database (credentials, providers, learners) |
| Auth | None — the dashboard is an open mocked session | Provider login, roles, ICTAM admin access |
| Credential signing | Metadata fields only, no signing | Real Open Badges 2.0/3.0 issuance with cryptographic signatures and a hosted verification endpoint |
| Issuance/revocation | In-memory state in the dashboard (resets on refresh) | Persisted writes + audit trail |
| Verification | Looks up the local seed array | Verifies signed assertions against the issuer's keys |
| Payments | Pricing cards are display-only | Real billing/subscriptions in MWK |
| Sharing | "Share to LinkedIn" / "Copy link" are mocked | Real social share + OG metadata |
| Analytics | Computed from seed data | Aggregated from the live registry |

## Project structure

```
app/
  page.tsx                     # Landing
  verify/[credentialId]/       # Public verification (centrepiece)
  registry/                    # Provider registry + [providerId] profile
  dashboard/                   # Mocked provider workspace
  wallet/[learnerId]/          # Public learner wallet
  ictam/                       # ICTAM analytics dashboard
  pricing/                     # MWK pricing tiers
components/                    # BadgeCard, nav/footer, QR panel, icons
lib/
  seed.ts                      # All seed data
  data.ts                      # Lookup helpers
  types.ts                     # Domain types
```
