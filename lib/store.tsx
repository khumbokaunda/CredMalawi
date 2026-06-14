"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Credential, Provider, ProviderStatus } from "./types";
import {
  credentials as seedCredentials,
  providers as seedProviders,
  accreditationApplicants,
} from "./seed";

const STORAGE_KEY = "credmalawi:data:v2";

// Full provider set = accredited/provisional + the pending applicant queue.
const initialProviders: Provider[] = [
  ...seedProviders,
  ...accreditationApplicants,
];

interface Persisted {
  credentials: Credential[];
  providers: Provider[];
}

interface DataContextValue {
  credentials: Credential[];
  providers: Provider[];
  /** Providers visible in the public registry. */
  publicProviders: Provider[];
  /** Pending accreditation requests. */
  pendingProviders: Provider[];
  issueCredential: (c: Credential) => void;
  setCredentialStatus: (
    id: string,
    status: Credential["status"],
    reason?: string
  ) => void;
  setProviderStatus: (id: string, status: ProviderStatus) => void;
  approveApplicant: (id: string) => void;
  rejectApplicant: (id: string) => void;
  resetDemo: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState<Credential[]>(seedCredentials);
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  // Guard so we never persist seed over real data before hydration completes.
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (keeps SSR markup deterministic).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Persisted;
        if (parsed.credentials) setCredentials(parsed.credentials);
        if (parsed.providers) setProviders(parsed.providers);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on change, but only after we've loaded any existing data.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ credentials, providers })
      );
    } catch {
      /* ignore */
    }
  }, [hydrated, credentials, providers]);

  const issueCredential = useCallback((c: Credential) => {
    setCredentials((prev) => [c, ...prev]);
  }, []);

  const setCredentialStatus = useCallback(
    (id: string, status: Credential["status"], reason?: string) => {
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status,
                revocationReason: status === "revoked" ? reason : undefined,
              }
            : c
        )
      );
    },
    []
  );

  const setProviderStatus = useCallback((id: string, status: ProviderStatus) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }, []);

  const approveApplicant = useCallback((id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "Accredited", accreditedSince: today } : p
      )
    );
  }, []);

  const rejectApplicant = useCallback((id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Suspended" } : p))
    );
  }, []);

  const resetDemo = useCallback(() => {
    setCredentials(seedCredentials);
    setProviders(initialProviders);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<DataContextValue>(() => {
    const publicProviders = providers.filter(
      (p) => p.status === "Accredited" || p.status === "Provisional"
    );
    const pendingProviders = providers.filter((p) => p.status === "Pending");
    return {
      credentials,
      providers,
      publicProviders,
      pendingProviders,
      issueCredential,
      setCredentialStatus,
      setProviderStatus,
      approveApplicant,
      rejectApplicant,
      resetDemo,
    };
  }, [
    credentials,
    providers,
    issueCredential,
    setCredentialStatus,
    setProviderStatus,
    approveApplicant,
    rejectApplicant,
    resetDemo,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

// ---- convenience selectors ----

export function useProvider(id: string | undefined) {
  const { providers } = useData();
  return providers.find((p) => p.id === id);
}

export function useCredential(id: string) {
  const { credentials } = useData();
  return credentials.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function useCredentialsForProvider(providerId: string) {
  const { credentials } = useData();
  return credentials.filter((c) => c.providerId === providerId);
}

export function useCredentialsForLearner(learnerId: string) {
  const { credentials } = useData();
  return credentials.filter((c) => c.learnerId === learnerId);
}
