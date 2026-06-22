import { createFileRoute } from "@tanstack/react-router";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/bundles")({
  head: () => ({
    meta: [
      { title: "Bundles — Lunaris Craft" },
      { name: "description", content: "Curated bundles combining ranks, keys, and exclusive items." },
    ],
  }),
  component: BundlesPage,
});

function BundlesPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Starfield />
      <div className="relative z-10">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-28 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Maximum Value</p>
          <h1 className="mt-3 font-display text-6xl">Bundles</h1>
          <p className="mt-5 text-muted-foreground">Bundle catalog coming soon.</p>
        </section>
        <SiteFooter />
      </div>
    </div>
  );
}