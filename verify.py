#!/usr/bin/env python3
"""
CardFlow Pre-Commit & Quality Verification Suite
Inspired by PocketFlow verify.py
Validates JavaScript syntax with JavaScriptCore, checks DOM ID bindings,
verifies bilingual dictionary symmetry, checks card portfolio integrity,
and enforces zero-leak privacy guardrails via generic pattern scanning.
"""

import re
import subprocess
import sys
import os

def check_js_syntax():
    print("🔍 [1/5] Validating JavaScript syntax with macOS JavaScriptCore...")
    
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
    print("🔍 [2/5] Checking DOM ID bindings between app.js and index.html...")
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
    print("🔍 [3/5] Validating bilingual dictionary symmetry (en vs zh-TW)...")
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

    en_keys = set(re.findall(r"(\w+):\s*['\"`]", en_block))
    zh_keys = set(re.findall(r"(\w+):\s*['\"`]", zh_block))

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
    print("🔍 [4/5] Verifying card portfolio completeness & business classifications...")
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
    print("🔍 [5/5] Scanning for privacy guardrail leaks (Generic Patterns)...")
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

def main():
    print("=" * 60)
    print("🚀 CardFlow Verification Test Suite")
    print("=" * 60)
    success = (
        check_js_syntax() and
        check_dom_ids() and
        check_i18n_symmetry() and
        check_card_portfolio() and
        check_privacy_guardrails()
    )
    print("=" * 60)
    if success:
        print("🎉 ALL 5 CHECKS PASSED! CardFlow is ready for launch.")
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED. Please resolve the errors above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
