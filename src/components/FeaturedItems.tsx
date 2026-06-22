import { Link } from "@tanstack/react-router";
import { Crown, KeyRound, Package, Sparkles } from "lucide-react";

type Rarity = "Rare" | "Legendary";

const items: Array<{
  name: string;
  copy: string;
  price: string;
  rarity: Rarity;
  to: "/ranks" | "/keys" | "/bundles";
  Icon: typeof Crown;
}> = [
  { name: "VIP Rank", copy: "Access exclusive commands, colored chat, and VIP-only areas.", price: "$4.99", rarity: "Rare", to: "/ranks", Icon: Crown },
  { name: "Legend Rank", copy: "The ultimate rank. Custom prefix, fly in survival, and more.", price: "$19.99", rarity: "Legendary", to: "/ranks", Icon: Sparkles },
  { name: "Lunar Key", copy: "Open the Lunar Crate for a chance at the rarest gear on the server.", price: "$7.99", rarity: "Legendary", to: "/keys", Icon: KeyRound },
  { name: "Starter Bundle", copy: "VIP Rank + 3 Crate Keys + $2 store credit. Perfect start.", price: "$9.99", rarity: "Rare", to: "/bundles", Icon: Package },
];

const rarityClass: Record<Rarity, string> = {
  Rare: "bg-rare/15 text-rare ring-1 ring-rare/40",
  Legendary: "bg-legendary/15 text-legendary ring-1 ring-legendary/40",
};

export function FeaturedItems() {
  return (
    <section className="relative px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Most Popular</p>
          <h2 className="mt-3 font-display text-5xl text-foreground md:text-6xl">Featured Items</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.name} className="pixel-card flex flex-col rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-accent ring-1 ring-accent/30">
                  <item.Icon className="h-6 w-6" />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${rarityClass[item.rarity]}`}>
                  {item.rarity}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{item.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xl font-bold text-foreground">{item.price}</span>
                <Link
                  to={item.to}
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-accent"
                >
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}