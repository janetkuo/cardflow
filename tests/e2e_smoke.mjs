import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 18090;
const BASE_URL = `http://127.0.0.1:${PORT}/index.html`;

function probeHttp(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, res => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', reject);
  });
}

async function waitForServer(url, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if (await probeHttp(url)) return;
    } catch (_) {}
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error(`Timed out waiting for static server at ${url}`);
}

async function run() {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], {
    cwd: ROOT_DIR,
    stdio: 'ignore'
  });

  let browser;
  try {
    await waitForServer(BASE_URL);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      serviceWorkers: 'allow'
    });
    const page = await context.newPage();

    const errors = [];
    page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const url = msg.location()?.url || '';
        const isExternalResourceErr =
          url.includes('accounts.google.com') ||
          text.includes('accounts.google.com') ||
          (text === 'Failed to load resource: net::ERR_FAILED' && !url.startsWith(`http://127.0.0.1:${PORT}`));
        if (!isExternalResourceErr) {
          errors.push(`console.error: ${text}${url ? ` (${url})` : ''}`);
        }
      }
    });
    page.on('response', res => {
      if (res.url().startsWith(`http://127.0.0.1:${PORT}`) && res.status() >= 400) {
        errors.push(`same-origin HTTP ${res.status()}: ${res.url()}`);
      }
    });
    page.on('requestfailed', req => {
      if (req.url().startsWith(`http://127.0.0.1:${PORT}`)) {
        errors.push(`same-origin request failed: ${req.url()} (${req.failure()?.errorText})`);
      }
    });

    // 1. Immediate initial render on open (must not require clicking view mode toggle)
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const initialFeedLen = await page.locator('#credits-feed-container').innerHTML();
    assert.ok(initialFeedLen.trim().length > 100, 'Expected #credits-feed-container to render immediately on initial load');

    // Verify prebuilt styles.css is actually applied
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.notEqual(bgColor, 'rgba(0, 0, 0, 0)', 'Expected body background color from styles.css');

    // 2. Load Demo Starter Pack & verify live credit calculation
    await page.locator('#credits-feed-container button[data-action="load-demo-pack"]').click();
    await page.waitForSelector('#credit-item-bb-dining');
    const beforeRemaining = parseFloat(await page.locator('#monthly-remaining-val').innerText());
    assert.ok(beforeRemaining >= 35, `Expected demo pack monthly remaining >= 35, got ${beforeRemaining}`);

    // Claim $25 Marriott Brilliant dining credit
    await page.locator('#credit-item-bb-dining button').first().click();
    const afterClaim = parseFloat(await page.locator('#monthly-remaining-val').innerText());
    assert.equal(afterClaim, beforeRemaining - 25, 'Expected monthly remaining to drop by $25 after claim');

    // Keyboard accessibility check for delegated [role="button"][data-action]
    await page.locator('#hero-net-af-box').focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('#annual-breakdown-modal:not(.hidden)');
    await page.keyboard.press('Escape');
    await page.waitForSelector('#annual-breakdown-modal', { state: 'hidden' });

    // 3. Navigate through all 4 subviews + Cards Search/Compact/Card Date & Retention XSS test
    await page.locator('#nav-btn-cards').click();
    await page.waitForSelector('#subview-cards:not(.hidden)');
    const cardsHtml = await page.locator('#cards-list-container').innerHTML();
    assert.ok(cardsHtml.includes('Marriott'), 'Expected owned cards rendered in Cards tab');

    // Compact view expand & search filter
    await page.locator('#cards-view-compact-btn').click();
    await page.locator('#cards-list-container button[data-action="toggle-card-expand"]').first().click();
    await page.locator('#cards-search-input').fill('Sapphire');
    const filteredCardsText = await page.locator('#cards-list-container').innerText();
    assert.ok(filteredCardsText.includes('Sapphire'), 'Expected Sapphire card to match search');
    assert.equal(filteredCardsText.includes('Marriott'), false, 'Expected non-matching Marriott card filtered out');
    await page.locator('#cards-search-input').fill('');
    await page.locator('#cards-view-detailed-btn').click();

    // Open Card Date & Decision modal for CSP -> set current year + XSS note -> verify Chase 5/24 & safe escaping
    await page.locator('#cards-list-container button[data-action="open-card-date"][data-card-id="csp"]').first().click();
    await page.waitForSelector('#card-date-modal:not(.hidden)');
    const curYearStr = String(new Date().getFullYear());
    await page.locator('#card-date-year-select').selectOption(curYearStr);
    await page.locator('#card-date-month-select').selectOption('1');
    await page.locator('#card-date-decision-select').selectOption('retention');
    await page.locator('#card-date-note-input').fill('<img src=x onerror=alert(1)> 30k retention');
    await page.locator('#save-card-date-btn').click();
    await page.waitForSelector('#card-date-modal', { state: 'hidden' });
    const cardsAfterDate = await page.locator('#cards-list-container').innerText();
    assert.ok(cardsAfterDate.includes('<img src=x onerror=alert(1)> 30k retention'), 'Expected escaped retention note text');
    const injectedImgs = await page.locator('#cards-list-container img').count();
    assert.equal(injectedImgs, 0, 'Expected XSS note to be escaped without rendering <img> tag');

    await page.locator('#nav-btn-loyalty').click();
    await page.waitForSelector('#subview-loyalty:not(.hidden)');
    const fncHtml = await page.locator('#fnc-cards-container').innerHTML();
    assert.ok(fncHtml.includes('85,000'), 'Expected Marriott 85k auto-FNC rendered in Loyalty tab');

    await page.locator('#nav-btn-advisor').click();
    await page.waitForSelector('#subview-advisor:not(.hidden)');
    const donutPaths = await page.locator('#donut-chart-svg path').count();
    assert.ok(donutPaths >= 1, 'Expected SVG donut chart paths in Advisor tab');
    const chase524Badge = await page.locator('#chase-524-badge').innerText();
    assert.ok(chase524Badge.startsWith('1 / 24'), `Expected Chase 5/24 badge to start with 1 / 24, got ${chase524Badge}`);

    await page.locator('#nav-btn-credits').click();
    await page.waitForSelector('#subview-credits:not(.hidden)');

    // 4. Perk Action Modal: Skip & Unskip, Mute & Unmute lifecycle
    const preSkipRemaining = parseFloat(await page.locator('#monthly-remaining-val').innerText());
    await page.locator('#credit-item-csp-doordash button[data-action="open-perk-action"]').click();
    await page.waitForSelector('#perk-action-modal:not(.hidden)');
    await page.locator('#perk-action-skip-btn').click();
    await page.waitForSelector('#perk-action-modal', { state: 'hidden' });
    const postSkipRemaining = parseFloat(await page.locator('#monthly-remaining-val').innerText());
    assert.equal(postSkipRemaining, preSkipRemaining - 10, 'Expected skipping $10 DoorDash credit to drop monthly remaining');
    await page.locator('#credit-item-csp-doordash button[data-action="toggle-credit-skip"]').click();
    const postUnskipRemaining = parseFloat(await page.locator('#monthly-remaining-val').innerText());
    assert.equal(postUnskipRemaining, preSkipRemaining, 'Expected unskipping to restore monthly remaining');

    await page.locator('#credit-item-csp-doordash button[data-action="open-perk-action"]').click();
    await page.waitForSelector('#perk-action-modal:not(.hidden)');
    await page.locator('#perk-action-mute-btn').click();
    await page.waitForSelector('#perk-action-modal', { state: 'hidden' });
    await page.waitForSelector('#muted-credits-section:not(.hidden)');
    assert.equal(await page.locator('#credit-item-csp-doordash').count(), 0, 'Expected muted credit hidden from active feed');
    await page.locator('#toggle-muted-section-btn').click();
    await page.waitForSelector('#muted-credits-list:not(.hidden)');
    await page.locator('#muted-credits-list button[data-action="unmute-credit"][data-credit-id="csp-doordash"]').click();
    await page.waitForSelector('#credit-item-csp-doordash');

    // 5. Bilingual toggle, Dark Mode toggle, Modal Escape close & JSON Import round-trip
    await page.locator('#lang-toggle-btn').click();
    assert.equal(await page.getAttribute('html', 'lang'), 'en');
    assert.equal((await page.locator('#tab-label-credits').innerText()).trim(), 'Credits Due');
    await page.locator('#lang-toggle-btn').click();
    assert.equal(await page.getAttribute('html', 'lang'), 'zh-TW');

    await page.locator('#theme-toggle').click();
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    assert.equal(isDark, true, 'Expected dark class on <html> after theme toggle');

    await page.locator('#open-settings-btn').click();
    await page.waitForSelector('#settings-modal:not(.hidden)');
    await page.keyboard.press('Escape');
    await page.waitForSelector('#settings-modal', { state: 'hidden' });

    // JSON Backup Import via settings file input
    await page.locator('#open-settings-btn').click();
    await page.waitForSelector('#settings-modal:not(.hidden)');
    const importPayload = JSON.stringify({
      ownedCards: { csp: true, cfu: true, 'bonvoy-brilliant': true },
      creditsClaimed: {},
      fncs: [{ id: 'fnc-e2e-1', name: '<b>Hyatt Cat 1-4</b>', issuer: 'Hyatt', points: 'Cat 1-4', expireDate: `${Number(curYearStr) + 1}-12-31`, used: false }]
    });
    await page.locator('#import-file-input').setInputFiles({
      name: 'cardflow_test_backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(importPayload, 'utf8')
    });
    await page.waitForSelector('#settings-modal', { state: 'hidden' });
    await page.locator('#nav-btn-loyalty').click();
    const importedFncText = await page.locator('#fnc-cards-container').innerText();
    assert.ok(importedFncText.includes('<b>Hyatt Cat 1-4</b>'), 'Expected imported FNC name rendered safely as escaped text');
    assert.equal(await page.locator('#fnc-cards-container b').count(), 0, 'Expected imported FNC name not to inject raw <b> HTML');
    await page.locator('#nav-btn-credits').click();

    // 6. Claim imported credit & test In-app Confirm Modal for Reset Month
    await page.locator('#credit-item-csp-doordash button[data-action="toggle-credit-claim"]').click();
    assert.equal(parseFloat(await page.locator('#monthly-remaining-val').innerText()), beforeRemaining - 10);
    await page.locator('#banner-reset-month-btn').click();
    await page.waitForSelector('#confirm-modal:not(.hidden)');
    await page.locator('#confirm-modal-ok-btn').click();
    await page.waitForSelector('#confirm-modal', { state: 'hidden' });
    const afterReset = parseFloat(await page.locator('#monthly-remaining-val').innerText());
    assert.equal(afterReset, beforeRemaining, 'Expected Reset Month to restore full monthly remaining balance');

    // 7. Service Worker registration & offline reload verification
    const swReady = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);
      return Boolean(reg && reg.active);
    });
    assert.equal(swReady, true, 'Expected Service Worker to become active');

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#credit-item-bb-dining');
    const offlineBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.notEqual(offlineBg, 'rgba(0, 0, 0, 0)', 'Expected offline styles.css to remain applied from SW cache');

    assert.deepEqual(errors, [], `Unexpected browser errors: ${errors.join(' | ')}`);
    console.log('✅ Playwright E2E smoke suite (ESM boot, 4 tabs, i18n, dark mode, confirm modal, offline SW) passed!');
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
}

run().catch(err => {
  console.error('❌ E2E smoke test failed:', err);
  process.exit(1);
});
