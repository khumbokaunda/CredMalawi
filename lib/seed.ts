import type {
  Provider,
  Learner,
  Credential,
  PricingTier,
  DemoAccount,
} from "./types";

// ---------------------------------------------------------------------------
// Training Providers (ICTAM-accredited)
// ---------------------------------------------------------------------------

export const providers: Provider[] = [
  {
    id: "prov-blantyre-tech",
    name: "Blantyre Institute of Technology",
    shortName: "BIT",
    city: "Blantyre",
    region: "Southern",
    accreditedSince: "2021-03-14",
    status: "Accredited",
    about:
      "A leading polytechnic in the commercial capital, BIT runs hands-on ICT bootcamps and diploma tracks focused on networking and cybersecurity for the Southern Region workforce.",
    website: "https://bit.ac.mw",
    contactEmail: "registrar@bit.ac.mw",
    programmes: [
      "Network Security Fundamentals",
      "Cybersecurity Essentials",
      "Data Analytics",
    ],
    tier: "Professional",
  },
  {
    id: "prov-lilongwe-digital",
    name: "Lilongwe Digital Skills Academy",
    shortName: "LDSA",
    city: "Lilongwe",
    region: "Central",
    accreditedSince: "2020-09-01",
    status: "Accredited",
    about:
      "Based in the capital, LDSA partners with public-sector agencies to upskill civil servants and young graduates in cloud and data disciplines.",
    website: "https://ldsa.mw",
    contactEmail: "info@ldsa.mw",
    programmes: [
      "Cloud Engineering",
      "Data Analytics",
      "Software Development Foundations",
    ],
    tier: "Enterprise",
  },
  {
    id: "prov-mzuzu-ict",
    name: "Mzuzu ICT Hub",
    shortName: "MIH",
    city: "Mzuzu",
    region: "Northern",
    accreditedSince: "2022-06-20",
    status: "Accredited",
    about:
      "The Northern Region's innovation hub, MIH delivers community-driven training and entrepreneurship support alongside its accredited credentialing programmes.",
    website: "https://mzuzuhub.mw",
    contactEmail: "hello@mzuzuhub.mw",
    programmes: ["Cybersecurity Essentials", "Software Development Foundations"],
    tier: "Standard",
  },
  {
    id: "prov-zomba-academy",
    name: "Zomba Cyber Academy",
    shortName: "ZCA",
    city: "Zomba",
    region: "Southern",
    accreditedSince: "2023-01-30",
    status: "Provisional",
    about:
      "A specialist security school in the old capital, ZCA focuses exclusively on cybersecurity and digital forensics training for the public and private sectors.",
    website: "https://zombacyber.mw",
    contactEmail: "admissions@zombacyber.mw",
    programmes: ["Cybersecurity Essentials", "Network Security Fundamentals"],
    tier: "Starter",
  },
  {
    id: "prov-malawi-cloud",
    name: "Malawi Cloud Institute",
    shortName: "MCI",
    city: "Lilongwe",
    region: "Central",
    accreditedSince: "2021-11-05",
    status: "Accredited",
    about:
      "A cloud-first training institute working with regional employers to build Malawi's pipeline of certified cloud and DevOps engineers.",
    website: "https://malawicloud.mw",
    contactEmail: "training@malawicloud.mw",
    programmes: ["Cloud Engineering", "Data Analytics"],
    tier: "Professional",
  },
];

// ---------------------------------------------------------------------------
// Learners (public wallets)
// ---------------------------------------------------------------------------

export const learners: Learner[] = [
  {
    id: "learner-peter-chimbuto",
    fullName: "Peter Chimbuto",
    city: "Blantyre",
    region: "Southern",
    headline: "Network & Security Engineer",
    credentialIds: ["MW-CRED-1001", "MW-CRED-1006"],
  },
  {
    id: "learner-chisomo-banda",
    fullName: "Chisomo Banda",
    city: "Lilongwe",
    region: "Central",
    headline: "Cloud & Data Practitioner",
    credentialIds: ["MW-CRED-1002", "MW-CRED-1004"],
  },
  {
    id: "learner-mphatso-gondwe",
    fullName: "Mphatso Gondwe",
    city: "Mzuzu",
    region: "Northern",
    headline: "Cybersecurity Analyst",
    credentialIds: ["MW-CRED-1003", "MW-CRED-1008"],
  },
];

// ---------------------------------------------------------------------------
// Issued Credentials
//   - MW-CRED-1001 is wired into BIT (registry) and Peter Chimbuto's wallet for the
//     full click-through demo.
//   - MW-CRED-1007 is REVOKED to demonstrate that state.
// ---------------------------------------------------------------------------

export const credentials: Credential[] = [
  {
    id: "MW-CRED-1001",
    code: "NSF-2024-0481",
    skill: "Network Security Fundamentals",
    category: "Networking",
    learnerId: "learner-peter-chimbuto",
    learnerName: "Peter Chimbuto",
    providerId: "prov-blantyre-tech",
    issueDate: "2024-05-18",
    expiryDate: "2027-05-18",
    status: "valid",
    region: "Southern",
    level: "Associate",
    openBadgeVersion: "3.0",
    criteria: [
      "Configured and hardened enterprise network devices",
      "Implemented firewall and VPN policies in a lab environment",
      "Passed a proctored practical assessment with score ≥ 80%",
    ],
  },
  {
    id: "MW-CRED-1002",
    code: "CLD-2024-0192",
    skill: "Cloud Engineering",
    category: "Cloud",
    learnerId: "learner-chisomo-banda",
    learnerName: "Chisomo Banda",
    providerId: "prov-lilongwe-digital",
    issueDate: "2024-07-02",
    expiryDate: "2027-07-02",
    status: "valid",
    region: "Central",
    level: "Professional",
    openBadgeVersion: "3.0",
    criteria: [
      "Deployed a multi-tier application to a public cloud provider",
      "Implemented infrastructure-as-code and CI/CD pipelines",
      "Demonstrated cost-optimisation and monitoring practices",
    ],
  },
  {
    id: "MW-CRED-1003",
    code: "CSE-2024-0337",
    skill: "Cybersecurity Essentials",
    category: "Security",
    learnerId: "learner-mphatso-gondwe",
    learnerName: "Mphatso Gondwe",
    providerId: "prov-mzuzu-ict",
    issueDate: "2024-03-11",
    expiryDate: "2027-03-11",
    status: "valid",
    region: "Northern",
    level: "Foundation",
    openBadgeVersion: "2.0",
    criteria: [
      "Identified common threats and attack vectors",
      "Applied security hygiene and incident-response basics",
      "Completed a capture-the-flag style assessment",
    ],
  },
  {
    id: "MW-CRED-1004",
    code: "DAT-2024-0590",
    skill: "Data Analytics",
    category: "Data",
    learnerId: "learner-chisomo-banda",
    learnerName: "Chisomo Banda",
    providerId: "prov-malawi-cloud",
    issueDate: "2024-09-23",
    expiryDate: null,
    status: "valid",
    region: "Central",
    level: "Associate",
    openBadgeVersion: "3.0",
    criteria: [
      "Cleaned and modelled a real-world dataset",
      "Built dashboards communicating actionable insights",
      "Presented findings to a review panel",
    ],
  },
  {
    id: "MW-CRED-1005",
    code: "CSE-2024-0712",
    skill: "Cybersecurity Essentials",
    category: "Security",
    learnerId: "learner-peter-chimbuto",
    learnerName: "Peter Chimbuto",
    providerId: "prov-zomba-academy",
    issueDate: "2024-11-04",
    expiryDate: "2027-11-04",
    status: "valid",
    region: "Southern",
    level: "Foundation",
    openBadgeVersion: "2.0",
    criteria: [
      "Completed foundational security coursework",
      "Demonstrated safe operational practices",
    ],
  },
  {
    id: "MW-CRED-1006",
    code: "DAT-2024-0805",
    skill: "Data Analytics",
    category: "Data",
    learnerId: "learner-peter-chimbuto",
    learnerName: "Peter Chimbuto",
    providerId: "prov-blantyre-tech",
    issueDate: "2025-01-15",
    expiryDate: null,
    status: "valid",
    region: "Southern",
    level: "Associate",
    openBadgeVersion: "3.0",
    criteria: [
      "Applied statistical methods to business data",
      "Automated a reporting workflow",
    ],
  },
  {
    id: "MW-CRED-1007",
    code: "CLD-2023-0044",
    skill: "Cloud Engineering",
    category: "Cloud",
    learnerId: "learner-mphatso-gondwe",
    learnerName: "Mphatso Gondwe",
    providerId: "prov-malawi-cloud",
    issueDate: "2023-08-19",
    expiryDate: "2026-08-19",
    status: "revoked",
    revocationReason:
      "Issued in error. The learner did not complete the required practical assessment. Revoked by the issuing provider on 2024-02-10.",
    region: "Central",
    level: "Professional",
    openBadgeVersion: "3.0",
    criteria: [
      "Deployed cloud infrastructure",
      "Configured automated pipelines",
    ],
  },
  {
    id: "MW-CRED-1008",
    code: "NSF-2025-0119",
    skill: "Network Security Fundamentals",
    category: "Networking",
    learnerId: "learner-mphatso-gondwe",
    learnerName: "Mphatso Gondwe",
    providerId: "prov-zomba-academy",
    issueDate: "2025-02-27",
    expiryDate: "2028-02-27",
    status: "valid",
    region: "Northern",
    level: "Associate",
    openBadgeVersion: "3.0",
    criteria: [
      "Segmented and secured a campus network",
      "Conducted a vulnerability assessment",
      "Passed the practical exam",
    ],
  },
];

// ---------------------------------------------------------------------------
// Pricing tiers (MWK)
// ---------------------------------------------------------------------------

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    priceLabel: "MWK 150,000",
    priceNote: "per year",
    badgeLimit: "Up to 100 badges / year",
    extraBadge: null,
    features: [
      "Single issuing account",
      "Public verification pages",
      "QR-code credential sharing",
      "Standard badge templates",
    ],
  },
  {
    name: "Standard",
    priceLabel: "MWK 350,000",
    priceNote: "per year",
    badgeLimit: "Up to 500 badges / year",
    extraBadge: "+ MWK 500 per extra badge",
    features: [
      "Up to 5 issuing accounts",
      "Custom badge templates",
      "Issuance history & exports",
      "Email support",
    ],
    highlighted: true,
  },
  {
    name: "Professional",
    priceLabel: "MWK 700,000",
    priceNote: "per year",
    badgeLimit: "Up to 2,000 badges / year",
    extraBadge: "+ MWK 300 per extra badge",
    features: [
      "Unlimited issuing accounts",
      "Bulk issuance & API access",
      "Branded verification pages",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    priceLabel: "Negotiated",
    priceNote: "custom agreement",
    badgeLimit: "Unlimited badges",
    extraBadge: null,
    features: [
      "National & multi-campus rollout",
      "Dedicated account management",
      "Custom integrations & SSO",
      "SLA-backed support",
    ],
  },
];

// ---------------------------------------------------------------------------
// Accreditation applicants: institutions in the ICTAM "Pending" queue.
// Approving one (admin portal) flips it to Accredited and surfaces it in the
// public registry. These start hidden from the public registry.
// ---------------------------------------------------------------------------

export const accreditationApplicants: Provider[] = [
  {
    id: "prov-kasungu-tech",
    name: "Kasungu Technical College",
    shortName: "KTC",
    city: "Kasungu",
    region: "Central",
    accreditedSince: "",
    status: "Pending",
    about:
      "A growing technical college serving central Malawi, applying to credential foundational ICT and data programmes.",
    website: "https://ktc.mw",
    contactEmail: "principal@ktc.mw",
    programmes: ["Data Analytics", "Software Development Foundations"],
    tier: "Starter",
  },
  {
    id: "prov-mangochi-digital",
    name: "Mangochi Digital Centre",
    shortName: "MDC",
    city: "Mangochi",
    region: "Southern",
    accreditedSince: "",
    status: "Pending",
    about:
      "A lakeshore community digital centre seeking accreditation to issue cybersecurity and networking credentials.",
    website: "https://mangochidigital.mw",
    contactEmail: "info@mangochidigital.mw",
    programmes: ["Cybersecurity Essentials", "Network Security Fundamentals"],
    tier: "Standard",
  },
  {
    id: "prov-karonga-ict",
    name: "Karonga ICT Academy",
    shortName: "KIA",
    city: "Karonga",
    region: "Northern",
    accreditedSince: "",
    status: "Pending",
    about:
      "A northern-frontier academy applying to deliver accredited cloud and software development training.",
    website: "https://karongaict.mw",
    contactEmail: "admissions@karongaict.mw",
    programmes: ["Cloud Engineering", "Software Development Foundations"],
    tier: "Starter",
  },
];

// ---------------------------------------------------------------------------
// Mocked demo accounts (any password is accepted in the demo).
// ---------------------------------------------------------------------------

export const demoAccounts: DemoAccount[] = [
  {
    email: "institution@demo.mw",
    role: "institution",
    name: "Blantyre Institute of Technology",
    refId: "prov-blantyre-tech",
  },
  {
    email: "student@demo.mw",
    role: "student",
    name: "Peter Chimbuto",
    refId: "learner-peter-chimbuto",
  },
  {
    email: "admin@ictam.org.mw",
    role: "admin",
    name: "ICTAM Administrator",
  },
];
