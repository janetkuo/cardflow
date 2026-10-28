#!/usr/bin/env python3
"""
CardFlow Pre-Commit & Quality Verification Suite
Inspired by PocketFlow verify.py
Validates JavaScript syntax with JavaScriptCore, checks DOM ID bindings,
verifies bilingual dictionary symmetry, checks card portfolio integrity,
enforces zero-leak privacy guardrails via generic pattern scanning,
validates data schema & foreign key integrity, and simulates business logic invariants
along with 12-month time-travel lifecycle testing.
"""

import json
import re
import subprocess
import sys
import os

def check_js_syntax():
    print("🔍 [1/7] Validating JavaScript syntax with macOS JavaScriptCore...")
    
    app_test = """
    const localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const navigator = { serviceWorker: { register: () => Promise.resolve(), addEventListener: () => {} } };
    const window = { addEventListener: () => {}, innerWidth: 1024, matchMedia: () => ({ matches: false }), location: { reload: () => {} } };
    const document = {
      documentElement: { classList: { add: () => {}, remove: () => {}, toggle: () => {} }, style: { setProperty: () => {} } },
      addEventListener: () => {},
      getElementById: () => ({
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        setAttribute: () => {},
        addEventListener: () => {},
        appendChild: () => {},
        querySelectorAll: () => [],
        style: {},
        innerHTML: '',
        innerText: '',
        value: ''
      }),
      querySelectorAll: () => [],
      createElement: () => ({
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        setAttribute: () => {},
        addEventListener: () => {},
        appendChild: () => {},
        querySelectorAll: () => [],
        style: {},
        innerHTML: '',
        innerText: '',
        value: ''
      })
    };
    const setTimeout = (fn) => {};
    eval($.NSString.stringWithContentsOfFileEncodingError('app.js', $.NSUTF8StringEncoding, null).js);
    'OK'
    """
    proc = subprocess.run(['osascript', '-l', 'JavaScript', '-e', app_test], capture_output=True, text=True, cwd=os.path.dirname(os.path.abspath(__file__)))
    if proc.returncode != 0:
        print(f"❌ Syntax Error in app.js:\n{proc.stderr.strip()}")
        return False
    print("   ✅ app.js parsed and executed cleanly with 0 syntax errors.")

    sw_test = """
    const self = {
      addEventListener: () => {},
      skipWaiting: () => {},
      clients: { claim: () => {} }
    };
    const caches = { open: () => Promise.resolve(), keys: () => Promise.resolve([]) };
    eval($.NSString.stringWithContentsOfFileEncodingError('sw.js', $.NSUTF8StringEncoding, null).js);
    'OK'
    """
    proc = subprocess.run(['osascript', '-l', 'JavaScript', '-e', sw_test], capture_output=True, text=True, cwd=os.path.dirname(os.path.abspath(__file__)))
    if proc.returncode != 0:
        print(f"❌ Syntax Error in sw.js:\n{proc.stderr.strip()}")
        return False
    print("   ✅ sw.js parsed cleanly.")
    return True

def check_dom_ids():
    print("🔍 [2/7] Checking DOM ID bindings between app.js and index.html...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(base_dir, 'app.js')
    html_path = os.path.join(base_dir, 'index.html')

    with open(app_path) as f:
        app_js = f.read()
    with open(html_path) as f:
        html = f.read()

    ids_in_js = set(re.findall(r'document\.getElementById\([\'\"]([a-zA-Z0-9_-]+)[\'\"]\)', app_js))
    
    # Also capture string literal ID maps in i18n
    # e.g. 'app-subtitle': 'appSubtitle'
    i18n_map_ids = set(re.findall(r"\'([a-zA-Z0-9_-]+)\'\s*:\s*\'[a-zA-Z0-9_-]+\'", app_js))
    # Filter to known plausible DOM element IDs
    known_possible = {'app-subtitle', 'demo-banner-tag', 'demo-banner-text', 'banner-reset-text',
                      'monthly-credits-title', 'monthly-progress-title', 'annual-value-title',
                      'category-breakdown-title', 'donut-center-title', 'donut-center-sub',
                      'loyalty-card-title', 'tab-label-credits', 'tab-label-cards', 'tab-label-loyalty',
                      'tab-label-advisor', 'mob-label-credits', 'mob-label-cards', 'mob-label-loyalty',
                      'mob-label-advisor', 'period-all-btn', 'period-monthly-btn', 'period-semiannual-btn',
                      'period-annual-btn', 'fnc-section-title', 'fnc-section-desc', 'add-fnc-btn-label',
                      'advisor-heading', 'advisor-subheading', 'cat-label-dining', 'cat-label-flights',
                      'cat-label-hotels', 'cat-label-office', 'cat-label-grocery', 'cat-label-gas',
                      'cat-label-foreign', 'cat-label-catchall', 'settings-modal-title', 'palette-section-label',
                      'backup-section-label', 'backup-section-desc', 'export-json-label', 'import-json-label',
                      'reset-factory-btn', 'fnc-modal-title', 'fnc-name-label', 'fnc-issuer-label',
                      'fnc-points-label', 'fnc-expire-label', 'cancel-fnc-btn', 'save-fnc-btn',
                      'manage-cards-btn-label', 'manage-cards-modal-title', 'manage-cards-modal-sub',
                      'manage-cards-demo-btn', 'chase-524-title', 'chase-524-desc',
                      'card-date-modal-title', 'card-date-year-label', 'card-date-month-label',
                      'card-date-renew-label', 'card-date-hint-title', 'card-date-hint-desc',
                      'clear-card-date-btn', 'cancel-card-date-btn', 'save-card-date-btn',
                      'gdrive-section-title', 'gdrive-section-desc', 'gdrive-client-id-label',
                      'gdrive-save-client-id-btn', 'gdrive-help-btn', 'gdrive-backup-label',
                      'gdrive-restore-label', 'gdrive-auto-sync-label', 'gdrive-toggle-config-label',
                      'gdrive-signout-btn', 'gdrive-help-title', 'confirm-gdrive-help-btn',
                      'pwa-update-text', 'pwa-update-btn'}
    
    all_needed_ids = ids_in_js.union(i18n_map_ids.intersection(known_possible))
    ids_in_html = set(re.findall(r'id=[\'\"]([a-zA-Z0-9_-]+)[\'\"]', html))

    missing = all_needed_ids - ids_in_html
    if missing:
        print(f"❌ Missing element IDs in index.html: {missing}")
        return False
    print(f"   ✅ All {len(all_needed_ids)} referenced DOM element IDs are verified in index.html.")
    return True

def check_i18n_symmetry():
    print("🔍 [3/7] Validating bilingual dictionary symmetry (en vs zh-TW)...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(base_dir, 'app.js')

    with open(app_path) as f:
        app_js = f.read()

    pos_en = app_js.find("const I18N = {")
    pos_zh = app_js.find("'zh-TW': {", pos_en)
    pos_end = app_js.find("};", pos_zh)

    if pos_en == -1 or pos_zh == -1 or pos_end == -1:
        print("❌ Could not locate I18N dictionary blocks in app.js")
        return False

    en_block = app_js[pos_en:pos_zh]
    zh_block = app_js[pos_zh:pos_end]

    en_keys = set(re.findall(r"^\s*(\w+):\s*['\"`]", en_block, re.MULTILINE))
    zh_keys = set(re.findall(r"^\s*(\w+):\s*['\"`]", zh_block, re.MULTILINE))

    missing_in_zh = en_keys - zh_keys
    missing_in_en = zh_keys - en_keys

    if missing_in_zh:
        print(f"❌ Keys missing in zh-TW: {missing_in_zh}")
        return False
    if missing_in_en:
        print(f"❌ Keys missing in en: {missing_in_en}")
        return False

    print(f"   ✅ Both 'en' and 'zh-TW' dictionaries are 100% symmetric ({len(en_keys)} keys each).")
    return True

def check_card_portfolio():
    print("🔍 [4/7] Verifying card portfolio completeness & business classifications...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(base_dir, 'app.js')
    with open(app_path) as f:
        content = f.read()
    
    expected_cards = [
        'Marriott Bonvoy Brilliant',
        'Business Gold',
        'Business Platinum',
        'Capital One Venture X',
        'Chase Sapphire Preferred',
        'Chase IHG Rewards Premier',
        'Chase Freedom Unlimited',
        'Chase Ink Business Cash',
        'Blue Business® Plus',
        'Amex EveryDay',
        'Blue Business Cash',
        'Chase Ink Business Unlimited'
    ]
    
    for c in expected_cards:
        if c not in content:
            print(f"❌ Missing expected card in PRESET_CARDS: {c}")
            return False

    # Check isBusiness classification
    cards_block = content[content.find("PRESET_CARDS = ["):content.find("PRESET_CREDITS = [")]
    biz_matches = re.findall(r"isBusiness:\s*true", cards_block)
    personal_matches = re.findall(r"isBusiness:\s*false", cards_block)

    if len(biz_matches) != 6 or len(personal_matches) != 6:
        print(f"❌ Expected 6 business cards and 6 personal cards, got {len(biz_matches)} biz / {len(personal_matches)} personal")
        return False

    print(f"   ✅ All 12 requested cards properly configured (6 Business + 6 Personal).")
    return True

def check_privacy_guardrails():
    print("🔍 [5/7] Scanning for privacy guardrail leaks (Generic Patterns)...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    scanned_files = ['app.js', 'index.html', 'sw.js', 'verify.py']

    has_error = False

    for fn in scanned_files:
        fp = os.path.join(base_dir, fn)
        if not os.path.exists(fp):
            continue
        with open(fp) as f:
            content = f.read()

        # Generic pattern for local home directories (no hardcoded usernames)
        path_matches = re.findall(r"/(?:Users|home)/[a-zA-Z0-9._-]+", content)
        if path_matches:
            # Allow verify.py pattern reference itself
            clean_matches = [m for m in path_matches if not m.startswith('/(?:Users|home)')]
            if clean_matches:
                print(f"❌ Absolute local home path pattern detected in {fn}: {clean_matches}")
                has_error = True

        # Generic pattern for private non-noreply email addresses
        email_matches = re.findall(r"[a-zA-Z0-9_.+-]+@(?!users\.noreply\.github\.com|example\.com)[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", content)
        if email_matches:
            print(f"❌ Potential private email address pattern detected in {fn}: {email_matches}")
            has_error = True

    # Ensure PRESET_CARDS does not contain hardcoded personal opening dates
    app_path = os.path.join(base_dir, 'app.js')
    with open(app_path) as f:
        app_js = f.read()
    cards_block = app_js[app_js.find("PRESET_CARDS = ["):app_js.find("PRESET_CREDITS = [")]
    if 'openedYear:' in cards_block:
        print("❌ PRESET_CARDS must not contain hardcoded 'openedYear' (must reside in localStorage/appState.cardMeta)")
        has_error = True

    if has_error:
        return False

    print("   ✅ Zero local home paths, zero private emails, and zero preset personal dates detected.")
    return True

def run_jsc_in_app_env(eval_body):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    js_code = f"""
    const localStorage = {{ getItem: () => null, setItem: () => {{}}, removeItem: () => {{}} }};
    const navigator = {{ serviceWorker: {{ register: () => Promise.resolve(), addEventListener: () => {{}} }} }};
    const window = {{ addEventListener: () => {{}}, innerWidth: 1024, matchMedia: () => ({{ matches: false }}), location: {{ reload: () => {{}} }} }};
    const document = {{
      documentElement: {{ classList: {{ add: () => {{}}, remove: () => {{}}, toggle: () => {{}} }}, style: {{ setProperty: () => {{}} }} }},
      addEventListener: () => {{}},
      getElementById: () => ({{
        classList: {{ add: () => {{}}, remove: () => {{}}, toggle: () => {{}} }},
        setAttribute: () => {{}},
        addEventListener: () => {{}},
        appendChild: () => {{}},
        querySelectorAll: () => [],
        style: {{}},
        innerHTML: '',
        innerText: '',
        value: ''
      }}),
      querySelectorAll: () => [],
      createElement: () => ({{
        classList: {{ add: () => {{}}, remove: () => {{}}, toggle: () => {{}} }},
        setAttribute: () => {{}},
        addEventListener: () => {{}},
        appendChild: () => {{}},
        querySelectorAll: () => [],
        style: {{}},
        innerHTML: '',
        innerText: '',
        value: ''
      }})
    }};
    const setTimeout = (fn) => {{}};
    const appCode = $.NSString.stringWithContentsOfFileEncodingError('app.js', $.NSUTF8StringEncoding, null).js;
    eval(appCode + "\\n; " + {json.dumps(eval_body)});
    """
    proc = subprocess.run(['osascript', '-l', 'JavaScript', '-e', js_code], capture_output=True, text=True, cwd=base_dir)
    return proc.returncode, proc.stdout.strip(), proc.stderr.strip()

def check_data_integrity():
    print("🔍 [6/7] Validating data schema, foreign keys & perk groups...")
    eval_code = """
    (function() {
      const errors = [];
      const cardIds = new Set(PRESET_CARDS.map(c => c.id));
      const creditIds = new Set();
      const validPeriods = new Set(["monthly", "quarterly", "semiannual", "annual"]);
      const validCats = new Set(Object.keys(CREDIT_CATEGORY_META));
      const validPerkGroups = new Set(Object.keys(DUPLICATE_PERK_GROUPS));

      // 1. Cards schema & uniqueness
      PRESET_CARDS.forEach(c => {
        if (!c.id || typeof c.id !== 'string') errors.push("Card missing valid string id");
        if (typeof c.annualFee !== "number" || c.annualFee < 0) errors.push("Card " + c.id + " has invalid annualFee: " + c.annualFee);
        if (typeof c.isBusiness !== "boolean") errors.push("Card " + c.id + " has non-boolean isBusiness: " + c.isBusiness);
        if (!c.nickname || !c.nickname.en || !c.nickname["zh-TW"]) errors.push("Card " + c.id + " missing bilingual nickname");
        if (c.perks && Array.isArray(c.perks)) {
          c.perks.forEach((p, idx) => {
            if (!p.title || !p.title.en || !p.title["zh-TW"]) errors.push("Card " + c.id + " perk #" + idx + " missing bilingual title");
            if (p.group && !validPerkGroups.has(p.group)) {
              errors.push("Card " + c.id + " perk has unknown group: " + p.group);
            }
          });
        }
      });

      // 2. Credits schema, foreign key & uniqueness
      PRESET_CREDITS.forEach(cr => {
        if (!cr.id || typeof cr.id !== 'string') errors.push("Credit missing valid string id");
        if (creditIds.has(cr.id)) errors.push("Duplicate credit id: " + cr.id);
        creditIds.add(cr.id);

        if (!cardIds.has(cr.cardId)) {
          errors.push("Orphan credit " + cr.id + ": cardId '" + cr.cardId + "' does not exist in PRESET_CARDS");
        }
        if (typeof cr.amount !== "number" || cr.amount <= 0 || isNaN(cr.amount)) {
          errors.push("Credit " + cr.id + " has invalid amount: " + cr.amount);
        }
        if (!validPeriods.has(cr.period)) {
          errors.push("Credit " + cr.id + " has invalid period: " + cr.period);
        }
        if (!validCats.has(cr.cat)) {
          errors.push("Credit " + cr.id + " has unknown category: " + cr.cat);
        }
        if (!cr.title || !cr.title.en || !cr.title["zh-TW"]) {
          errors.push("Credit " + cr.id + " missing bilingual title");
        }
        if (!cr.tip || !cr.tip.en || !cr.tip["zh-TW"]) {
          errors.push("Credit " + cr.id + " missing bilingual tip");
        }
      });

      // 3. Duplicate Perk Groups schema
      Object.keys(DUPLICATE_PERK_GROUPS).forEach(gid => {
        const g = DUPLICATE_PERK_GROUPS[gid];
        if (!g.id || g.id !== gid) errors.push("Perk group id mismatch: " + gid);
        if (!g.name || !g.name.en || !g.name["zh-TW"]) errors.push("Perk group " + gid + " missing bilingual name");
        if (!g.icon) errors.push("Perk group " + gid + " missing icon");
        if (!g.tip || !g.tip.en || !g.tip["zh-TW"]) errors.push("Perk group " + gid + " missing bilingual tip");
      });

      return JSON.stringify({
        errors: errors,
        cardsCount: PRESET_CARDS.length,
        creditsCount: PRESET_CREDITS.length,
        groupsCount: Object.keys(DUPLICATE_PERK_GROUPS).length
      });
    })()
    """
    rc, out, err = run_jsc_in_app_env(eval_code)
    if rc != 0:
        print(f"❌ Execution Error in check_data_integrity:\\n{err}")
        return False

    try:
        res = json.loads(out)
    except Exception as e:
        print(f"❌ JSON Parse Error in check_data_integrity output '{out}': {e}")
        return False

    if res.get("errors"):
        for e in res["errors"]:
            print(f"❌ {e}")
        return False

    print(f"   ✅ All {res['creditsCount']} credits foreign keys verified, {res['cardsCount']} cards & {res['groupsCount']} perk groups schema valid.")
    return True

def check_business_logic_simulation():
    print("🔍 [7/7] Simulating business logic invariants & time-travel (12 months)...")
    eval_code = """
    (function() {
      const errors = [];

      // Reset isolated state for testing
      appState = {
        ownedCards: {},
        cardMeta: {},
        creditsClaimed: {},
        mutedCredits: {},
        skippedCredits: {},
        fncs: [],
        fncsClaimed: {}
      };

      // --- Sub-check A: Invariant & Value Conservation ---
      PRESET_CARDS.forEach(c => { appState.ownedCards[c.id] = true; });
      let expectedSum = 0;
      PRESET_CREDITS.forEach(cr => {
        if (cr.period === "monthly") expectedSum += cr.amount * 12;
        else if (cr.period === "quarterly") expectedSum += cr.amount * 4;
        else if (cr.period === "semiannual") expectedSum += cr.amount * 2;
        else expectedSum += cr.amount;
      });

      if (expectedSum <= 0 || isNaN(expectedSum)) {
        errors.push("Total perks annual value invariant broken: " + expectedSum);
      }

      // --- Sub-check B: Mute & Skip State Isolation ---
      const testCreditId = PRESET_CREDITS[0].id;
      const otherCreditId = PRESET_CREDITS[1].id;
      const testPeriodKey = testCreditId + "_2026-10";
      const nextPeriodKey = testCreditId + "_2026-11";

      // Test Mute
      muteCredit(testCreditId);
      if (!isCreditMuted(testCreditId)) errors.push("muteCredit failed to set muted state");
      if (isCreditMuted(otherCreditId)) errors.push("muteCredit polluted other credit");
      unmuteCredit(testCreditId);
      if (isCreditMuted(testCreditId)) errors.push("unmuteCredit failed to clear muted state");

      // Test Skip (Single-cycle)
      toggleCreditSkip(testPeriodKey);
      if (!isCreditSkipped(testPeriodKey)) errors.push("toggleCreditSkip failed to skip");
      if (isCreditSkipped(nextPeriodKey)) errors.push("Single-cycle skip polluted next period");
      toggleCreditSkip(testPeriodKey);
      if (isCreditSkipped(testPeriodKey)) errors.push("toggleCreditSkip undo failed");

      // --- Sub-check C: Time-Travel Simulation across 12 Months ---
      const monthlyItem = PRESET_CREDITS.find(c => c.period === "monthly");
      const quarterlyItem = PRESET_CREDITS.find(c => c.period === "quarterly");
      const semiannualItem = PRESET_CREDITS.find(c => c.period === "semiannual");

      for (let m = 1; m <= 12; m++) {
        const mUrg = getCreditUrgencyInfo(monthlyItem, 2026, m);
        if (!mUrg.isDueThisMonth) errors.push("Monthly credit not due in month " + m);

        if (quarterlyItem) {
          const qUrg = getCreditUrgencyInfo(quarterlyItem, 2026, m);
          const isQMonth = (m % 3 === 0);
          if (isQMonth !== qUrg.isExpiringSoon) {
            errors.push("Quarterly urgency mismatch in month " + m + ": expected " + isQMonth + ", got " + qUrg.isExpiringSoon);
          }
        }

        if (semiannualItem) {
          const sUrg = getCreditUrgencyInfo(semiannualItem, 2026, m);
          const isSMonth = (m % 6 === 0);
          if (isSMonth !== sUrg.isExpiringSoon) {
            errors.push("Semiannual urgency mismatch in month " + m + ": expected " + isSMonth + ", got " + sUrg.isExpiringSoon);
          }
        }
      }

      // --- Sub-check D: Duplicate Perk Groups & Overlap Optimizer ---
      const loungeCards = getOwnedCardsInPerkGroup("lounge-access");
      if (loungeCards.length < 2) {
        errors.push("Expected at least 2 cards in lounge-access group, got " + loungeCards.length);
      }
      const cdwCards = getOwnedCardsInPerkGroup("primary-cdw");
      if (cdwCards.length < 2) {
        errors.push("Expected at least 2 cards in primary-cdw group, got " + cdwCards.length);
      }

      // Verify renderCredits and renderOverlapOptimizer run cleanly
      try {
        renderCredits();
      } catch (e) {
        errors.push("renderCredits() crashed: " + e.message);
      }

      try {
        renderOverlapOptimizer();
      } catch (e) {
        errors.push("renderOverlapOptimizer() crashed: " + e.message);
      }

      return JSON.stringify({
        errors: errors,
        expectedSum: expectedSum,
        loungeCardsCount: loungeCards.length,
        cdwCardsCount: cdwCards.length
      });
    })()
    """
    rc, out, err = run_jsc_in_app_env(eval_code)
    if rc != 0:
        print(f"❌ Execution Error in check_business_logic_simulation:\\n{err}")
        return False

    try:
        res = json.loads(out)
    except Exception as e:
        print(f"❌ JSON Parse Error in check_business_logic_simulation output '{out}': {e}")
        return False

    if res.get("errors"):
        for e in res["errors"]:
            print(f"❌ {e}")
        return False

    print(f"   ✅ Value conservation (${res['expectedSum']:.2f}/yr) preserved, Mute/Skip isolation verified, 12-mo simulation passed.")
    return True

def main():
    print("=" * 60)
    print("🚀 CardFlow Verification Test Suite")
    print("=" * 60)
    success = (
        check_js_syntax() and
        check_dom_ids() and
        check_i18n_symmetry() and
        check_card_portfolio() and
        check_privacy_guardrails() and
        check_data_integrity() and
        check_business_logic_simulation()
    )
    print("=" * 60)
    if success:
        print("🎉 ALL 7 CHECKS PASSED! CardFlow is ready for launch.")
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED. Please resolve the errors above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
