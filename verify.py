#!/usr/bin/env python3
"""
CardFlow Pre-Commit & Quality Verification Suite
Inspired by PocketFlow verify.py
Validates JavaScript syntax with JavaScriptCore, checks DOM ID bindings, and verifies data integrity.
"""

import re
import subprocess
import sys
import os

def check_js_syntax():
    print("🔍 [1/3] Validating JavaScript syntax with macOS JavaScriptCore...")
    
    app_test = """
    const localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    const navigator = { serviceWorker: { register: () => Promise.resolve(), addEventListener: () => {} } };
    const window = { addEventListener: () => {}, innerWidth: 1024, matchMedia: () => ({ matches: false }) };
    const document = {
      documentElement: { classList: { add: () => {}, remove: () => {}, toggle: () => {} }, style: { setProperty: () => {} } },
      addEventListener: () => {},
      getElementById: () => ({
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        setAttribute: () => {},
        addEventListener: () => {},
        style: {}
      }),
      querySelectorAll: () => []
    };
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
    print("🔍 [2/3] Checking DOM ID bindings between app.js and index.html...")
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
    # Filter to only plausible DOM element IDs
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

def check_card_portfolio():
    print("🔍 [3/3] Verifying card portfolio completeness & data integrity...")
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
    print(f"   ✅ All 12 requested cards are properly configured.")
    return True

def main():
    print("=" * 60)
    print("🚀 CardFlow Verification Test Suite")
    print("=" * 60)
    success = (
        check_js_syntax() and
        check_dom_ids() and
        check_card_portfolio()
    )
    print("=" * 60)
    if success:
        print("🎉 ALL CHECKS PASSED! CardFlow is ready for launch.")
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED. Please resolve the errors above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
