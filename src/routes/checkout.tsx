import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Lock, ShoppingBag, ArrowLeft, CheckCircle2, Gamepad2, Smartphone, User as UserIcon } from "lucide-react";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";
import { useAccount, type Edition } from "@/lib/account";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Lunaris Craft" },
      { name: "description", content: "Complete your Lunaris Craft purchase. Items deliver in-game within minutes." },
      { property: "og:title", content: "Checkout — Lunaris Craft" },
      { property: "og:description", content: "Complete your Lunaris Craft purchase. Items deliver in-game within minutes." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, totalDisplay, totalCents, clear } = useCart();
  const { account, signIn, recordPurchase } = useAccount();
  const navigate = useNavigate();

  const [username, setUsername] = useState(account?.username ?? "");
  const [edition, setEdition] = useState<Edition>(account?.edition ?? "java");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const clean = username.trim().replace(/^\.+/, "");
    if (clean.length < 3 || clean.length > 16 || !/^[A-Za-z0-9_]+$/.test(clean)) {
      setError("Enter a valid Minecraft username (3–16 chars).");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter a valid email."); return; }
    if (card.replace(/\s/g, "").length < 12) { setError("Enter a valid card number."); return; }
    if (!/^\d{2}\/\d{2}$/.test(exp)) { setError("Expiry must be MM/YY."); return; }
    if (!/^\d{3,4}$/.test(cvc)) { setError("CVC must be 3–4 digits."); return; }

    setSubmitting(true);
    if (!account || account.username !== clean || account.edition !== edition) {
      signIn(clean, edition);
    }
    await new Promise((r) => setTimeout(r, 1100));
    const orderId = "LC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    recordPurchase({
      id: orderId,
      date: new Date().toISOString(),
      items: items.map((i) => ({ id: i.id, name: `${i.name} ×${i.qty}`, price: `$${((i.priceCents * i.qty) / 100).toFixed(2)}` })),
      total: totalDisplay,
    });
    clear();
    setDone(orderId);
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Starfield />
      <div className="relative z-10">
        <Navbar />

        {done ? (
          <section className="px-6 py-24">
            <div className="pixel-card mx-auto max-w-lg rounded-2xl p-10 text-center animate-fade-in">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="mt-5 font-display text-5xl">Order Placed</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Order <span className="font-mono text-foreground">#{done}</span> confirmed.
                Your rewards will be in your inventory within a few minutes after you join the server.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/account" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-accent">
                  View Account
                </Link>
                <button onClick={() => navigate({ to: "/" })} className="rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent">
                  Back to Home
                </button>
              </div>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className="px-6 py-24 text-center">
            <div className="pixel-card mx-auto max-w-md rounded-2xl p-10">
              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
              <h1 className="mt-4 font-display text-4xl">Your cart is empty</h1>
              <p className="mt-2 text-sm text-muted-foreground">Add a rank, key, or bundle before checking out.</p>
              <Link to="/ranks" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-accent">
                Browse Ranks
              </Link>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl px-6 pb-24 pt-10">
            <Link to="/" className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Continue shopping
            </Link>
            <h1 className="font-display text-5xl">Checkout</h1>
            <p className="mt-1 text-sm text-muted-foreground">Secure test checkout — no real charges are made.</p>

            <form onSubmit={onSubmit} className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="pixel-card rounded-2xl p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <UserIcon className="h-5 w-5 text-accent" /> Delivery
                  </h2>

                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Edition</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["java", "bedrock"] as const).map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEdition(e)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                          edition === e
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {e === "java" ? <Gamepad2 className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                        {e === "java" ? "Java" : "Bedrock"}
                      </button>
                    ))}
                  </div>

                  <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Minecraft Username</label>
                  <div className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-border bg-background/60 focus-within:border-accent">
                    {edition === "bedrock" && (
                      <span className="grid place-items-center bg-accent/10 px-3 text-sm font-bold text-accent">.</span>
                    )}
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={edition === "bedrock" ? "Devydtz" : "Steve"}
                      className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>

                  <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email (receipt)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="pixel-card rounded-2xl p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <CreditCard className="h-5 w-5 text-accent" /> Payment
                  </h2>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Card Number</label>
                  <input
                    value={card}
                    onChange={(e) => setCard(formatCard(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-sm tracking-wider focus:border-accent focus:outline-none"
                  />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Expiry</label>
                      <input
                        value={exp}
                        onChange={(e) => setExp(formatExp(e.target.value))}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-sm focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">CVC</label>
                      <input
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        inputMode="numeric"
                        className="mt-2 w-full rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-sm focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> This is a demo checkout — your card is not charged.
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive ring-1 ring-destructive/30">
                    {error}
                  </div>
                )}
              </div>

              <aside className="pixel-card sticky top-20 h-fit rounded-2xl p-6">
                <h2 className="mb-4 text-lg font-bold">Order Summary</h2>
                <ul className="space-y-3">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{i.name}</p>
                        <p className="text-xs text-muted-foreground">Qty {i.qty} · {i.rarity}</p>
                      </div>
                      <span className="font-bold text-foreground">${((i.priceCents * i.qty) / 100).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-border/60 pt-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span><span>{totalDisplay}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Tax</span><span>Included</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-base font-bold">
                    <span>Total</span><span className="text-xl">{totalDisplay}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-5px_oklch(0.85_0.13_295/0.6)] transition hover:bg-accent disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Pay {totalDisplay}
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  {totalCents > 0 && "Items deliver in-game within minutes."}
                </p>
              </aside>
            </form>
          </section>
        )}

        <SiteFooter />
      </div>
    </div>
  );
}

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}
function formatExp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
}
