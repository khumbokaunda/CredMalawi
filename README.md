# CredMalawi — Visual Prototype

A clickable demo of **CredMalawi**, a national digital credentialing platform
for Malawi's ICT sector. Accredited training providers issue verifiable digital
badges to learners; anyone can verify a credential publicly by URL or QR code,
with no login.

> **This is a prototype for stakeholder review — not production.** All data is
> mocked/seed data. Authentication is mocked (no real backend), there are no
> real payments, and no real Open Badge cryptographic signing.

Operated (conceptually) by **Phantom Stack Collective (PSC)** under the
institutional authority of **ICTAM** (ICT Association of Malawi). All prices are
in Malawian Kwacha (MWK).

## Getting started

```bash
npm install && npm run dev
```

Then open **http://localhost:3000**.

## Demo accounts & quick login

The `/login` page has a **"Quick demo login"** panel — three one-click buttons to
jump straight into a role (ideal for live presenting). You can also type a seeded
email; **any password is accepted**. Use the **account menu in the top bar** to
switch roles mid-demo without logging out.

| Email | Role | Mapped to | Lands on |
| --- | --- | --- | --- |
| `institution@demo.mw` | Institution | Blantyre Institute of Technology | `/institution/dashboard` |
| `student@demo.mw` | Student | Tadala Phiri (owns the seeded credentials) | `/student/credentials` |
| `admin@ictam.org.mw` | ICTAM Admin | ICTAM Administrator | `/admin/overview` |

## The three portals

All logged-in areas share a **collapsible dark sidebar + top bar** app shell on a
light content canvas. The sidebar collapses to icons (desktop) and becomes an
off-canvas drawer (mobile).

**Institution portal** (accent: gold) — `/institution/...`
`dashboard` (stat cards + sparklines + recent activity), `issue` (animated
multi-step modal with validation), `templates`, `history`, `revocations`
(revoking updates the public `/verify` page live), `accreditation`.

**Student portal** (accent: green/gold) — `/student/...`
`credentials` (wallet with copy-link / share-to-LinkedIn), `public` (shareable
read-only profile), `verify` (embedded verifier), `profile` (editable mock).

**Administrator portal** (accent: ICTAM red) — `/admin/...`
`overview` (platform-wide recharts analytics), `institutions` (suspend /
reinstate), `requests` (approve / reject accreditation — approving publishes the
institution to the public registry), `registry` (toggle public visibility),
`credentials` (searchable platform-wide list), `settings` (incl. reset demo).

## Public pages (no sidebar, verification needs no login)

| Route | What it shows |
| --- | --- |
| `/` | Landing: navy hero, count-up stats, 3-step "How It Works" |
| `/login` | Mocked login + quick role buttons |
| `/verify/[credentialId]` | **Centrepiece** — verification with the "scanning → Verified" reveal, badge card + QR |
| `/registry` | Searchable/filterable registry of accredited providers |
| `/registry/[providerId]` | Provider profile + the credentials they've issued |
| `/wallet/[learnerId]` | Public, shareable learner profile |
| `/pricing` | MWK subscription tiers |

## Sample paths to visit

The seed data is wired so the flows connect end to end (`MW-CRED-1001` appears in
the student wallet, the institution's issuance history, the public registry
profile, and its own verification page):

- **Valid credential:** `/verify/MW-CRED-1001` — Network Security Fundamentals,
  Tadala Phiri, Blantyre Institute of Technology.
- **Revoked credential:** `/verify/MW-CRED-1007` — revoked state.
- **Unknown credential:** `/verify/MW-CRED-9999` — "credential not found" state.
- **Learner profile:** `/wallet/learner-tadala-phiri`
- **Provider profile:** `/registry/prov-blantyre-tech`
- **Portals:** `/institution/dashboard`, `/student/credentials`, `/admin/overview`

### Cross-surface demo flows

- **Revoke → verify:** Institution → *Revocations* → revoke `MW-CRED-1001`, then
  open `/verify/MW-CRED-1001` — it now shows the revoked state.
- **Approve → registry:** Admin → *Accreditation Requests* → approve an applicant
  (e.g. Kasungu Technical College); it then appears in the public `/registry`.

State persists in `localStorage` for the session. Admin → *Settings → Reset demo
data* returns everything to the seeded state.

## Theme & motion

- **Light content** (soft-grey canvas, white surfaces, slate text) with a
  **dark navy sidebar** and navy public hero panels.
- Accents with clear jobs: **PSC gold** = brand/platform, **ICTAM red** =
  authority/admin, supporting **blue** for links, **green** for verified.
- **framer-motion**: staggered page reveals, count-up stats, card hover-lift,
  animated sidebar collapse, route transitions, and the signature
  "scanning → Verified" reveal on the verification page.

## Tech stack

- **Next.js (App Router) + TypeScript**, **Tailwind CSS**
- **qrcode.react** (QR codes), **recharts** (analytics + sparklines),
  **framer-motion** (animation)
- Mocked auth + a `localStorage`-backed data store (React context) — no database,
  no API keys.

## What's mocked vs. what a real backend would need

| Area | In this prototype | Production would need |
| --- | --- | --- |
| Data | Seed files + a `localStorage` store (`lib/store.tsx`) | A database (credentials, providers, learners) |
| Auth | Mocked role-based context, any password (`lib/auth.tsx`) | Real auth, sessions, roles, SSO |
| Credential signing | Metadata fields only, no signing | Real Open Badges 2.0/3.0 with cryptographic signatures + hosted verification |
| Issuance / revocation / accreditation | Persisted in the browser for the demo | Server writes + audit trail |
| Verification | Looks up the local store | Verifies signed assertions against issuer keys |
| Payments | Pricing cards are display-only | Real billing/subscriptions in MWK |
| Sharing | "Share to LinkedIn" / "Copy link" mocked | Real social share + OG metadata |
| Analytics | Computed from seed/store data | Aggregated from the live registry |

## Project structure

```
app/
  layout.tsx                   # Auth + Data providers
  (public)/                    # Public area — own header/footer, route fade
    page.tsx                   #   Landing
    login/                     #   Mocked login + quick role buttons
    verify/[credentialId]/     #   Public verification (centrepiece)
    registry/                  #   Registry + [providerId] profile
    wallet/[learnerId]/        #   Public learner profile
    pricing/
  (portal)/                    # Logged-in area — shared app shell
    layout.tsx                 #   AppShell (sidebar + topbar + guards)
    institution/[[...section]]/
    student/[[...section]]/
    admin/[[...section]]/
components/
  app/                         # AppShell, Sidebar, Topbar, nav config
  portal/                      # Institution / Student / Admin portals + UI
  BadgeCard, VerifyReveal, IssueModal, IctamCharts, Sparkline, motion/ …
lib/
  seed.ts                      # All seed data + demo accounts + applicants
  store.tsx                    # localStorage-backed data store (context)
  auth.tsx                     # Mocked role-based auth (context)
  data.ts / types.ts / analytics.ts
```
