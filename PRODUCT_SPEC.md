# AI Card Grader — Full Product & Screen Specification

> Master spec for UI design. Every screen, component, state, and the subscription tier that gates it.
> Tiers referenced: **Free**, **Plus**, **Pro**.

---

## App Structure / Navigation

**Bottom Tab Bar (5 tabs):**
1. **Home** — dashboard, portfolio summary, quick actions
2. **Scan** — center button, the grading camera flow (primary action)
3. **Collection** — inventory, sets, sealed, wishlist
4. **Insights** — analytics, Grading Plays, alerts
5. **Profile** — account, subscription, settings

**Global elements:**
- Persistent "Scan" FAB or center tab button
- Top bar: search icon, notifications bell (with badge), profile avatar
- Universal search (cards, sets, your collection)

---

# SECTION A — ONBOARDING & AUTH

## A1. Splash Screen
- Logo + subtle animation
- Auto-routes to onboarding (new) or Home (returning)

## A2. Onboarding Carousel (3–5 slides)
- Slide 1: "AI grading from two photos"
- Slide 2: "Know a card's value before you buy"
- Slide 3: "Track your collection's worth over time"
- Slide 4: "Find profitable cards to grade"
- Progress dots, Skip, Next, final "Get Started" CTA

## A3. Sign Up / Sign In
- Sign in with Apple (primary)
- Google sign-in
- Email + password
- Toggle between Sign Up / Sign In
- Legal: Terms + Privacy links

## A4. Permissions Priming
- Camera access (required, explain why)
- Notifications (price alerts, submission updates)
- Soft-ask screens before the iOS system prompt

## A5. Preference Setup
- Select games tracked: Pokémon, Magic, sports cards, One Piece, etc. (multi-select)
- Preferred grading services: PSA, CGC, TAG, BGS (multi-select)
- Default currency
- Collector type: Casual / Investor / Flipper (personalizes Home)

## A6. Paywall (post-onboarding)
- Tier comparison: Free / Plus / Pro
- Monthly vs annual toggle (highlight annual savings)
- Feature checklist per tier
- "Start Free Trial" CTA + "Continue with Free"
- Restore purchases link
- Re-surfaced contextually when a gated feature is tapped

---

# SECTION B — SCAN / GRADING FLOW (core)

## B1. Capture — Front
- Live camera with card-shaped alignment frame
- Real-time guidance: glare / blur / lighting / distance warnings
- Auto-capture when aligned, or manual shutter
- Flash toggle, gallery import option
- Tip overlay for first-time users

## B2. Capture — Back
- Same as B1 for card back
- Thumbnail of front shown in corner
- Retake front option

## B3. Analysis / Processing
- Animated scanning state over the card image
- Progress steps: "Identifying card… Measuring centering… Detecting defects… Pricing…"
- Cancel option

## B4. Grade Results (primary output screen)
- Identified card header: name, set, number, variant, language
- **Predicted grade** — large, with confidence %
- **Sub-grades**: Centering, Corners, Edges, Surface (individual scores + bars)
- **Defect overlay** — tap to view annotated photo (scratches, whitening, dents, print lines)
- **Centering measurement** — L/R and T/B percentages vs grade tolerance
- **"Why not a 10?"** plain-language explanation card
- Front/back image toggle with zoom
- Actions: Save to Collection, See ROI, Compare Graders, Re-scan, Share
- *Gating:* Free = limited scans/month + grade only; Plus/Pro = sub-grades, overlay, unlimited

## B5. Multi-Grader Comparison
- Side-by-side predicted grade across PSA / CGC / TAG / BGS
- Notes on how each service differs for this card
- *Gating:* Plus+

## B6. ROI / Profit Breakdown
- Raw value vs value at each predicted grade
- Grade probability distribution (chart)
- Costs: grading fee, shipping, selling fees
- **Net expected profit** + "Worth grading?" verdict
- Best service recommendation for max net return
- *Gating:* Plus+ (advanced EV modeling Pro)

## B7. Save / Add to Collection (modal)
- Confirm card details (editable)
- Add purchase price, acquisition date, condition, quantity, notes, tags
- Add to a set / folder
- Mark as: Raw / Submitted / Graded (+ cert number)

---

# SECTION C — COLLECTION

## C1. Collection Overview (Portfolio)
- **Total collection value** (large), cost basis, total gain/loss (% + $)
- Value-over-time chart (selectable ranges)
- Quick stats: # cards, # graded, # sealed, # sets
- Filter/sort bar: game, set, grade, value, date, artist
- Grid/list toggle of cards (thumbnail, name, grade chip, value)
- Empty state: "Scan your first card" CTA
- *Gating:* Free = capped item count; Plus/Pro = unlimited + advanced analytics

## C2. Card Detail
- Hero image (front/back, zoomable, defect overlay if graded)
- Name, set, number, rarity, variant, language
- Grade + cert (if graded), or predicted grade (if raw)
- Current market value + price history chart
- Your data: purchase price, date, P/L, quantity, tags, notes
- Marketplace comps / last-sold list
- Actions: Edit, Re-grade, Set price alert, Add to wishlist, Sell/Remove, Share

## C3. Set / Master Set View
- Set header art, completion % (visual progress)
- "X of Y collected" checklist grid (owned highlighted, missing greyed)
- Set value (owned vs full set)
- Filter: owned / missing / by rarity

## C4. Sealed Products
- Boxes, ETBs, packs with market value + value-over-time
- Sealed vs opened tracking
- Add sealed product flow

## C5. Wishlist / Want List
- Cards you want with target price
- Price-drop alerts toggle
- Estimated cost to complete

## C6. Grading Submission Tracker
- List of submissions: service, date sent, status, cards, fees
- Status pipeline (Received → Grading → QA → Shipped)
- **Your real gem rate** (10s) vs predicted — accuracy stats
- Outcome logging when grades return (feeds prediction trust)
- Add submission flow
- *Gating:* Plus+

## C7. Add Card Manually
- Search database by game/set/number/name
- Variant disambiguation
- Barcode/set-symbol scan option
- Same detail fields as B7

---

# SECTION D — INSIGHTS

## D1. Insights Dashboard
- Portfolio performance: best/worst performers
- Allocation breakdown (by game, set, grade)
- Gem-rate trend
- Value milestones / goals progress
- *Gating:* Plus+ (deep analytics Pro)

## D2. Grading Plays (signature feature)
- Feed of undervalued raw cards with strong grade-up ROI **right now**
- Each card: raw price, predicted grade, projected net profit, confidence
- Filters: game, budget, ROI threshold
- Tap → ROI breakdown
- *Gating:* Pro (or limited preview on Plus)

## D3. Price Alerts
- List of active alerts (card, target, current, direction)
- Create/edit/delete alert
- Triggered-alert history

## D4. Goals
- Set goals: target collection value or set completion
- Progress visualization + projected date
- Celebrate milestone states

---

# SECTION E — SOCIAL / SHOWCASE (growth)

## E1. Public Profile / Showcase
- Avatar, username, bio, collection highlights
- Showcase shelf of featured cards
- Total value (privacy toggle to hide $)
- Follow / followers count

## E2. Community Feed
- Followed collectors' grades, pulls, milestones
- Like / comment / share
- "Share my grade result" cards

## E3. Leaderboards
- Top collections, best gem rates, biggest pulls (opt-in)

> Section E is a later phase — design the profile shell now, defer the feed/leaderboard.

---

# SECTION F — PROFILE & SETTINGS

## F1. Profile Home
- Avatar, name, member tier badge
- Quick stats (collection value, cards, gem rate)
- Links: My Showcase, Goals, Submissions
- Settings entry

## F2. Subscription Management
- Current plan + renewal date
- Upgrade/downgrade, manage in App Store
- Tier comparison
- Restore purchases

## F3. Settings
- Account (email, password, sign out, delete account)
- Preferences: games, services, currency, default grader
- Notifications toggles (price alerts, submissions, social)
- Privacy: hide collection value, public/private profile
- Appearance: light/dark/system
- Data: export CSV / PDF report, iCloud sync status
- Help & support, FAQ, contact
- About, Terms, Privacy, version

## F4. Notifications Center
- Price alert hits, submission updates, social activity, system
- Mark read, clear, deep-link to relevant screen

---

# CROSS-CUTTING STATES (design for every screen)
- **Loading** — skeletons over spinners
- **Empty** — friendly illustration + primary CTA
- **Error** — retry + support path (esp. scan failures, no card identified)
- **Offline** — queued scans, cached collection
- **Paywall interstitial** — when a Free user taps a gated feature
- **First-run coach marks** — on Scan and Collection

---

# SUBSCRIPTION TIER MATRIX

| Feature | Free | Plus | Pro |
|---|---|---|---|
| Scans per month | Limited (e.g. 10) | Unlimited | Unlimited |
| Predicted grade | ✓ | ✓ | ✓ |
| Sub-grades + defect overlay | — | ✓ | ✓ |
| Multi-grader comparison | — | ✓ | ✓ |
| ROI / profit breakdown | Basic | ✓ | ✓ (advanced EV) |
| Collection size | Capped | Unlimited | Unlimited |
| Submission tracker + gem rate | — | ✓ | ✓ |
| Insights dashboard | — | ✓ | Full |
| Grading Plays | — | Preview | ✓ |
| Price alerts | 1 | Several | Unlimited |
| Export reports | — | ✓ | ✓ |
| Priority / new graders early | — | — | ✓ |

---

# BUILD PRIORITY (for UI design order)
1. Auth + onboarding + paywall (A)
2. Scan flow + grade results (B1–B4)
3. Collection overview + card detail (C1–C2)
4. ROI + multi-grader (B5–B6)
5. Submission tracker + sets (C3, C6)
6. Insights + Grading Plays (D)
7. Profile + settings (F)
8. Social shell (E)
