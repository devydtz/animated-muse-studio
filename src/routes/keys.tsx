import { createFileRoute } from "@tanstack/react-router";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/keys")({
  head: () => ({
    meta: [
      { title: "Crate Keys — Lunaris Craft" },
      { name: "description", content: "Open mystical crates and discover rare loot on Lunaris Craft." },
    ],
  }),
  component: KeysPage,
});

function KeysPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-28 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Unlock the Unknown</p>
          <h1 className="mt-3 font-display text-6xl">Crate Keys</h1>
          <p className="mt-5 text-muted-foreground">Key catalog coming soon.</p>
        </section>
        <SiteFooter />
      </div>
    </div>
  );
}