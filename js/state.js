// CardFlow State Persistence, Normalization & Pure Utilities

import { PRESET_CARDS } from './data.js';

export const STATE_KEY = 'cardflow_state_v1';
export const THEME_KEY = 'cardflow_theme_v1';
export const PALETTE_KEY = 'cardflow_palette_v1';
export const BANNER_KEY = 'cardflow_banner_dismissed_v1';
export const ADVISOR_MODE_KEY = 'cardflow_advisor_mode_v1';
export const ACTIVE_TAB_KEY = 'cardflow_active_subview_v1';
export const VALID_SUBVIEWS = ['credits', 'cards', 'loyalty', 'advisor'];

let autoSyncCallback = null;
export function registerAutoSyncHandler(fn) {
  autoSyncCallback = typeof fn === 'function' ? fn : null;
}

// --- 5. INITIAL STATE & PERSISTENCE ---
export let currentTheme = localStorage.getItem(THEME_KEY) || 'light';
export let currentPalette = localStorage.getItem(PALETTE_KEY) || 'sage';

export const today = new Date();
export let selectedYear = today.getFullYear();
export let selectedMonth = today.getMonth() + 1; // 1-12

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getLocalDateStr(dateObj = new Date()) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseLocalYmd(dateStr) {
  if (typeof dateStr !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function isPlainObject(val) {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
}

export function normalizeAppState(raw, strict = false) {
  if (!isPlainObject(raw)) {
    if (strict) throw new Error('Invalid state root');
    return {
      ownedCards: {},
      cardMeta: {},
      creditsClaimed: {},
      mutedCredits: {},
      skippedCredits: {},
      fncs: [],
      fncsClaimed: {}
    };
  }

  const expectedKeys = ['ownedCards', 'cardMeta', 'creditsClaimed', 'mutedCredits', 'skippedCredits', 'fncs', 'fncsClaimed'];
  if (strict && !expectedKeys.some(k => k in raw)) {
    throw new Error('Missing CardFlow state keys');
  }

  const cleanFncs = Array.isArray(raw.fncs)
    ? raw.fncs
        .filter(f => isPlainObject(f) && typeof f.id === 'string' && typeof f.name === 'string')
        .map(f => ({
          id: f.id,
          name: f.name,
          issuer: typeof f.issuer === 'string' ? f.issuer : 'Marriott',
          points: typeof f.points === 'string' || typeof f.points === 'number' ? String(f.points) : '',
          expireDate: typeof f.expireDate === 'string' ? f.expireDate : '',
          used: Boolean(f.used)
        }))
    : [];

  return {
    ownedCards: isPlainObject(raw.ownedCards) ? { ...raw.ownedCards } : {},
    cardMeta: isPlainObject(raw.cardMeta) ? { ...raw.cardMeta } : {},
    creditsClaimed: isPlainObject(raw.creditsClaimed) ? { ...raw.creditsClaimed } : {},
    mutedCredits: isPlainObject(raw.mutedCredits) ? { ...raw.mutedCredits } : {},
    skippedCredits: isPlainObject(raw.skippedCredits) ? { ...raw.skippedCredits } : {},
    fncs: cleanFncs,
    fncsClaimed: isPlainObject(raw.fncsClaimed) ? { ...raw.fncsClaimed } : {}
  };
}

export let appState = normalizeAppState(null, false);

export function loadState() {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appState = normalizeAppState(parsed, false);
    } catch (e) {
      console.error('Failed to parse appState:', e);
      appState = normalizeAppState(null, false);
    }
  } else {
    appState = normalizeAppState(appState, false);
  }
}

export function saveState(skipAutoSync = false) {
  appState = normalizeAppState(appState, false);
  localStorage.setItem(STATE_KEY, JSON.stringify(appState));
  if (!skipAutoSync) {
    if (autoSyncCallback) autoSyncCallback();
  }
}

// Credit Muting & Skipping Helpers
export function isCreditMuted(creditId) {
  return !!(appState.mutedCredits && appState.mutedCredits[creditId]);
}

export function isCreditSkipped(stateKey) {
  return !!(appState.skippedCredits && appState.skippedCredits[stateKey]);
}

// Card Ownership Helper Functions
export function isCardOwned(cardId) {
  if (!appState.ownedCards) return false;
  return !!appState.ownedCards[cardId];
}


export function setCurrentTheme(theme) { currentTheme = theme; }
export function setCurrentPalette(palette) { currentPalette = palette; }
export function setSelectedPeriod(y, m) { selectedYear = y; selectedMonth = m; }
export function setAppState(next) { appState = next; return appState; }
export function getMonthKey() {
  return `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
}

export function getOwnedCardsInPerkGroup(groupId) {
  const result = [];
  PRESET_CARDS.forEach(c => {
    if (!isCardOwned(c.id)) return;
    if (c.perks && c.perks.some(p => p.group === groupId)) {
      result.push(c);
    }
  });
  return result;
}

