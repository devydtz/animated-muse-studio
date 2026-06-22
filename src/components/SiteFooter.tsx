import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/lunaris-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="relative mt-10 border-t border-border/40 bg-background/40 px-6 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Lunaris Craft" className="h-9 w-auto" />
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <Link to="/ranks" className="hover:text-foreground">Ranks</Link>
          <Link to="/keys" className="hover:text-foreground">Keys</Link>
          <Link to="/bundles" className="hover:text-foreground">Bundles</Link>
          <Link to="/account" className="hover:text-foreground">Account</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lunaris Craft. Not affiliated with Mojang.</p>
      </div>
    </footer>
  );
}