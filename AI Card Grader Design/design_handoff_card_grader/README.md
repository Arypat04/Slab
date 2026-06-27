# Handoff: AI Card Grader — Mobile App

## Overview
A mobile app (iOS-first, 390×844 design frame) that grades trading cards from photos using AI. A user scans a card's front (and optionally back), gets a **predicted PSA grade** with sub-grades, defect overlay, multi-grader comparison and an ROI "worth grading?" verdict, then tracks everything in a portfolio/collection with insights. Subscription tiers: **Free / Plus / Pro**.

This bundle contains the **design system + an interactive flow prototype** plus the **full product spec**. Use them together: the prototype defines the visual language and the core flow; the spec (`PRODUCT_SPEC.md`) defines the complete screen inventory to build out.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS (as "Design Components")** — prototypes showing the intended look, layout, and behavior. **They are not production code to ship directly.** The task is to **recreate these designs in the target codebase's environment** using its established patterns and libraries. Recommended target for a native iOS feel: **React Native / Expo** or **SwiftUI**; a PWA in **React** also works. Whatever the framework, reproduce the visual system below pixel-faithfully (it is high-fidelity) and wire the navigation/state described here to real data + a real camera + a grading inference service.

Two HTML files are included:
- **`Card Grader — Prototype.dc.html`** — the **interactive** prototype. One phone frame; tap to navigate the full core flow; working light/dark theme toggle. This is the primary reference.
- **`Card Grader.dc.html`** — a **static exploration canvas**: 3 aesthetic directions (A Mint Bright, B Ink Premium, C Spectrum), the chosen **Hybrid (A×B) in light + dark**, and extra screens not yet in the interactive prototype — notably the **Free-tier gated grade result** (blurred sub-grades + paywall upsell) and the **Pro grade result with defect overlay + multi-grader row**. Use these as references for screens/states beyond the core flow.

> The HTML uses a small runtime ("Design Components"): `<sc-if>` = conditional render, `{{ }}` = data binding, a logic class holds `state`/handlers. Treat these as pseudo-code for your framework's conditional rendering and state — don't port the runtime itself.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and interactions are specified below with exact values. Recreate pixel-faithfully. Imagery (card art, photos) is shown as **striped grey placeholders with mono labels** — replace with real card images/camera frames. Status-bar/home-indicator chrome is mocked for the design frame; use the platform's real system chrome.

---

## Design Tokens

### Typography
- **Display / headings:** `Bricolage Grotesque` (Google Fonts), weights 700–800. Used for grades, values, screen titles, headlines. Tight tracking on big numerals: `letter-spacing: -0.02em` (−0.03 to −0.04em on the largest).
- **UI / body:** `Hanken Grotesk` (Google Fonts), weights 400–800. Labels, list rows, buttons, paragraphs.
- **Mono / data labels:** `DM Mono` (Google Fonts), weights 400–500. Micro-labels (`CENTERING`, `PREDICTED · PSA`, set lines), eyebrow text, technical captions. Usually `letter-spacing: 0.06–0.14em`, often UPPERCASE.
- **Numbers:** apply `font-variant-numeric: tabular-nums` to all stats/prices/grades (class `.cg-num`).

Type sizes observed (px): display 92 / 64 / 58 / 52 / 40 / 32 / 30 / 26 / 24 / 22 / 20 / 19; titles 17 / 16; body 15 / 14 / 13; small 12 / 11; mono 12 / 11 / 10 / 9. Line-height ~0.85–0.9 for big numerals, 1.05–1.1 for headings, 1.45–1.6 for paragraphs.

### Color — Light theme (default)
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#f6f8f7` | App background |
| `--surface` | `#ffffff` | Cards, list rows |
| `--surface-2` | `#f1f4f3` | Subtle buttons, segmented track |
| `--ink` | `#0d1b17` | Primary text, dark "slab" cards |
| `--muted` | `#7c8a84` | Mono labels, tertiary text |
| `--muted-2` | `#61716b` | Secondary text |
| `--line` | `#eaeeec` | Hairline borders, dividers |
| `--line-2` | `#e7ecea` | Slightly stronger borders |
| `--accent` | `#00c2a8` | Primary brand teal (CTAs, active, bars) |
| `--accent-deep` | `#00a892` | Teal text on light |
| `--accent-ink` | `#04332c` | Text/icon ON teal fills |
| `--slab` | `#0d1b17` | Dark feature cards (grade/portfolio/verdict) |
| `--grade-num` | `#ffffff` | The big predicted-grade numeral |
| `--track` | `#eef2f0` | Progress/meter track |
| `--pos` | `#18b368` | Positive P/L, gains |
| `--homebar` | `#0d1b17` | Home indicator |
| Warn set | bg `#fff7ec`, border `#f6e4c5`, text `#7a5a17`, sub `#9a7a36` | "Why not a 10?" card |
| Amber dot | `#f0a83a` | Warning accent |

### Color — Dark theme
| Token | Hex |
|---|---|
| `--bg` | `#0c1714` |
| `--surface` | `#13211c` |
| `--surface-2` | `#15241f` |
| `--ink` | `#ffffff` |
| `--muted` | `#6f827b` |
| `--muted-2` | `#9fb0aa` |
| `--line` | `#20342d` |
| `--line-2` | `#243630` |
| `--accent` | `#00c2a8` (same) |
| `--accent-deep` | `#00c2a8` |
| `--slab` | `linear-gradient(135deg,#11201b,#15302a)` |
| `--grade-num` | `#00c2a8` (teal numeral on dark slab) |
| `--track` | `#1f2f29` |
| `--pos` | `#5ee49f` |
| `--homebar` | `#ffffff` |
| Warn set | bg `rgba(240,168,58,.1)`, border `rgba(240,168,58,.28)`, text `#f0c47a`, sub `#c9a86a` |

**Theming:** implement as semantic tokens (above) and switch the whole tree by theme. The teal `#00c2a8`, `--accent-ink #04332c`, and the secondary `#5b6cff` (indigo, used for "raw" badges / ROI accent) and gem-grade gold `#f0a83a` stay constant across themes.

### Secondary / semantic accents
- Indigo `#5b6cff` — "RAW" badges, secondary highlights, avatar gradient end.
- Avatar gradient: `linear-gradient(135deg,#00c2a8,#5b6cff)`.
- Negative value: `#f0533f` (notification dot, losses).
- Inside dark slabs, sub-label teal is `#7fe9d8`, meta grey `#9fb0aa`.

### Spacing
Screen horizontal gutter **20px**. Card padding 14–20px. Inter-card gaps 10–16px. Stat/grid gaps 10–12px. Section vertical rhythm 12–18px. List-row padding 10–11px.

### Radius
Phone frame `46px` · large feature cards `20–24px` · standard cards `16–18px` · small cards/chips `13–16px` · grade thumbnails `6–10px` · pills/segmented `100px` · circular controls `50%`.

### Shadows / effects
- Phone frame: `0 24px 60px rgba(13,30,26,.22)`.
- Floating teal action (scan FAB, onboarding badge): `0 8px 20px rgba(0,194,168,.4)` / `0 6px 16px rgba(0,194,168,.4)`.
- Slab "glow": absolutely-positioned circle, `radial-gradient(circle,#00c2a8 0%,rgba(0,194,168,0) 70%)`, `opacity .45–.5`, placed top-right and clipped by `overflow:hidden`.
- Most cards use **borders, not shadows** (1px `--line`). Keep it flat and bright.

### Iconography
Simple line icons, 1.6–1.8 stroke, round caps/joins, ~16–26px. (Prototype hand-rolls minimal SVGs; in production use a set like Lucide/SF Symbols matched to this weight.)

---

## Screens / Views

### Built in the interactive prototype (`Card Grader — Prototype.dc.html`)
Navigation/state map and per-screen notes below. All screens sit inside a 390×844 frame with a persistent status bar (top) and home indicator (bottom). Screen enters with a subtle `translateY(10px)→0` rise (~0.3s ease).

1. **Onboarding** (`onboarding`) — 3-slide carousel. Card-stack hero illo (two tilted card placeholders + a teal camera badge). Mono eyebrow + Bricolage headline + body. Progress dots (active = 24px teal pill, inactive = 7px `#cdd6d2`). Dark **Next** button advances slide; on slide 3 → Paywall. **Skip** → Paywall. Copy per slide: (1) `SNAP · GRADE · KNOW` / "AI grading from two photos"; (2) `BUY SMARTER` / "Know the value before you buy"; (3) `TRACK EVERYTHING` / "Watch your collection grow".
2. **Paywall** (`paywall`) — Mono eyebrow `CARDGRADER PRO`, headline "Grade smarter. Buy with an edge.", Monthly/Annual segmented (Annual selected, "save 40%"), featured **Pro** slab card ($7/mo billed $84/yr) with 3 checkmarked features, then Plus ($4/mo) + Free (10 scans/mo) mini-cards. CTA "Start 7-day free trial" → Home; "Continue with Free" → Home; ✕ → Home. (See tier matrix in `PRODUCT_SPEC.md`.)
3. **Home** (`home`) — Top bar: avatar (→Profile) + "Good evening / Alex", search + bell (red badge). Dark portfolio slab: `PORTFOLIO VALUE` $12,480, +8.4% / +$968 chip, teal area sparkline. 3 quick-stat cards (Cards 342 / Graded 61 / Gem rate 47%). "Recent grades" list rows (thumb + name + set + grade + value) → Card Detail. Tab bar (Home active).
4. **Scan / Capture** (`scan`) — Light chrome over a dark camera viewport. Top: ✕ (→Home), `Front Only / Front & Back` segmented, flash. Card alignment frame with teal corner brackets + mono `RAW CARD / PSA LABEL`. Green "Aligned — hold steady" pill. Bottom: `.5×`, **shutter** (teal disc, ring) → starts processing, gallery icon. *To build:* live camera, glare/blur/distance guidance, auto-capture, B2 back-capture step.
5. **Analysis** (`analysis`) — Scanning card with an animated teal sweep line; step checklist (Identified ✓, Measured centering ✓, Detecting defects ⟳, Pricing ○). Auto-advances to Grade after ~2.3s (simulated inference). Tap anywhere also advances. *To build:* real progress tied to inference; Cancel.
6. **Grade Result — Pro / Hybrid** (`grade`) — The hero screen. Card thumb + dark grade slab (`PREDICTED · PSA`, big **9** numeral, `MINT`, "92% confidence"). Card id (Bricolage name + mono set line). 2×2 **sub-grade** cards (Centering 8.5 / Corners 9.0 / Edges 9.5 / Surface 9.0) each = mono label + big numeral + thin teal fill bar. **Centering L/R** meter (55/45, center tick). **"Why not a 10?"** amber explainer card. Header has working **light/dark toggle**. Footer: save icon (→Collection) + "See ROI · $58 net" (→ROI). *See `Card Grader.dc.html` for the **defect-overlay** variant (annotated front photo w/ whitening/print-line callouts + Front/Back toggle + zoom) and the **multi-grader** row (PSA/CGC/BGS/TAG), plus the **Free gated** variant (blurred sub-grades behind a lock + "Unlock with Plus" upsell).*
7. **ROI / Worth grading?** (`roi`) — Dark verdict slab ("Yes — grade it", net **+$214**). Raw value ($95) vs At PSA 10 ($420) pair. **Grade-probability** bar chart (8/9/10 with 54% peak). Cost breakdown rows (grading −$19, shipping −$22, selling fees −$50). CTA "Add to PSA submission" → Home. Back → Grade.
8. **Collection** (`collection`) — Title + add (→Scan). Mini portfolio card ($12,480, +$2,140 all-time, sparkline). Filter chips (All 342 active / Pokémon / NHL / Graded). 2-col card grid (image placeholder + grade/RAW badge + name + value) → Card Detail. Tab bar (Collection active).
9. **Card Detail** (`detail`) — Dark hero with card placeholder + back (→Collection) + `FRONT · BACK · OVERLAY`. Name/set + grade chip. Market value $430 +14%/30d with price-history area chart + range tabs (1M/6M/1Y/All). "Your data" rows (Paid $240, P/L +$190 +79%, Cert #). Footer: watch icon + "See ROI" (→ROI). *To build:* price-alert, wishlist, sell/remove, share.
10. **Insights** (`insights`) — Gem rate 47% (+6 vs predicted) + best month +$968. **Allocation** stacked bar (Pokémon 52% teal / NHL 30% indigo / Other 18% gold) + legend rows. "Top performers" list (+128%, +79%). Tab bar (Insights active). *To build:* Grading Plays feed (D2), price alerts (D3), goals (D4).
11. **Profile** (`profile`) — Avatar + name + `PRO MEMBER` badge. 3 stats (Value $12.5k / Cards 342 / Gem 47%). **Appearance** row toggles theme. Links list (My Showcase →Collection, Submissions & goals →Insights, Manage subscription →Paywall). Tab bar (Profile active). *To build:* full settings (F3), notifications center (F4), subscription mgmt (F2), public showcase (E1).

### Bottom Tab Bar (persistent on Home/Collection/Insights/Profile)
5 items: **Home · Collection · [Scan FAB] · Insights · Profile**. Scan is a raised 58px teal rounded-square (`margin-top:-22px`, the teal glow shadow) → Scan flow. Active tab = teal icon + `--accent-deep` label; inactive = `#9aa6a0`. Height 86px, `--footer` bg, top hairline.

### Remaining screens to build (in `PRODUCT_SPEC.md`, not yet prototyped)
Implement using the tokens above. Priority order follows the spec's BUILD PRIORITY:
- **Auth/onboarding:** A1 Splash, A3 Sign up/in (Apple/Google/email), A4 Permissions priming, A5 Preference setup (games, graders, currency, collector type).
- **Scan:** B2 Capture Back, B5 Multi-Grader full screen, B7 Save-to-Collection modal.
- **Collection:** C3 Set/Master-set view (completion %), C4 Sealed products, C5 Wishlist, C6 Submission tracker (status pipeline + real gem rate), C7 Add manually/search.
- **Insights:** D2 Grading Plays (signature feature), D3 Price alerts, D4 Goals.
- **Social shell:** E1 Public showcase.
- **Profile:** F2 Subscription mgmt, F3 Settings, F4 Notifications center.
- **Cross-cutting states (every screen):** Loading (skeletons over `--surface`), Empty (illustration + primary CTA), Error (retry + support; esp. "no card identified"), Offline (queued scans), **Paywall interstitial** when a Free user taps a gated feature, first-run coach marks on Scan + Collection.

---

## Interactions & Behavior
- **Navigation:** single source of truth `screen` value swaps the active view; back chevrons and tab bar set it. Forward flow: `onboarding → paywall → home → scan → analysis → grade → roi`. Cross-links: home/collection cards → `detail`; detail/grade → `roi`; profile → `paywall`.
- **Onboarding:** `slide` 0→1→2; Next advances, past 2 → paywall.
- **Scan → result:** shutter sets `analysis`, then a timer (~2300ms, simulating inference) sets `grade`; tapping Analysis also jumps to `grade`. Replace the timer with a real async grading call; show the step checklist as real progress; handle failure → Error state.
- **Theme toggle:** flips `light`/`dark`; re-themes the entire tree via semantic tokens. Persist the choice (and honor system setting as default).
- **Transitions:** screen enter = `translateY(10px)→0`, ~0.3s ease. Analysis sweep line = vertical loop ~1.6s ease-in-out alternate. Spinner = 0.8s linear. Keep motion subtle.
- **Hit targets:** ≥44px. Shutter 76px, FAB 58px, circular controls 38–52px.
- **Gating (Free vs Plus/Pro):** Free = limited scans/mo + grade only (sub-grades/defect overlay blurred behind upsell — see Free variant in `Card Grader.dc.html`); Plus/Pro unlock sub-grades, multi-grader, ROI, submission tracker, unlimited collection. Full matrix in `PRODUCT_SPEC.md`.

## State Management
Global/app state:
- `screen` (enum: onboarding, paywall, home, scan, analysis, grade, roi, collection, detail, insights, profile, + screens to add)
- `theme` ('light' | 'dark', persisted; default = system)
- `slide` (0–2, onboarding)
- `tier` ('free' | 'plus' | 'pro') — drives gating/paywall interstitials
Per-feature data to fetch/model: user + portfolio summary, collection items (card id, set, grade/raw, values, P/L, cert, tags), a scan result (predicted grade, confidence, sub-grades, centering L/R + T/B, defects list, comps/prices), ROI model (raw vs graded values, grade probability distribution, fees), insights aggregates (allocation, gem rate, performers), submissions, alerts, goals. The grade/ROI numbers in the mock are sample data — wire to a real card-ID + grading inference service and a pricing/comps source.

## Assets
- **Fonts:** Bricolage Grotesque, Hanken Grotesk, DM Mono (Google Fonts) — load these or map to nearest in your system.
- **Imagery:** all card art / photos are **placeholders** (diagonal-stripe fills + mono captions). Supply real card images, camera viewport, and a real avatar. No proprietary/brand assets are used — sample card *names* (Charizard, Pikachu, Connor Bedard/McDavid) are placeholders for Pokémon + NHL data; replace with licensed/real catalog data.
- **Icons:** minimal line SVGs in-file; swap for a production icon set at 1.6–1.8 stroke weight.

## Screenshots
`screenshots/` contains a rendered PNG of every screen (full phone, both themes for the hero). Use them as the visual index alongside the per-screen specs above:
- `01-hybrid-light.png`, `02-hybrid-dark.png` — the chosen Grade Result system in both themes (token reference for theming).
- `03-grade-style-A-mint.png`, `04-grade-style-B-ink.png`, `05-grade-style-C-spectrum.png` — the 3 explored aesthetic directions (context only; A×B hybrid is the chosen one).
- `06-onboarding.png`, `07-paywall.png`, `08-home.png` — entry flow.
- `09-scan-capture.png`, `10-analysis.png`, `11-grade-free-gated.png`, `12-grade-pro-defect-overlay.png` — scan → result, incl. **Free gated** and **Pro defect-overlay/multi-grader** variants.
- `13-roi.png`, `14-collection.png`, `15-card-detail.png` — value & collection.

## React (JSX) source — `jsx/`
A **runnable React + Vite port** of the interactive prototype is included under `jsx/`. It mirrors the HTML prototype 1:1 (same screens, styles, navigation, theme system) and is verified to compile and run.

Run it:
```bash
cd jsx
npm install
npm run dev
```

Structure:
- `jsx/src/App.jsx` — root: state machine (`screen`, `theme`, `slide`), navigation handlers, the simulated `startProcessing` timer (**replace with your real grading inference call**), and the phone shell.
- `jsx/src/Chrome.jsx` — `StatusBar` + `HomeIndicator` (mock device chrome; drop for a real app).
- `jsx/src/screens/*.jsx` — one component per screen: `Onboarding, Paywall, Home, Scan, Analysis, Grade, Roi, Collection, Detail, Insights, Profile`. Each takes a `p` props bag (handlers + `slide`/`dot` state).
- `jsx/src/style.js` — `s()` helper (CSS-string → React style object; preserves CSS custom properties) + token objects for reference.
- `jsx/src/global.css` — font import, resets, `@keyframes`, and the **`.cg-app` / `.cg-app[data-theme="dark"]` CSS-variable theme** (this is what drives the light/dark switch).
- `jsx/index.html`, `jsx/src/main.jsx`, `jsx/package.json`, `jsx/vite.config.js` — Vite app shell.

**How styling works:** components keep the design's exact inline style strings via `style={s("…")}`, and all theme-dependent values are CSS variables (`var(--bg)`, `var(--ink)`, `var(--accent)`, …) resolved by `global.css`. To re-theme, only the two `.cg-app` blocks change. In a production app you may prefer to convert `s("…")` strings into your styling system (CSS Modules, Tailwind, styled-components, NativeWind/StyleSheet for RN) — the values/tokens are identical to the **Design Tokens** section above. Card art, the camera viewport, avatars, and charts are placeholders — wire to real data/components.

## Files
- `Card Grader — Prototype.dc.html` — interactive core-flow prototype (primary reference).
- `Card Grader.dc.html` — static exploration canvas (aesthetic directions + hybrid light/dark + Free-gated & defect-overlay/multi-grader grade variants).
- `PRODUCT_SPEC.md` — the complete product & screen specification (full screen inventory, states, tier matrix, build priority).
- Open the `.dc.html` files in a browser to view; they are self-contained except for the Google Fonts links.
