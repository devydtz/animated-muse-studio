import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock } from "lucide-react";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";

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
  const [username, setUsername] = useState("");
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <PageHero
          eyebrow="Your Profile"
          title="Account"
          description="Link your Minecraft username to view purchase history, claim rewards, and track active perks."
        />
        <section className="px-6 pb-24">
          <div className="pixel-card mx-auto max-w-md rounded-2xl p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-accent ring-1 ring-accent/30">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Sign In</h2>
                <p className="text-xs text-muted-foreground">Use your in-game Minecraft username.</p>
              </div>
            </div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Minecraft Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Steve"
              className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
            />
            <button
              onClick={() => alert("Account system coming soon!")}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
            >
              <Lock className="h-4 w-4" />
              Continue
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              You must have joined <span className="font-mono text-foreground">mclunaris.fun</span> at least once.
            </p>
          </div>
        </section>
        <SiteFooter />
      </div>
    </div>
  );
}