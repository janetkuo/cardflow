# CardFlow - Smart Credit Card & Loyalty Tracker

A mobile-first, privacy-focused Progressive Web App (PWA) credit card and loyalty tracker styled consistently with **[PocketFlow](https://github.com/janetkuo/pocketflow)**. Optimized for dual-pane screens (Google Pixel 10 Pro Fold) and desktop browsers.

---

## 🌟 Key Highlights

- **100% Private & Client-side**: Zero-login, no banking credentials or real card numbers stored. All claims, FNCs, and settings stay in `localStorage`.
- **Pre-loaded with 12 US Powerhouse Cards**:
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
- **Periodic Statement Credits Tracker**: Monthly ($77.95), Semi-Annual (FHR $300, TravelBank $25), Quarterly (IHG F&B $25, Indeed $90), Annual ($1,139).
- **Elite Loyalty Tiers & FNCs**: Marriott Platinum, IHG Platinum (4th Night Free), Hilton Gold, Hertz President's Circle. Automatic countdown alerts for Marriott 85k and IHG 40k certificates.
- **"Which Card to Swipe?" Decision Engine**: Instant category recommendations (Dining, Flights, Hotels, Office 5x, Groceries, Gas, Overseas No FTF, Non-category 2x).
- **Google Drive Cloud Backup & Auto-Sync**: 1-click private backup & restore directly via Google Drive API (`drive.file` minimal scope) + automatic background sync on status changes.
- **Dual-Pane / Single-Pane Ergonomic Layout**: Dual-pane mode on $\ge 1024$px; clean single-column mode on mobile with bottom navigation bar and floating action button.
- **Morandi Design System**: Seamless Light/Dark theme toggle and Morandi palette switcher (`Mint Sage`, `Ocean Teal`, `Warm Terracotta`).
- **Bilingual Localization (i18n)**: English (`en`) and Traditional Chinese (`zh-TW`).

---

## 🚀 Quick Start

Run CardFlow with Python's built-in HTTP server:

```bash
cd cardflow
python3 -m http.server 8080 --bind 0.0.0.0
```

Open `http://localhost:8080` in your browser.

---

## 🧪 Verification Quality Gate

```bash
python3 verify.py
```
Validates JavaScriptCore syntax, verifies all DOM element IDs, and checks data completeness.
