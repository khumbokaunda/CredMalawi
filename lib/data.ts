import { providers, learners, credentials } from "./seed";
import type { Credential, Learner, Provider } from "./types";

export function getProvider(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function getLearner(id: string): Learner | undefined {
  return learners.find((l) => l.id === id);
}

export function getCredential(id: string): Credential | undefined {
  // Case-insensitive match so shared/typed IDs still resolve.
  return credentials.find(
    (c) => c.id.toLowerCase() === id.toLowerCase()
  );
}

export function getCredentialsForLearner(learnerId: string): Credential[] {
  return credentials.filter((c) => c.learnerId === learnerId);
}

export function getCredentialsForProvider(providerId: string): Credential[] {
  return credentials.filter((c) => c.providerId === providerId);
}

export function getProviderName(id: string): string {
  return getProvider(id)?.name ?? "Unknown Provider";
}

/**
 * Base URL used when rendering absolute verification links / QR codes.
 * In the browser we use the live origin; on the server we fall back to a
 * sensible default for the demo.
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export { providers, learners, credentials };
