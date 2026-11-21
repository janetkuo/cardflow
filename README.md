# CardFlow - Smart Credit Card & Loyalty Tracker

A mobile-first, offline-capable, privacy-focused Progressive Web App (PWA) for tracking US credit card statement credits, annual fee break-even utilization, Free Night Certificates (FNCs), Chase 5/24 status, and spend category recommendations. Styled consistently with **[PocketFlow](https://github.com/janetkuo/pocketflow)** and optimized for foldable phones (such as Google Pixel 10 Pro Fold), mobile devices, and desktop browsers.

---

## 🌟 Key Highlights

- **100% Private & Zero-Backend**: No login required, zero card numbers or banking credentials stored. All portfolio selections, dates, retention notes, claims, and FNCs stay locally in `localStorage` or in your own personal Google Drive.
- **Pre-loaded with 12 US Cards (6 Business + 6 Personal)**:
  1. Marriott Bonvoy Brilliant™ American Express®
  2. American Express® Business Gold
  3. The Business Platinum Card® from American Express
  4. Capital One Venture X
  5. Chase Sapphire Preferred (CSP)
  6. Chase IHG Rewards Premier
  7. Chase Freedom Unlimited (CFU)
  8. Chase Ink Business Cash (CIC)
  9. Blue Business® Plus Credit Card (BBP)
  10. Amex EveryDay® Credit Card
  11. Blue Business Cash™ Card (BBC)
  12. Chase Ink Business Unlimited (CIU)
- **Periodic Statement Credits & Net Effective Annual Fee**: Tracks Monthly ($77.95/mo), Quarterly ($115/qtr), Semi-Annual ($325/half), and Annual ($1,139/yr) statement credits — totaling **$3,184.40/yr** across the preset library, with Timeline vs. Pure Cadence view modes, Skip-this-cycle, and Permanent Mute controls.
- **Loyalty Status, Auto-FNC & Chase 5/24**: Tracks Marriott/IHG/Hilton/Hertz tiers, automatically derives annual Marriott 85k and IHG 50k certificates from your renewal month, and calculates Chase 5/24 drop-off countdowns.
- **"Which Card to Swipe?" Spend Advisor**: Domestic & Overseas (`0% FTF` priority & FTF trap alerts) recommendations across Dining, Groceries, Flights, Hotels, Gas & Transit, Office/Telecom, and Catch-All spend, plus Duplicate Perk Overlap optimization.
- **Google Drive Cloud Sync (Memory-Only OAuth)**: 1-click backup/restore via the minimal `drive.file` scope with in-memory token storage (never persisted to `localStorage`) and debounced background auto-sync.
- **Offline PWA & Morandi Design System**: Prebuilt static Tailwind v4 CSS (`styles.css`), Service Worker asset caching (`sw.js`), Light/Dark mode, 6 Morandi palettes, and full English (`en`) / Traditional Chinese (`zh-TW`) localization.

---

## 🏗️ Architecture Overview

CardFlow uses **14 Native ES Modules** arranged as an acyclic dependency graph with unified `[data-action]` event delegation (zero runtime bundlers, zero inline DOM `onclick` attributes, and zero global `window` function bridge):

```
index.html + styles.css + sw.js
 └── js/main.js             (Entry point, modal bindings, [data-action] click/keyboard delegation, SW auto-update)
      └── js/app-shell.js   (renderAllViews orchestration, theme/palette/i18n, tab routing, jump links)
           ├── js/view-credits.js   (Timeline/Cadence filters, claim/skip/mute, reset month, Net Effective AF)
           ├── js/view-cards.js     (Portfolio filter/search, compact/detailed cards, renewal alerts)
           ├── js/view-loyalty.js   (FNC tracker, elite tier cards, data-driven transfer cheat sheet)
           ├── js/view-advisor.js   (SVG donut chart, Chase 5/24, overlap optimizer, spend advisor)
           └── js/view-modals.js    (Manage Cards checklist, Card Date & retention modal, Annual breakdown)
                └── Core Layer: js/logic.js · js/drive.js · js/ui-core.js · js/state.js · js/data.js · js/i18n.js · js/palettes.js
```

---

## 🚀 Quick Start

Serve CardFlow locally with Python's built-in HTTP server:

```bash
cd cardflow
python3 -m http.server 8080 --bind 0.0.0.0
```

Open `http://localhost:8080` in your browser.

---

## 🎨 Rebuilding Static Tailwind CSS (Optional)

Runtime `cdn.tailwindcss.com` is not used so the PWA works reliably offline. If you add or modify Tailwind utility classes in `index.html` or `js/*.js`, rebuild `styles.css` from `src/input.css`:

```bash
npx @tailwindcss/cli -i src/input.css -o styles.css --minify
```

Gate `[2/7]` in `verify.py` automatically flags any static or template utility class missing from `styles.css`.

---

## 🧪 Verification & E2E Testing

### 1. Local 7-Gate Verification Suite

```bash
python3 verify.py
```

1. **ES Module Graph & Syntax**: Validates all 14 ES modules and `sw.js` in JavaScriptCore (`osascript`) / Node fallback.
2. **DOM, Event Delegation, CSS Drift & PWA Assets**: Verifies DOM IDs, zero inline `on*` handlers, zero `window` bridge globals, `[data-action]` handler registration, `styles.css` coverage, and `sw.js` / `manifest.json` assets.
3. **Bilingual Dictionary Symmetry**: Confirms `en` and `zh-TW` parity in `js/i18n.js` and validates every `t(...)` key reference.
4. **Card Portfolio Completeness**: Verifies all 12 preset cards and 6 Business / 6 Personal classifications.
5. **Privacy Guardrails**: Scans source and test files for local paths, private emails, or hardcoded personal dates.
6. **Data Schema & Foreign Keys**: Validates preset credits, cards, duplicate perk groups, and advisor rules.
7. **Business Logic Invariants & Time-Travel Simulation**: Runs annual value conservation (`$3,184.40/yr`), 12-month expiration & reset simulation, Chase 5/24 & Auto-FNC boundary tests, Native ESM boot + delegation dispatch, and async Google Drive mock tests (when Node is present).

### 2. Playwright Browser E2E Suite & CI

[`.github/workflows/verify.yml`](.github/workflows/verify.yml) runs `python3 verify.py` (`verify` job) followed by [`tests/e2e_smoke.mjs`](tests/e2e_smoke.mjs) in headless Chromium (`e2e` job):
- Immediate initial render & static CSS application
- Demo Starter Pack, credit claim/skip/unskip, mute/unmute, and Reset Month confirm dialog
- Compact mode, card search, Card Date & retention XSS escaping, Chase 5/24 & Auto-FNC sync, and JSON backup import
- Bilingual & dark-mode toggles, keyboard `[data-action]` / `Escape` modal controls
- `375×812` mobile/folded viewport zero horizontal overflow & bottom navigation
- Active Service Worker registration and offline reload (`context.setOffline(true)`)
