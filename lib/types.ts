// Domain types for the CredMalawi prototype.
// These mirror the conceptual shape of Open Badges 2.0/3.0 metadata
// without any real cryptographic signing.

export type Region = "Northern" | "Central" | "Southern";

export type ProviderStatus =
  | "Accredited"
  | "Provisional"
  | "Pending"
  | "Suspended";

/** Roles for the mocked, demo-friendly auth layer. */
export type Role = "institution" | "student" | "admin";

export interface DemoAccount {
  email: string;
  role: Role;
  name: string;
  /** Links the account to seed data: provider id (institution) or learner id (student). */
  refId?: string;
}

export interface Provider {
  id: string;
  name: string;
  shortName: string;
  city: string;
  region: Region;
  accreditedSince: string; // ISO date
  status: ProviderStatus;
  about: string;
  website: string;
  contactEmail: string;
  /** Programmes this provider is authorised by ICTAM to credential. */
  programmes: string[];
  tier: "Starter" | "Standard" | "Professional" | "Enterprise";
}

export interface Learner {
  id: string;
  fullName: string;
  city: string;
  region: Region;
  headline: string;
  /** Credential IDs earned by this learner. */
  credentialIds: string[];
}

export type CredentialStatus = "valid" | "revoked";

export interface Credential {
  id: string;
  /** Human-friendly credential code shown on the badge. */
  code: string;
  skill: string;
  category: string;
  learnerId: string;
  learnerName: string;
  providerId: string;
  issueDate: string; // ISO date
  expiryDate: string | null; // ISO date or null = does not expire
  status: CredentialStatus;
  revocationReason?: string;
  region: Region;
  /** Assessment criteria the learner met to earn the badge. */
  criteria: string[];
  openBadgeVersion: "2.0" | "3.0";
  level: "Foundation" | "Associate" | "Professional";
}

export interface PricingTier {
  name: string;
  priceLabel: string;
  priceNote: string;
  badgeLimit: string;
  extraBadge: string | null;
  features: string[];
  highlighted?: boolean;
}
