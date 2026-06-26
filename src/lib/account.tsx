import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Edition = "java" | "bedrock";

export type PurchaseRecord = {
  id: string;
  date: string;
  items: { id: string; name: string; price: string }[];
  total: string;
};

export type Account = {
  username: string;
  edition: Edition;
  /** Display name — bedrock players get a leading dot, e.g. ".Devydtz" */
  displayName: string;
  /** Avatar URL (head) */
  avatarUrl: string;
  /** Body render URL */
  bodyUrl: string;
  history: PurchaseRecord[];
};

type AccountCtx = {
  account: Account | null;
  signIn: (username: string, edition: Edition) => void;
  signOut: () => void;
  recordPurchase: (purchase: PurchaseRecord) => void;
};

const Ctx = createContext<AccountCtx | null>(null);
const KEY = "lunaris.account.v1";

function buildAccount(username: string, edition: Edition, history: PurchaseRecord[] = []): Account {
  const clean = username.trim().replace(/^\.+/, "");
  const displayName = edition === "bedrock" ? `.${clean}` : clean;
  // Java skin via mc-heads. For Bedrock, no public username->skin API without xuid lookup,
  // so we fall back to a friendly placeholder head.
  const avatarUrl =
    edition === "java"
      ? `https://mc-heads.net/avatar/${encodeURIComponent(clean)}/96`
      : `https://mc-heads.net/avatar/MHF_Steve/96`;
  const bodyUrl =
    edition === "java"
      ? `https://mc-heads.net/body/${encodeURIComponent(clean)}/256`
      : `https://mc-heads.net/body/MHF_Steve/256`;
  return { username: clean, edition, displayName, avatarUrl, bodyUrl, history };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { username: string; edition: Edition; history?: PurchaseRecord[] };
      setAccount(buildAccount(parsed.username, parsed.edition, parsed.history ?? []));
    } catch {}
  }, []);

  const value = useMemo<AccountCtx>(() => ({
    account,
    signIn: (username, edition) => {
      const next = buildAccount(username, edition, account?.history ?? []);
      setAccount(next);
      localStorage.setItem(KEY, JSON.stringify({ username: next.username, edition: next.edition, history: next.history }));
    },
    signOut: () => {
      setAccount(null);
      localStorage.removeItem(KEY);
    },
    recordPurchase: (purchase) => {
      setAccount((prev) => {
        if (!prev) return prev;
        const history = [purchase, ...prev.history].slice(0, 25);
        const next = { ...prev, history };
        localStorage.setItem(KEY, JSON.stringify({ username: next.username, edition: next.edition, history }));
        return next;
      });
    },
  }), [account]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
