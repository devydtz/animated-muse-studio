## Lunaris Craft — Minecraft Store Site

I'll recreate the homepage from your Airo share link, using your uploaded logo and matching the dark starry purple aesthetic with animated shooting stars.

### Pages (TanStack routes)
- `/` — Home (full build now)
- `/ranks`, `/keys`, `/bundles`, `/account` — stub routes wired in the nav so links work (placeholder "Coming soon" content)

### Home page sections
1. **Top nav** — Lunaris Craft logo (left), nav links (Home, Ranks, Keys, Bundles, Account), Discord icon, cart icon, "Connect" pill button (right)
2. **Hero** — Animated starfield background with shooting stars (CSS keyframes, multiple layers of twinkling dots + diagonal streaks), large centered Lunaris Craft logo, "✦ Official Store" pill, tagline "Support the server and unlock ranks, cosmetic keys, to enhance your adventure.", three CTA buttons: Browse Ranks / Browse Keys / Bundles
3. **Choose Your Path** — Section label "The Store" + heading, three feature cards: Ranks (Claim Your Title), Crate Keys (Unlock the Unknown), Bundles (Maximum Value)
4. **Featured Items** — "Most Popular" label + heading, product cards with rarity badges: VIP Rank ($4.99, Rare), Legend Rank ($19.99, Legendary), Lunar Key ($7.99, Legendary), Starter Bundle ($9.99, Rare) — each with View button
5. **Join the Adventure CTA** — "Ready to Play?" label, heading, copy, Server IP display `mclunaris.fun` (copy-on-click), "Connect Now" button linking to `minecraft://mclunaris.fun`, footnote "Java Edition 1.20+ · Bedrock supported"
6. **Footer** — Minimal: logo, small nav, copyright

### Design system
- Dark deep-purple/near-black background (`oklch` around `0.13 0.04 295`)
- Lavender accent (`#C9B8FF` / `oklch(0.82 0.08 295)`) for buttons and highlights
- Card surfaces with subtle purple-tinted borders and inner glow
- Pixel/blocky display font for headings (Google Fonts: **Press Start 2P** or **VT323** for accents; **Inter** for body)
- Rounded pill buttons with soft glow on hover
- All colors as semantic tokens in `src/styles.css`

### Animated starry background
- Three layered absolute-positioned divs with `radial-gradient` star fields at different opacities/sizes
- 4–6 shooting-star elements with CSS `@keyframes` animating `translate` + opacity across the screen on staggered delays
- Subtle twinkle animation on background star layer

### Assets
- Upload your `lunaris.logo.png` via lovable-assets CDN, import the pointer JSON, use in nav (small) and hero (large)

### Technical notes
- Tailwind v4 tokens in `src/styles.css`; Google Fonts loaded via `<link>` in `__root.tsx` head
- New components under `src/components/` (Navbar, Hero, Starfield, PathCards, FeaturedItems, JoinCTA, Footer)
- Update `__root.tsx` meta to "Lunaris Craft — Official Minecraft Server Store"
- Replace placeholder `src/routes/index.tsx`
- Stub route files for /ranks, /keys, /bundles, /account so nav Links typecheck

No backend yet — purchase/cart flow is visual only. Ask me when you want real checkout (Stripe/Paddle via Lovable Cloud).
