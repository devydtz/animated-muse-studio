import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock, LogOut, Gamepad2, Smartphone, ShoppingBag } from "lucide-react";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { useAccount, type Edition } from "@/lib/account";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Lunaris Craft" },
      { name: "description", content: "Sign in with your Minecraft username to manage purchases and track your Lunaris Craft progress." },
      { property: "og:title", content: "Account — Lunaris Craft" },
      { property: "og:description", content: "Sign in with your Minecraft username to manage purchases and track your Lunaris Craft progress." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { account, signIn, signOut } = useAccount();
  const [username, setUsername] = useState("");
  const [edition, setEdition] = useState<Edition>("java");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().replace(/^\.+/, "");
    if (clean.length < 3 || clean.length > 16) {
      setError("Username must be 3–16 characters.");
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(clean)) {
      setError("Only letters, numbers, and underscores.");
      return;
    }
    setError(null);
    signIn(clean, edition);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <PageHero
          eyebrow={account ? "Welcome Back" : "Your Profile"}
          title={account ? account.displayName : "Account"}
          description={
            account
              ? `Signed in as a ${account.edition === "bedrock" ? "Bedrock" : "Java"} player. Track purchases and claim rewards here.`
              : "Link your Minecraft username to view purchase history, claim rewards, and track active perks."
          }
        />
        {!account ? (
          <section className="px-6 pb-24">
            <form onSubmit={submit} className="pixel-card mx-auto max-w-md rounded-2xl p-8 animate-fade-in">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-accent ring-1 ring-accent/30">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Sign In</h2>
                  <p className="text-xs text-muted-foreground">Use your in-game Minecraft username.</p>
                </div>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Edition
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["java", "bedrock"] as const).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEdition(e)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      edition === e
                        ? "border-accent bg-accent/10 text-accent shadow-[0_0_20px_-8px_oklch(0.78_0.13_295/0.8)]"
                        : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {e === "java" ? <Gamepad2 className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                    {e === "java" ? "Java" : "Bedrock"}
                  </button>
                ))}
              </div>

              <label className="mt-5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Minecraft Username
              </label>
              <div className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-border bg-background/60 focus-within:border-accent">
                {edition === "bedrock" && (
                  <span className="grid place-items-center bg-accent/10 px-3 text-sm font-bold text-accent">.</span>
                )}
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={edition === "bedrock" ? "Devydtz" : "Steve"}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  autoComplete="off"
                />
              </div>
              {edition === "bedrock" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Bedrock players appear in-game with a leading dot — e.g. <span className="font-mono text-foreground">.Devydtz</span>.
                </p>
              )}

              {error && (
                <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive ring-1 ring-destructive/30">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_oklch(0.85_0.13_295/0.6)] transition hover:bg-accent hover:scale-[1.01]"
              >
                <Lock className="h-4 w-4" />
                Continue
              </button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                You must have joined <span className="font-mono text-foreground">mclunaris.fun</span> at least once.
              </p>
            </form>
          </section>
        ) : (
          <section className="px-6 pb-24">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_2fr]">
              <div className="pixel-card rounded-2xl p-6 text-center animate-fade-in">
                <div className="mx-auto mb-4 grid h-72 w-full place-items-center overflow-hidden rounded-xl bg-background/60">
                  <img
                    src={account.bodyUrl}
                    alt={`${account.displayName} skin`}
                    className="h-64 w-auto select-none [image-rendering:pixelated]"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://mc-heads.net/body/MHF_Steve/256";
                    }}
                  />
                </div>
                <h2 className="font-display text-3xl text-foreground">{account.displayName}</h2>
                <p className="text-xs uppercase tracking-widest text-accent">
                  {account.edition === "bedrock" ? "Bedrock Edition" : "Java Edition"}
                </p>
                <button
                  onClick={signOut}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-destructive hover:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>

              <div className="pixel-card rounded-2xl p-6 animate-fade-in">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-accent ring-1 ring-accent/30">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Purchase History</h3>
                    <p className="text-xs text-muted-foreground">Orders are delivered in-game within a few minutes.</p>
                  </div>
                </div>
                {account.history.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                    No purchases yet. Your first order will appear here.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {account.history.map((p) => (
                      <li key={p.id} className="rounded-xl border border-border/60 bg-background/40 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-mono text-muted-foreground">#{p.id}</p>
                            <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleString()}</p>
                          </div>
                          <span className="text-lg font-bold text-foreground">{p.total}</span>
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-foreground/85">
                          {p.items.map((i) => (
                            <li key={i.id} className="flex justify-between">
                              <span>{i.name}</span>
                              <span className="text-muted-foreground">{i.price}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}
        <SiteFooter />
      </div>
    </div>
  );
}