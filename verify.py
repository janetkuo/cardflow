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
import shutil
import subprocess
import sys
import os

def run_js_snippet(js_body, base_dir):
    if shutil.which('osascript'):
        proc = subprocess.run(['osascript', '-l', 'JavaScript', '-e', js_body], capture_output=True, text=True, cwd=base_dir)
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip(), 'osascript'
    if shutil.which('node'):
        node_wrapper = f"""
        const fs = require('fs');
        const __readFile = (p) => fs.readFileSync(p, 'utf8');
        const __res = (() => {{
          {js_body}
        }})();
        if (__res !== undefined) process.stdout.write(String(__res));
        """
        proc = subprocess.run(['node', '-e', node_wrapper], capture_output=True, text=True, cwd=base_dir)
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip(), 'node'
    return 1, '', 'Neither osascript nor node is available to execute JavaScript checks', 'none'

def check_js_syntax():
    print("🔍 [1/7] Validating JavaScript syntax (JavaScriptCore / Node fallback)...")
    base_dir = os.path.dirname(os.path.abspath(__file__))

    read_expr = (
        "$.NSString.stringWithContentsOfFileEncodingError('app.js', $.NSUTF8StringEncoding, null).js"
        if shutil.which('osascript')
        else "__readFile('app.js')"
    )
    sw_read_expr = (
        "$.NSString.stringWithContentsOfFileEncodingError('sw.js', $.NSUTF8StringEncoding, null).js"
        if shutil.which('osascript')
        else "__readFile('sw.js')"
    )

    app_test = f"""
    const localStorage = {{ getItem: () => null, setItem: () => {{}}, removeItem: () => {{}} }};
    const navigator = {{ serviceWorker: {{ register: () => Promise.resolve(), addEventListener: () => {{}} }} }};
    const window = {{ addEventListener: () => {{}}, innerWidth: 1024, matchMedia: () => ({{ matches: false }}), location: {{ reload: () => {{}}, hash: '' }} }};
    const document = {{
      documentElement: {{ classList: {{ add: () => {{}}, remove: () => {{}}, toggle: () => {{}} }}, style: {{ setProperty: () => {{}} }}, lang: 'zh-TW' }},
      addEventListener: () => {{}},
      getElementById: () => ({{
        classList: {{ add: () => {{}}, remove: () => {{}}, toggle: () => {{}}, contains: () => true }},
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
        classList: {{ add: () => {{}}, remove: () => {{}}, toggle: () => {{}}, contains: () => true }},
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
    const clearTimeout = () => {{}};
    eval({read_expr});
    return 'OK';
    """
    if shutil.which('osascript'):
        app_test = app_test.replace("return 'OK';", "'OK';")
    rc, _, err, engine = run_js_snippet(app_test, base_dir)
    if rc != 0:
        print(f"❌ Syntax Error in app.js ({engine}):\n{err}")
        return False
    print(f"   ✅ app.js parsed and executed cleanly with 0 syntax errors ({engine}).")

    sw_test = f"""
    const self = {{
      addEventListener: () => {{}},
      skipWaiting: () => {{}},
      clients: {{ claim: () => {{}} }}
    }};
    const caches = {{ open: () => Promise.resolve(), keys: () => Promise.resolve([]) }};
    eval({sw_read_expr});
    return 'OK';
    """
    if shutil.which('osascript'):
        sw_test = sw_test.replace("return 'OK';", "'OK';")
    rc, _, err, _ = run_js_snippet(sw_test, base_dir)
    if rc != 0:
        print(f"❌ Syntax Error in sw.js:\n{err}")
        return False
    print("   ✅ sw.js parsed cleanly.")
    return True

def check_dom_ids():
    print("🔍 [2/7] Checking DOM bindings, onclick handlers, CSS classes & PWA assets...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(base_dir, 'app.js')
    html_path = os.path.join(base_dir, 'index.html')
    sw_path = os.path.join(base_dir, 'sw.js')
    manifest_path = os.path.join(base_dir, 'manifest.json')

    with open(app_path) as f:
        app_js = f.read()
    with open(html_path) as f:
        html = f.read()

    ids_in_js = set(re.findall(r'document\.getElementById\([\'\"]([a-zA-Z0-9_-]+)[\'\"]\)', app_js))

    # Dynamically extract all DOM IDs mapped inside applyLanguage()'s `const map = { ... }`
    map_match = re.search(r'function applyLanguage\([^)]*\)\s*\{.*?const map\s*=\s*\{(.*?)\};', app_js, re.DOTALL)
    i18n_map_ids = set(re.findall(r"'([a-zA-Z0-9_-]+)'\s*:\s*'[a-zA-Z0-9_-]+'", map_match.group(1))) if map_match else set()

    all_needed_ids = ids_in_js.union(i18n_map_ids)
    ids_in_html = set(re.findall(r'id=[\'\"]([a-zA-Z0-9_-]+)[\'\"]', html))

    missing = all_needed_ids - ids_in_html
    if missing:
        print(f"❌ Missing element IDs in index.html: {missing}")
        return False

    # Check inline onclick="..." function calls exist in app.js
    defined_fns = set(re.findall(r'(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(', app_js))
    missing_onclick = []
    for fname, content in [('index.html', html), ('app.js', app_js)]:
        for m in re.finditer(r'onclick=[\"\']([^\"\']+)[\"\']', content):
            expr = m.group(1)
            for cm in re.finditer(r'(?<![.\w])([a-zA-Z_][a-zA-Z0-9_]*)\s*\(', expr):
                fn_name = cm.group(1)
                if fn_name not in ('if', 'for', 'while', 'switch', 'catch') and fn_name not in defined_fns:
                    missing_onclick.append((fname, fn_name))
    if missing_onclick:
        print(f"❌ Undefined inline onclick handlers detected: {missing_onclick}")
        return False

    # Check for non-existent Tailwind slate-*50 utility classes
    invalid_slate = []
    for fname, content in [('index.html', html), ('app.js', app_js)]:
        hits = re.findall(r'\bslate-(?:650|750|850)\b', content)
        if hits:
            invalid_slate.append((fname, sorted(set(hits))))
    if invalid_slate:
        print(f"❌ Non-existent Tailwind slate-*50 classes detected: {invalid_slate}")
        return False

    # Verify sw.js ASSETS and manifest.json icon files exist on disk
    with open(sw_path) as f:
        sw_js = f.read()
    assets_match = re.search(r'const ASSETS\s*=\s*\[(.*?)\];', sw_js, re.DOTALL)
    sw_assets = re.findall(r"['\"]([^'\"]+)['\"]", assets_match.group(1)) if assets_match else []
    missing_assets = []
    for asset in sw_assets:
        rel = asset[2:] if asset.startswith('./') else asset
        if rel in ('', '/'):
            continue
        if not os.path.exists(os.path.join(base_dir, rel)):
            missing_assets.append(f"sw.js:{asset}")

    with open(manifest_path) as f:
        manifest = json.load(f)
    for icon in manifest.get('icons', []):
        src = icon.get('src', '')
        rel = src[2:] if src.startswith('./') else src
        if rel and not os.path.exists(os.path.join(base_dir, rel)):
            missing_assets.append(f"manifest.json:{src}")

    if missing_assets:
        print(f"❌ Missing PWA asset files on disk: {missing_assets}")
        return False

    if 'user-scalable=no' in html:
        print("❌ Viewport meta tag disables pinch-zoom (user-scalable=no)")
        return False

    print(f"   ✅ {len(all_needed_ids)} DOM IDs, inline onclick handlers, Tailwind classes & {len(sw_assets)} PWA assets verified.")
    return True

def check_i18n_symmetry():
    print("🔍 [3/7] Validating bilingual dictionary symmetry & t() key references...")
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

    # Verify every t('key') call & applyLanguage map key exists in I18N
    t_calls = set(re.findall(r"\bt\(\s*'([a-zA-Z0-9_]+)'\s*\)", app_js))
    map_match = re.search(r'function applyLanguage\([^)]*\)\s*\{.*?const map\s*=\s*\{(.*?)\};', app_js, re.DOTALL)
    map_vals = set(re.findall(r":\s*'([a-zA-Z0-9_]+)'", map_match.group(1))) if map_match else set()
    undefined_keys = (t_calls | map_vals) - en_keys
    if undefined_keys:
        print(f"❌ Referenced i18n keys missing from I18N dictionary: {undefined_keys}")
        return False

    print(f"   ✅ Both 'en' and 'zh-TW' dictionaries are 100% symmetric ({len(en_keys)} keys, {len(t_calls | map_vals)} refs verified).")
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
    read_expr = (
        "$.NSString.stringWithContentsOfFileEncodingError('app.js', $.NSUTF8StringEncoding, null).js"
        if shutil.which('osascript')
        else "__readFile('app.js')"
    )
    return_stmt = "eval(appCode + \"\\n; \" + " + json.dumps(eval_body) + ");"
    if not shutil.which('osascript'):
        return_stmt = "return " + return_stmt

    js_code = f"""
    const storage = {{}};
    const localStorage = {{
      getItem: (k) => storage[k] !== undefined ? storage[k] : null,
      setItem: (k, v) => {{ storage[k] = String(v); }},
      removeItem: (k) => {{ delete storage[k]; }},
      clear: () => {{ Object.keys(storage).forEach(k => delete storage[k]); }}
    }};
    const sessionStorage = {{
      _s: {{}},
      getItem: (k) => sessionStorage._s[k] !== undefined ? sessionStorage._s[k] : null,
      setItem: (k, v) => {{ sessionStorage._s[k] = String(v); }}
    }};
    const navigator = {{ serviceWorker: {{ register: () => Promise.resolve(), addEventListener: () => {{}} }} }};
    const window = {{
      addEventListener: () => {{}},
      innerWidth: 1024,
      matchMedia: () => ({{ matches: false }}),
      location: {{ reload: () => {{}}, hash: '' }},
      scrollTo: () => {{}}
    }};
    const domNodes = {{}};
    const docListeners = {{}};
    function makeMockNode(id) {{
      const classes = new Set();
      return {{
        id: id || '',
        children: [],
        className: '',
        disabled: false,
        checked: false,
        classList: {{
          add: (...c) => c.forEach(x => classes.add(x)),
          remove: (...c) => c.forEach(x => classes.delete(x)),
          toggle: (c) => classes.has(c) ? classes.delete(c) : classes.add(c),
          contains: (c) => classes.has(c)
        }},
        setAttribute: () => {{}},
        addEventListener: () => {{}},
        appendChild: function(child) {{
          this.children.push(child);
          if (child && child.innerHTML) this.innerHTML += child.innerHTML;
        }},
        remove: () => {{}},
        scrollIntoView: () => {{}},
        focus: () => {{}},
        click: () => {{}},
        reset: () => {{}},
        querySelectorAll: () => [],
        style: {{}},
        innerHTML: '',
        innerText: '',
        title: '',
        placeholder: '',
        value: ''
      }};
    }}
    const document = {{
      documentElement: {{ classList: {{ add: () => {{}}, remove: () => {{}}, toggle: () => {{}} }}, style: {{ setProperty: () => {{}} }}, lang: 'zh-TW' }},
      head: {{ appendChild: () => {{}} }},
      body: {{ appendChild: () => {{}} }},
      addEventListener: (evt, fn) => {{
        if (!docListeners[evt]) docListeners[evt] = [];
        docListeners[evt].push(fn);
      }},
      getElementById: (id) => {{
        if (!domNodes[id]) domNodes[id] = makeMockNode(id);
        return domNodes[id];
      }},
      querySelectorAll: () => [],
      createElement: () => makeMockNode('')
    }};
    const alert = () => {{}};
    const confirm = () => true;
    const setTimeout = (fn) => {{}};
    const clearTimeout = () => {{}};
    const appCode = {read_expr};
    {return_stmt}
    """
    rc, out, err, _ = run_js_snippet(js_code, base_dir)
    return rc, out, err

def check_data_integrity():
    print("🔍 [6/7] Validating data schema, foreign keys, perk groups & advisor rules...")
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
            if (p.creditId && !PRESET_CREDITS.some(cr => cr.id === p.creditId && cr.cardId === c.id)) {
              errors.push("Card " + c.id + " perk creditId '" + p.creditId + "' invalid or mismatched");
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

      // 4. Advisor Rules schema & foreign keys
      Object.keys(ADVISOR_RULES).forEach(catKey => {
        const rule = ADVISOR_RULES[catKey];
        if (!rule.title || !rule.title.en || !rule.title["zh-TW"]) {
          errors.push("Advisor rule " + catKey + " missing bilingual title");
        }
        ['domestic', 'overseas'].forEach(mode => {
          const mData = rule[mode];
          if (!mData) return;
          (mData.candidateCards || []).forEach(cid => {
            if (!cardIds.has(cid)) errors.push("Advisor " + catKey + "." + mode + " references unknown card: " + cid);
            const cObj = mData.cards && mData.cards[cid];
            if (!cObj || !cObj.mult || !cObj.badge || !cObj.badge.en || !cObj.badge["zh-TW"] || !cObj.note || !cObj.note.en || !cObj.note["zh-TW"]) {
              errors.push("Advisor " + catKey + "." + mode + ".cards[" + cid + "] incomplete bilingual schema");
            }
          });
          (mData.ftfTraps || []).forEach(trap => {
            if (!cardIds.has(trap.id)) errors.push("Advisor " + catKey + "." + mode + " ftfTraps unknown card: " + trap.id);
          });
        });
      });

      return JSON.stringify({
        errors: errors,
        cardsCount: PRESET_CARDS.length,
        creditsCount: PRESET_CREDITS.length,
        groupsCount: Object.keys(DUPLICATE_PERK_GROUPS).length,
        advisorCatsCount: Object.keys(ADVISOR_RULES).length
      });
    })()
    """
    rc, out, err = run_jsc_in_app_env(eval_code)
    if rc != 0:
        print(f"❌ Execution Error in check_data_integrity:\n{err}")
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

    print(f"   ✅ {res['creditsCount']} credits, {res['cardsCount']} cards, {res['groupsCount']} perk groups & {res['advisorCatsCount']} advisor categories verified.")
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

      // --- Sub-check E: Backup & Restore Serialization / Round-trip Invariant ---
      // 1. Construct comprehensive mock user state covering all 7 data dimensions
      const mockOriginalState = {
        ownedCards: {
          'csp': true,
          'cfu': true,
          'bonvoy-brilliant': true,
          'venture-x': true,
          'biz-gold': true
        },
        cardMeta: {
          'csp': { openedYear: 2024, openedMonth: 10, renewMonth: 10 },
          'venture-x': { openedYear: 2023, openedMonth: 5, renewMonth: 5 },
          'bonvoy-brilliant': { openedYear: 2022, openedMonth: 11, renewMonth: 11 }
        },
        creditsClaimed: {
          'csp-hotel-100_2026-10': true,
          'brilliant-dining-25_2026-10': 25,
          'venture-x-travel-300_2026-05': true
        },
        mutedCredits: {
          'biz-gold-walmart': true
        },
        skippedCredits: {
          'amex-plat-saks-50_2026-10': true
        },
        fncs: [
          {
            id: 'fnc-1234567890',
            name: 'Marriott 85k Certificate',
            issuer: 'Marriott',
            points: '85,000',
            expireDate: '2027-04-15',
            used: false
          },
          {
            id: 'fnc-9876543210',
            name: 'IHG Anniversary Night',
            issuer: 'IHG',
            points: '40,000',
            expireDate: '2026-12-31',
            used: true
          }
        ],
        fncsClaimed: {
          'fnc-9876543210': true
        }
      };

      // 2. Load mock state and execute saveState() & JSON serialization (simulating Export JSON / Drive Backup)
      appState = JSON.parse(JSON.stringify(mockOriginalState));
      saveState(true);

      const backupJsonStr = JSON.stringify(appState, null, 2);
      if (!backupJsonStr || backupJsonStr.length < 50) {
        errors.push("Backup serialization produced empty or invalid JSON string");
      }

      // 3. Clear in-memory state completely (simulate fresh device or reset)
      appState = {
        ownedCards: {},
        cardMeta: {},
        creditsClaimed: {},
        mutedCredits: {},
        skippedCredits: {},
        fncs: [],
        fncsClaimed: {}
      };

      if (isCardOwned('csp') || appState.fncs.length > 0) {
        errors.push("Failed to clear in-memory state before restore test");
      }

      // 4. Simulate restore (as performed by JSON import & Google Drive restore)
      try {
        const parsedBackup = JSON.parse(backupJsonStr);
        appState = parsedBackup;
        saveState(true);
      } catch (e) {
        errors.push("Failed to parse or restore backup JSON: " + e.message);
      }

      // 5. Deep equality verification of all 7 data dimensions
      function deepEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
      }

      if (!deepEqual(appState.ownedCards, mockOriginalState.ownedCards)) {
        errors.push("Restored ownedCards mismatch: " + JSON.stringify(appState.ownedCards));
      }
      if (!deepEqual(appState.cardMeta, mockOriginalState.cardMeta)) {
        errors.push("Restored cardMeta mismatch: " + JSON.stringify(appState.cardMeta));
      }
      if (!deepEqual(appState.creditsClaimed, mockOriginalState.creditsClaimed)) {
        errors.push("Restored creditsClaimed mismatch: " + JSON.stringify(appState.creditsClaimed));
      }
      if (!deepEqual(appState.mutedCredits, mockOriginalState.mutedCredits)) {
        errors.push("Restored mutedCredits mismatch: " + JSON.stringify(appState.mutedCredits));
      }
      if (!deepEqual(appState.skippedCredits, mockOriginalState.skippedCredits)) {
        errors.push("Restored skippedCredits mismatch: " + JSON.stringify(appState.skippedCredits));
      }
      if (!deepEqual(appState.fncs, mockOriginalState.fncs)) {
        errors.push("Restored fncs mismatch: " + JSON.stringify(appState.fncs));
      }
      if (!deepEqual(appState.fncsClaimed, mockOriginalState.fncsClaimed)) {
        errors.push("Restored fncsClaimed mismatch: " + JSON.stringify(appState.fncsClaimed));
      }

      // 6. Verify post-restore business logic execution
      if (!isCreditMuted('biz-gold-walmart')) {
        errors.push("Restored muted credit failed isCreditMuted check");
      }
      if (!isCreditSkipped('amex-plat-saks-50_2026-10')) {
        errors.push("Restored skipped credit failed isCreditSkipped check");
      }
      if (!isCardOwned('csp') || !isCardOwned('venture-x')) {
        errors.push("Restored card ownership check failed for csp / venture-x");
      }

      // Verify cycle cadence badge resolution with restored cardMeta
      const cspCredit = PRESET_CREDITS.find(c => c.cardId === 'csp' && c.period === 'annual');
      if (cspCredit) {
        const cycleInfo = getCreditCycleInfo(cspCredit, 2026, 10);
        if (!cycleInfo.isAnniversary) {
          errors.push("getCreditCycleInfo failed to recognize anniversary cycle for restored CSP");
        }
      }

      // 7. Verify UI rendering runs cleanly with restored state
      try {
        renderAllViews();
      } catch (e) {
        errors.push("renderAllViews() crashed with restored state: " + e.message);
      }

      // 8. Verify Backward Compatibility (Legacy backup without cardMeta, mutedCredits, etc.)
      const legacyBackup = {
        ownedCards: { 'csp': true },
        creditsClaimed: { 'csp_hotel': true }
      };
      localStorage.setItem('cardflow_state_v1', JSON.stringify(legacyBackup));
      appState = {};
      loadState();
      saveState(true);

      if (!appState.cardMeta || typeof appState.cardMeta !== 'object') {
        errors.push("Legacy backup fallback failed to initialize cardMeta");
      }
      if (!appState.mutedCredits || typeof appState.mutedCredits !== 'object') {
        errors.push("Legacy backup fallback failed to initialize mutedCredits");
      }
      if (!appState.skippedCredits || typeof appState.skippedCredits !== 'object') {
        errors.push("Legacy backup fallback failed to initialize skippedCredits");
      }
      if (!Array.isArray(appState.fncs)) {
        errors.push("Legacy backup fallback failed to initialize fncs array");
      }
      if (!appState.fncsClaimed || typeof appState.fncsClaimed !== 'object') {
        errors.push("Legacy backup fallback failed to initialize fncsClaimed");
      }

      // 9. Verify Tab 2 Polish Features (Compact/Detailed View, Decision Status & Deeplinks)
      setCardsViewMode('compact');
      if (currentCardsViewMode !== 'compact') errors.push("setCardsViewMode('compact') failed");
      toggleCardDetailExpand('bonvoy-brilliant');
      if (!expandedCardIds.has('bonvoy-brilliant')) errors.push("toggleCardDetailExpand failed to toggle state");
      setCardsViewMode('detailed');
      if (currentCardsViewMode !== 'detailed') errors.push("setCardsViewMode('detailed') failed");

      const badgeKeep = getDecisionBadgeInfo('keep');
      if (!badgeKeep || badgeKeep.icon !== '✓') errors.push("getDecisionBadgeInfo('keep') failed");
      const badgeRetention = getDecisionBadgeInfo('retention');
      if (!badgeRetention || badgeRetention.icon !== '🎁') errors.push("getDecisionBadgeInfo('retention') failed");

      if (!appState.cardMeta) appState.cardMeta = {};
      if (!appState.cardMeta['bonvoy-brilliant']) appState.cardMeta['bonvoy-brilliant'] = {};
      appState.cardMeta['bonvoy-brilliant'].retentionStatus = 'retention';
      appState.cardMeta['bonvoy-brilliant'].retentionNote = '$150 statement credit';
      saveState(true);
      if (appState.cardMeta['bonvoy-brilliant'].retentionStatus !== 'retention') {
        errors.push("Failed to persist retentionStatus in cardMeta");
      }

      const brilliantDiningPerk = PRESET_CARDS.find(c => c.id === 'bonvoy-brilliant').perks.find(p => p.creditId === 'bb-dining');
      if (!brilliantDiningPerk) errors.push("Missing creditId 'bb-dining' in Marriott Brilliant perks");
      const linked = findLinkedCredit('bonvoy-brilliant', brilliantDiningPerk);
      if (!linked || linked.id !== 'bb-dining') errors.push("findLinkedCredit failed for bb-dining");

      try {
        jumpToCredit('bb-dining');
      } catch (e) {
        errors.push("jumpToCredit('bb-dining') crashed: " + e.message);
      }

      try {
        jumpToLoyalty();
      } catch (e) {
        errors.push("jumpToLoyalty() crashed: " + e.message);
      }

      try {
        setCardsViewMode('compact');
        renderCards();
        setCardsViewMode('detailed');
        renderCards();
      } catch (e) {
        errors.push("renderCards crashed during view mode test: " + e.message);
      }

      // 10. Security & Consistency Checks (XSS escaping, strict state validation, Donut muted filtering, local date parsing)
      const xssPayload = '<img src=x onerror="alert(1)">&\\'';
      const escaped = escapeHtml(xssPayload);
      if (escaped.includes('<') || escaped.includes('>') || escaped.includes('"')) {
        errors.push("escapeHtml failed to sanitize HTML characters: " + escaped);
      }

      let strictRejected = false;
      try {
        normalizeAppState({ foo: 'bar' }, true);
      } catch (e) {
        strictRejected = true;
      }
      if (!strictRejected) {
        errors.push("normalizeAppState(..., true) failed to reject unrelated JSON object");
      }

      const localParsed = parseLocalYmd('2026-11-19');
      if (!localParsed || localParsed.getFullYear() !== 2026 || localParsed.getMonth() !== 10 || localParsed.getDate() !== 19) {
        errors.push("parseLocalYmd failed to parse local YYYY-MM-DD");
      }

      // Verify computeAnnualUtilization respects pre-opening periods and Donut DOM output excludes muted credits
      appState = normalizeAppState({ ownedCards: { 'csp': true }, mutedCredits: {} }, false);
      renderDonutChart();
      const donutValBefore = document.getElementById('donut-center-val').innerText;
      const utilBeforeMute = computeAnnualUtilization(PRESET_CREDITS.filter(c => isCardOwned(c.cardId) && !isCreditMuted(c.id)), 2026, 11);
      muteCredit('csp-doordash');
      const donutValAfter = document.getElementById('donut-center-val').innerText;
      const utilAfterMute = computeAnnualUtilization(PRESET_CREDITS.filter(c => isCardOwned(c.cardId) && !isCreditMuted(c.id)), 2026, 11);
      if (utilAfterMute.totalAnnualPerks >= utilBeforeMute.totalAnnualPerks) {
        errors.push("computeAnnualUtilization did not decrease after muting csp-doordash");
      }
      if (donutValBefore !== '$220' || donutValAfter !== '$100') {
        errors.push("renderDonutChart() DOM value mismatch on mute: before=" + donutValBefore + ", after=" + donutValAfter);
      }
      unmuteCredit('csp-doordash');

      // 11. Mid-year openedMonth expiration check across quarterly & semiannual credits
      appState = normalizeAppState({
        ownedCards: { 'ihg-premier': true },
        cardMeta: { 'ihg-premier': { openedYear: 2026, openedMonth: 8, renewMonth: 8 } }
      }, false);
      const augUtil = computeAnnualUtilization(PRESET_CREDITS.filter(c => isCardOwned(c.cardId)), 2026, 11);
      if (augUtil.totalExpiredAnnualValue !== 25) {
        errors.push("Expected $25 expired (Q3 only, not Q1/Q2/H1) for IHG Premier opened Aug 2026 viewed in Nov 2026, got " + augUtil.totalExpiredAnnualValue);
      }
      appState.cardMeta['ihg-premier'].openedMonth = 10;
      const octUtil = computeAnnualUtilization(PRESET_CREDITS.filter(c => isCardOwned(c.cardId)), 2026, 11);
      if (octUtil.totalExpiredAnnualValue !== 0) {
        errors.push("Expected $0 expired for IHG Premier opened Oct 2026 viewed in Nov 2026, got " + octUtil.totalExpiredAnnualValue);
      }

      // 12. Rendered XSS Escaping in Cards & FNCs + Auto-FNC grantYear & Chase 5/24 DOM Badge
      appState = normalizeAppState({
        ownedCards: { 'csp': true, 'bonvoy-brilliant': true },
        cardMeta: {
          'csp': { openedYear: 2026, openedMonth: 1, retentionStatus: 'keep', retentionNote: '<script>xss()</script>' },
          'bonvoy-brilliant': { renewMonth: (today.getMonth() + 2 <= 12) ? today.getMonth() + 2 : 12 }
        },
        fncs: [{
          id: 'fnc-xss-test',
          name: '<img src=x onerror=alert(1)>',
          issuer: 'Marriott',
          points: '<b>85k</b>',
          expireDate: '2027-06-15',
          used: false
        }]
      }, false);
      renderCards();
      renderFncs();
      renderChase524();
      const cardsHtml = document.getElementById('cards-list-container').innerHTML;
      const fncsHtml = document.getElementById('fnc-cards-container').innerHTML;
      if (cardsHtml.includes('<script>xss()')) {
        errors.push("renderCards() failed to escape retentionNote XSS payload");
      }
      if (fncsHtml.includes('<img src=x') || fncsHtml.includes('<b>85k</b>')) {
        errors.push("renderFncs() failed to escape FNC XSS payload");
      }
      if (!document.getElementById('chase-524-badge').innerText.startsWith('1 / 24')) {
        errors.push("renderChase524() badge mismatch: " + document.getElementById('chase-524-badge').innerText);
      }
      if (today.getMonth() + 1 < 12) {
        const expectedPreRenewYear = today.getFullYear();
        if (!fncsHtml.includes(expectedPreRenewYear + '-')) {
          errors.push("Auto-derived FNC grantYear did not shift to prior cycle before renewMonth");
        }
      }

      // 13. Google Drive button unlock on missing GIS / token clear & full init() smoke test
      const backupBtnNode = document.getElementById('gdrive-backup-btn');
      const restoreBtnNode = document.getElementById('gdrive-restore-btn');
      backupBtnNode.disabled = false;
      restoreBtnNode.disabled = false;
      gdriveToken = 'stale-token';
      gdriveTokenExpiresAt = 0;
      backupToGoogleDrive(false);
      restoreFromGoogleDrive();
      if (backupBtnNode.disabled || restoreBtnNode.disabled) {
        errors.push("Google Drive buttons remained disabled after GIS-unavailable error");
      }
      clearStaleDriveToken();
      if (gdriveToken !== null) {
        errors.push("clearStaleDriveToken() failed to clear gdriveToken");
      }

      // 14. OAuth Token memory-only invariant (must NOT persist access token to localStorage)
      localStorage.setItem(GDRIVE_TOKEN_KEY, 'legacy-token');
      window.google = {
        accounts: {
          oauth2: {
            initTokenClient: (cfg) => ({
              requestAccessToken: () => cfg.callback({ access_token: 'mem-only-token', expires_in: 3600 })
            })
          }
        }
      };
      let receivedToken = null;
      requestGoogleDriveToken((tok) => { receivedToken = tok; });
      if (receivedToken !== 'mem-only-token' || gdriveToken !== 'mem-only-token') {
        errors.push("requestGoogleDriveToken did not store token in memory");
      }
      if (localStorage.getItem(GDRIVE_TOKEN_KEY) !== 'legacy-token' && localStorage.getItem(GDRIVE_TOKEN_KEY) === 'mem-only-token') {
        errors.push("requestGoogleDriveToken persisted access token to localStorage");
      }
      if (localStorage.getItem(GDRIVE_TOKEN_EXPIRES_KEY) !== null) {
        errors.push("requestGoogleDriveToken persisted token expiry to localStorage");
      }
      clearStaleDriveToken();
      if (localStorage.getItem(GDRIVE_TOKEN_KEY) !== null) {
        errors.push("clearStaleDriveToken failed to remove legacy token from localStorage");
      }
      delete window.google;

      // 15. Cross-year isolation & resetCurrentMonth() key scoping
      selectedYear = 2026;
      selectedMonth = 11;
      const activeMKey = getMonthKey(); // '2026-11'
      appState = normalizeAppState({
        ownedCards: { 'csp': true },
        creditsClaimed: {
          ['csp-doordash_' + activeMKey]: true,
          'csp-doordash_2026-10': true,
          'csp-hotel_2026': true,
          'csp-hotel_2027': true
        },
        skippedCredits: {
          ['csp-doordash_' + activeMKey]: true,
          'csp-doordash_2026-10': true
        }
      }, false);
      resetCurrentMonth();
      if (appState.creditsClaimed['csp-doordash_' + activeMKey] || appState.skippedCredits['csp-doordash_' + activeMKey]) {
        errors.push("resetCurrentMonth() failed to clear active month claimed/skipped state");
      }
      if (!appState.creditsClaimed['csp-doordash_2026-10'] || !appState.skippedCredits['csp-doordash_2026-10'] || !appState.creditsClaimed['csp-hotel_2026'] || !appState.creditsClaimed['csp-hotel_2027']) {
        errors.push("resetCurrentMonth() polluted other months or annual credits");
      }
      const cspCredits = PRESET_CREDITS.filter(c => c.cardId === 'csp');
      const util2026 = computeAnnualUtilization(cspCredits, 2026, 11);
      const util2027 = computeAnnualUtilization(cspCredits, 2027, 1);
      if (util2026.totalClaimedAnnualValue !== 110 || util2027.totalClaimedAnnualValue !== 100) {
        errors.push("Cross-year utilization isolation failed: 2026=" + util2026.totalClaimedAnnualValue + ", 2027=" + util2027.totalClaimedAnnualValue);
      }

      // 16. Modal open-state guard & focus restoration
      MODAL_IDS.forEach(mid => document.getElementById(mid).classList.add('hidden'));
      if (hasOpenModal()) {
        errors.push("hasOpenModal() returned true when all modals are hidden");
      }
      let triggerFocused = false;
      document.activeElement = { focus: () => { triggerFocused = true; } };
      const settingsEl = document.getElementById('settings-modal');
      openModalEl(settingsEl);
      if (!hasOpenModal()) {
        errors.push("hasOpenModal() returned false when settings-modal is open");
      }
      closeModalEl(settingsEl);
      if (hasOpenModal()) {
        errors.push("hasOpenModal() returned true after closing settings-modal");
      }
      if (!triggerFocused) {
        errors.push("closeModalEl() failed to restore focus to trigger element");
      }

      try {
        init();
        applyLanguage('en');
        if (document.documentElement.lang !== 'en') errors.push("applyLanguage('en') did not set html lang");
        applyLanguage('zh-TW');
        if (document.documentElement.lang !== 'zh-TW') errors.push("applyLanguage('zh-TW') did not set html lang");
      } catch (e) {
        errors.push("init() / applyLanguage() crashed: " + e.message);
      }

      return JSON.stringify({
        errors: errors,
        expectedSum: expectedSum,
        loungeCardsCount: loungeCards.length,
        cdwCardsCount: cdwCards.length,
        backupRestoredKeysCount: Object.keys(mockOriginalState).length
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

    print(f"   ✅ Value conservation (${res['expectedSum']:.2f}/yr), Mute/Skip isolation, 12-mo simulation & Backup/Restore round-trip (7/7 dims) passed.")

    if shutil.which('node'):
        if not check_drive_async_with_node():
            return False
    return True

def check_drive_async_with_node():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    node_test = """
    const fs = require('fs');
    const storage = {};
    const localStorage = {
      getItem: (k) => storage[k] !== undefined ? storage[k] : null,
      setItem: (k, v) => { storage[k] = String(v); },
      removeItem: (k) => { delete storage[k]; },
      clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
    };
    const sessionStorage = { _s: {}, getItem: (k) => sessionStorage._s[k] ?? null, setItem: (k, v) => { sessionStorage._s[k] = String(v); } };
    const navigator = { serviceWorker: { register: () => Promise.resolve(), addEventListener: () => {} } };
    const window = { addEventListener: () => {}, innerWidth: 1024, matchMedia: () => ({ matches: false }), location: { reload: () => {}, hash: '' }, scrollTo: () => {} };
    const makeNode = (id = '') => ({ id, children: [], className: '', disabled: false, checked: false, classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => true }, setAttribute: () => {}, addEventListener: () => {}, appendChild: () => {}, remove: () => {}, scrollIntoView: () => {}, focus: () => {}, click: () => {}, reset: () => {}, querySelectorAll: () => [], style: {}, innerHTML: '', innerText: '', title: '', placeholder: '', value: '' });
    const domNodes = {};
    const document = {
      documentElement: { classList: { add: () => {}, remove: () => {}, toggle: () => {} }, style: { setProperty: () => {} }, lang: 'zh-TW' },
      head: { appendChild: () => {} }, body: { appendChild: () => {} },
      addEventListener: () => {},
      getElementById: (id) => (domNodes[id] ||= makeNode(id)),
      querySelectorAll: () => [],
      createElement: () => makeNode('')
    };
    const alert = () => {};
    const confirm = () => true;
    const fetchCalls = [];
    let nextMode = 'post';
    const fetch = async (url, opts = {}) => {
      fetchCalls.push({ url, method: opts.method || 'GET' });
      if (url.includes('/drive/v3/about')) return { ok: true, status: 200, json: async () => ({ user: { emailAddress: 'test@example.com' } }) };
      if (url.includes('/drive/v3/files?') && nextMode === '401') return { ok: false, status: 401, json: async () => ({ error: { message: 'Unauthorized' } }) };
      if (url.includes('/drive/v3/files?') && nextMode === 'post') return { ok: true, status: 200, json: async () => ({ files: [] }) };
      if (url.includes('/drive/v3/files?') && (nextMode === 'patch' || nextMode === 'restore')) return { ok: true, status: 200, json: async () => ({ files: [{ id: 'file-1', name: 'cardflow_backup.json', modifiedTime: '2026-11-19T00:00:00Z' }] }) };
      if (url.includes('uploadType=multipart') || url.includes('uploadType=media')) return { ok: true, status: 200, json: async () => ({ id: 'file-1' }) };
      if (url.includes('alt=media')) return { ok: true, status: 200, json: async () => ({ ownedCards: { csp: true }, fncs: [] }) };
      return { ok: true, status: 200, json: async () => ({}) };
    };
    const asyncTestTail = `
    (async () => {
      const errors = [];
      gdriveToken = 'valid-token';
      gdriveTokenExpiresAt = Date.now() + 3600000;
      nextMode = 'post';
      await backupToGoogleDrive(false);
      await new Promise(r => setTimeout(r, 20));
      if (!fetchCalls.some(c => c.url.includes('orderBy=modifiedTime%20desc'))) errors.push('Drive search missing orderBy=modifiedTime desc');
      if (!fetchCalls.some(c => c.method === 'POST' && c.url.includes('uploadType=multipart'))) errors.push('Expected POST multipart upload when no existing file');

      nextMode = 'patch';
      await backupToGoogleDrive(false);
      await new Promise(r => setTimeout(r, 20));
      if (!fetchCalls.some(c => c.method === 'PATCH' && c.url.includes('uploadType=media'))) errors.push('Expected PATCH media upload when file exists');

      nextMode = 'restore';
      appState = normalizeAppState(null, false);
      await restoreFromGoogleDrive();
      await new Promise(r => setTimeout(r, 20));
      if (!appState.ownedCards.csp) errors.push('restoreFromGoogleDrive did not restore ownedCards.csp');

      nextMode = '401';
      await backupToGoogleDrive(false);
      await new Promise(r => setTimeout(r, 20));
      if (gdriveToken !== null) errors.push('401 response did not clear gdriveToken');
      if (document.getElementById('gdrive-backup-btn').disabled) errors.push('Backup button stayed disabled after 401');

      if (errors.length) { console.error(errors.join('\\n')); process.exit(1); }
      console.log('   ✅ Async Google Drive fetch suite (POST, PATCH, Restore, 401 token clear) passed.');
    })();
    `;
    eval(fs.readFileSync('app.js', 'utf8') + '\\n;' + asyncTestTail);
    """
    proc = subprocess.run(['node', '-e', node_test], capture_output=True, text=True, cwd=base_dir)
    if proc.returncode != 0:
        print(f"❌ Async Drive test failed:\n{proc.stderr.strip() or proc.stdout.strip()}")
        return False
    if proc.stdout.strip():
        print(proc.stdout.strip())
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
