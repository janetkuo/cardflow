// CardFlow App Shell: Cross-View Orchestration, Theme, Palette, Localization & Navigation

import { MORANDI_PALETTES } from './palettes.js';
import { LANG_KEY, currentLang, setCurrentLang, t, pickText } from './i18n.js';
import { PRESET_CARDS, PRESET_CREDITS } from './data.js';
import {
  THEME_KEY, PALETTE_KEY, ACTIVE_TAB_KEY, VALID_SUBVIEWS,
  setCurrentTheme, currentPalette, setCurrentPalette,
  isCreditMuted, isCardOwned
} from './state.js';
import { showToast } from './ui-core.js';
import { updateDriveUI } from './drive.js';
import { renderFncs, renderLoyaltyStatusCards, renderTransferCheatSheet } from './view-loyalty.js';
import {
  currentAdvisorCat, renderDonutChart, renderChase524,
  renderOverlapOptimizer, selectAdvisorCategory
} from './view-advisor.js';
import { renderCards } from './view-cards.js';
import {
  getCurrentPeriodFilter, expandMutedSection, setPeriodFilter,
  renderNetEffectiveAF, renderCredits, registerCreditsMuteChangeHandler
} from './view-credits.js';
import {
  renderManageCardsChecklist, closeAnnualBreakdownModal, registerModalsChangeHandler
} from './view-modals.js';

export function updateBannerText() {
  const tagEl = document.getElementById('demo-banner-tag');
  const textEl = document.getElementById('demo-banner-text');
  if (!tagEl || !textEl) return;

  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;
  if (ownedCount === 0) {
    tagEl.innerText = t('bannerTagEmpty');
    textEl.innerText = t('bannerTextEmpty');
  } else {
    tagEl.innerText = `${ownedCount} ${t('bannerTagActive')}`;
    textEl.innerText = `${t('bannerTextActivePrefix')} ${ownedCount} ${t('bannerTextActiveSuffix')}`;
  }
}

export function renderAllViews() {
  renderCredits();
  renderCards();
  renderFncs();
  renderDonutChart();
  renderLoyaltyStatusCards();
  renderChase524();
  renderOverlapOptimizer();
  selectAdvisorCategory(currentAdvisorCat);
  renderManageCardsChecklist();
  renderNetEffectiveAF();
  updateBannerText();
}

registerCreditsMuteChangeHandler(renderDonutChart);
registerModalsChangeHandler(renderAllViews);

export function updateThemeColor(theme) {
  const isDark = theme === 'dark' || (theme !== 'light' && document.documentElement.classList.contains('dark'));
  const color = isDark ? '#0f172a' : '#ffffff';
  const metaTags = document.querySelectorAll('meta[name="theme-color"]');
  if (metaTags.length === 0) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    document.head.appendChild(meta);
  } else {
    metaTags.forEach(tag => tag.setAttribute('content', color));
  }
}

export function applyTheme(theme) {
  setCurrentTheme(theme);
  localStorage.setItem(THEME_KEY, theme);
  const doc = document.documentElement;
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  if (theme === 'dark') {
    doc.classList.add('dark');
    if (sunIcon) sunIcon.classList.remove('hidden');
    if (moonIcon) moonIcon.classList.add('hidden');
  } else {
    doc.classList.remove('dark');
    if (sunIcon) sunIcon.classList.add('hidden');
    if (moonIcon) moonIcon.classList.remove('hidden');
  }
  updateThemeColor(theme);
}

export function applyPalette(palKey) {
  const pal = MORANDI_PALETTES[palKey] || MORANDI_PALETTES.sage;
  setCurrentPalette(pal.id);
  localStorage.setItem(PALETTE_KEY, pal.id);

  const root = document.documentElement;
  root.style.setProperty('--pf-primary', pal.primary);
  root.style.setProperty('--pf-primary-rgb', pal.primaryRgb);
  root.style.setProperty('--pf-primary-dark', pal.primaryDark);
  root.style.setProperty('--pf-primary-dark-rgb', pal.primaryDarkRgb);
  root.style.setProperty('--pf-income', pal.income);
  root.style.setProperty('--pf-expense', pal.expense);
  root.style.setProperty('--pf-bg-light', pal.bgLight);
  root.style.setProperty('--pf-bg-dark', pal.bgDark);

  renderPalettePicker();
}

export function renderPalettePicker() {
  const container = document.getElementById('palettes-picker-container');
  if (!container) return;
  container.innerHTML = '';

  Object.values(MORANDI_PALETTES).forEach(p => {
    const isSel = p.id === currentPalette;
    const btn = document.createElement('button');
    btn.className = `palette-btn p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${isSel ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`;
    btn.setAttribute('data-action', 'apply-palette');
    btn.setAttribute('data-palette-id', p.id);
    btn.innerHTML = `
      <span class="w-5 h-5 rounded-full shadow-xs" style="background-color: ${p.primary}"></span>
      <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">${pickText(p.name)}</span>
    `;
    container.appendChild(btn);
  });
}

export function applyLanguage(lang) {
  setCurrentLang(lang);
  localStorage.setItem(LANG_KEY, lang);
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }

  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.innerText = lang === 'zh-TW' ? 'English' : '繁中';

  const map = {
    'app-subtitle': 'appSubtitle',
    'banner-reset-text': 'bannerResetMonth',
    'monthly-credits-title': 'monthlyCreditsTitle',
    'monthly-progress-title': 'monthlyProgressTitle',
    'annual-value-title': 'annualValueTitle',
    'category-breakdown-title': 'breakdownTitle',
    'donut-center-title': 'donutCenterTitle',
    'donut-center-sub': 'donutCenterSub',
    'loyalty-card-title': 'loyaltyCardTitle',
    'loyalty-no-stays-badge': 'noStaysNeeded',
    'tab-label-credits': 'tabCredits',
    'tab-label-cards': 'tabCards',
    'tab-label-loyalty': 'tabLoyalty',
    'tab-label-advisor': 'tabAdvisor',
    'mob-label-credits': 'tabCredits',
    'mob-label-cards': 'tabCards',
    'mob-label-loyalty': 'tabLoyalty',
    'mob-label-advisor': 'tabAdvisor',
    'period-all-btn': 'periodAll',
    'label-view-mode-timeline': 'viewModeTimeline',
    'label-view-mode-cadence': 'viewModeCadence',
    'hero-net-af-title': 'heroNetAfTitle',
    'net-af-section-title': 'netAFSectionTitle',
    'net-af-section-desc': 'netAFSectionDesc',
    'kpi-total-af-title': 'kpiTotalAfTitle',
    'kpi-claimed-title': 'kpiClaimedTitle',
    'kpi-net-af-title': 'kpiNetAfTitle',
    'net-af-bar-label': 'netAfBarLabel',
    'net-af-card-breakdown-title': 'netAfCardBreakdownTitle',
    'net-af-card-breakdown-sub': 'netAfCardBreakdownSub',
    'fnc-section-title': 'fncSectionTitle',
    'fnc-section-desc': 'fncSectionDesc',
    'add-fnc-btn-label': 'addFncBtn',
    'advisor-heading': 'advisorHeading',
    'adv-loc-domestic-label': 'advLocDomestic',
    'cat-label-dining': 'catDining',
    'cat-label-flights': 'catFlights',
    'cat-label-hotels': 'catHotels',
    'cat-label-office': 'catOffice',
    'cat-label-grocery': 'catGrocery',
    'cat-label-gas': 'catGas',
    'cat-label-foreign': 'catForeign',
    'cat-label-catchall': 'catCatchall',
    'settings-modal-title': 'settingsTitle',
    'palette-section-label': 'paletteLabel',
    'backup-section-label': 'backupLabel',
    'backup-section-desc': 'backupDesc',
    'export-json-label': 'exportJson',
    'import-json-label': 'importJson',
    'reset-factory-btn': 'resetFactory',
    'fnc-modal-title': 'modalAddFnc',
    'fnc-name-label': 'certName',
    'fnc-issuer-label': 'program',
    'fnc-points-label': 'capValue',
    'fnc-expire-label': 'expireDate',
    'cancel-fnc-btn': 'cancel',
    'save-fnc-btn': 'saveCert',
    'manage-cards-btn-label': 'manageCardsBtnLabel',
    'manage-cards-modal-title': 'manageCardsModalTitle',
    'manage-cards-modal-sub': 'manageCardsModalSub',
    'gdrive-section-title': 'gdriveSectionTitle',
    'gdrive-section-desc': 'gdriveSectionDesc',
    'gdrive-client-id-label': 'gdriveClientIdLabel',
    'gdrive-save-client-id-btn': 'gdriveSaveClientIdBtn',
    'gdrive-help-btn': 'gdriveHelpBtn',
    'gdrive-backup-label': 'gdriveBackupLabel',
    'gdrive-restore-label': 'gdriveRestoreLabel',
    'gdrive-auto-sync-label': 'gdriveAutoSyncLabel',
    'gdrive-toggle-config-label': 'gdriveToggleConfig',
    'gdrive-signout-btn': 'gdriveSignoutBtn',
    'gdrive-help-title': 'gdriveHelpTitle',
    'confirm-gdrive-help-btn': 'confirmGdriveHelpBtn',
    'pwa-update-text': 'pwaUpdateText',
    'pwa-update-btn': 'pwaUpdateBtn',
    'manage-cards-demo-btn': 'btnDemoPack',
    'chase-524-title': 'chase524Title',
    'chase-524-desc': 'chase524Desc',
    'card-date-modal-title': 'cardDateModalTitle',
    'card-date-year-label': 'cardDateYearLabel',
    'card-date-month-label': 'cardDateMonthLabel',
    'card-date-renew-label': 'cardDateRenewLabel',
    'card-date-hint-title': 'cardDateHintTitle',
    'card-date-hint-desc': 'cardDateHintDesc',
    'clear-card-date-btn': 'btnClear',
    'cancel-card-date-btn': 'btnCancel',
    'save-card-date-btn': 'btnSave',
    'annual-breakdown-badge': 'annualBreakdownBadge',
    'annual-modal-title': 'annualModalTitle',
    'annual-modal-sub': 'annualModalSub',
    'annual-modal-total-desc': 'annualModalTotalDesc',
    'confirm-annual-modal-btn': 'annualModalCloseBtn',
    'perk-action-modal-desc': 'perkActionModalDesc',
    'cancel-perk-action-btn': 'cancelBtn',
    'muted-section-title': 'mutedSectionTitle',
    'overlap-optimizer-title': 'overlapOptimizerTitle',
    'overlap-optimizer-desc': 'overlapOptimizerDesc',
    'label-view-compact': 'viewModeCompact',
    'label-view-detailed': 'viewModeDetailed',
    'card-date-decision-label': 'cardDateDecisionLabel',
    'card-date-note-label': 'cardDateNoteLabel',
    'settings-progress-section-label': 'settingsProgressSection',
    'settings-reset-month-label': 'settingsResetMonthLabel',
    'restore-banner-label': 'restoreBannerLabel',
    'annual-modal-unit-label': 'perYearUnit',
    'select-all-cards-btn': 'selectAllCardsBtn',
    'deselect-all-cards-btn': 'deselectAllCardsBtn',
    'save-manage-cards-btn': 'saveManageCardsBtn',
    'fnc-issuer-opt-marriott': 'fncIssuerMarriott',
    'fnc-issuer-opt-ihg': 'fncIssuerIhg',
    'fnc-issuer-opt-hyatt': 'fncIssuerHyatt',
    'fnc-issuer-opt-hilton': 'fncIssuerHilton',
    'confirm-modal-cancel-btn': 'btnCancel'
  };

  Object.entries(map).forEach(([id, i18nKey]) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = t(i18nKey);
    }
  });

  const fncNameInput = document.getElementById('fnc-name-input');
  if (fncNameInput) fncNameInput.placeholder = t('fncNamePlaceholder');
  const fncPointsInput = document.getElementById('fnc-points-input');
  if (fncPointsInput) fncPointsInput.placeholder = t('fncPointsPlaceholder');

  const compactBtn = document.getElementById('cards-view-compact-btn');
  if (compactBtn) compactBtn.title = t('viewModeToggleTitle');
  const detailedBtn = document.getElementById('cards-view-detailed-btn');
  if (detailedBtn) detailedBtn.title = t('viewModeToggleTitle');
  const noteInput = document.getElementById('card-date-note-input');
  if (noteInput) noteInput.placeholder = t('cardDateNotePlaceholder');

  const searchInput = document.getElementById('cards-search-input');
  if (searchInput) searchInput.placeholder = t('cardsSearchPlaceholder');

  renderAllViews();
  renderPalettePicker();
  renderTransferCheatSheet();
  updateDriveUI();
}

export function getActiveTab() {
  const hash = (typeof window !== 'undefined' && window.location && window.location.hash)
    ? window.location.hash.slice(1)
    : '';
  if (VALID_SUBVIEWS.includes(hash)) {
    return hash;
  }
  try {
    if (typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem(ACTIVE_TAB_KEY);
      if (VALID_SUBVIEWS.includes(saved)) return saved;
    }
  } catch (e) {}
  return 'credits';
}

export function switchSubView(viewId, updateHash = true) {
  if (!VALID_SUBVIEWS.includes(viewId)) {
    viewId = 'credits';
  }

  VALID_SUBVIEWS.forEach(id => {
    const view = document.getElementById(`subview-${id}`);
    const tabBtn = document.getElementById(`nav-btn-${id}`);
    const mobBtn = document.getElementById(`mob-nav-${id}`);

    if (id === viewId) {
      if (view) view.classList.remove('hidden');
      if (tabBtn) {
        tabBtn.className = 'flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white shadow-xs shrink-0 whitespace-nowrap';
      }
      if (mobBtn) {
        mobBtn.className = 'flex-1 py-1 flex flex-col items-center justify-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-bold min-w-0 select-none';
      }
    } else {
      if (view) view.classList.add('hidden');
      if (tabBtn) {
        tabBtn.className = 'flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0 whitespace-nowrap';
      }
      if (mobBtn) {
        mobBtn.className = 'flex-1 py-1 flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-600 min-w-0 select-none';
      }
    }
  });

  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(ACTIVE_TAB_KEY, viewId);
    }
  } catch (e) {}

  if (updateHash && typeof window !== 'undefined' && window.location) {
    const targetHash = `#${viewId}`;
    if (window.location.hash !== targetHash) {
      if (typeof history !== 'undefined' && history.replaceState) {
        history.replaceState(null, '', targetHash);
      } else {
        window.location.hash = targetHash;
      }
    }
  }

  if (viewId === 'advisor') {
    renderOverlapOptimizer();
    renderChase524();
    renderNetEffectiveAF();
  } else if (viewId === 'cards') {
    renderCards();
  }

  if (typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

export function switchPeriodFromModal(p) {
  closeAnnualBreakdownModal();
  setPeriodFilter(p);
  const feed = document.getElementById('credits-feed-container');
  if (feed) {
    feed.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

export function jumpToCredit(creditId) {
  const credit = PRESET_CREDITS.find(c => c.id === creditId);
  if (!credit) return;

  if (!isCardOwned(credit.cardId)) {
    showToast(t('toastActivateCardFirst'));
    return;
  }

  switchSubView('credits');

  const activePeriod = getCurrentPeriodFilter();
  if (activePeriod !== 'all' && activePeriod !== credit.period) {
    setPeriodFilter(credit.period);
  } else {
    renderCredits();
  }

  if (isCreditMuted(credit.id)) {
    expandMutedSection();
  }

  if (typeof setTimeout === 'function') {
    setTimeout(() => {
      const el = document.getElementById('credit-item-' + creditId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'scale-[1.01]', 'bg-indigo-50/70', 'dark:bg-indigo-950/50');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-2', 'dark:ring-offset-slate-900', 'scale-[1.01]', 'bg-indigo-50/70', 'dark:bg-indigo-950/50');
        }, 2000);
      }
    }, 120);
  }

  const title = pickText(credit.title);
  showToast(`${t('toastJumpedToCredit')}: ${title}`);
}

export function jumpToLoyalty() {
  switchSubView('loyalty');
  if (typeof setTimeout === 'function') {
    setTimeout(() => {
      const el = document.getElementById('fnc-cards-container') || document.getElementById('subview-loyalty');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }
}

export function initFoldScreenObserver() {
  const foldInd = document.getElementById('fold-indicator');
  const screenModeText = document.getElementById('screen-mode-text');

  function update() {
    // Pixel 10 Pro Fold unfolded width is ~840-915px (breakpoint threshold 768px)
    const isDual = window.innerWidth >= 768;
    if (foldInd && screenModeText) {
      screenModeText.innerText = isDual ? t('screenModeDual') : t('screenModeSingle');
    }
  }

  window.addEventListener('resize', update);
  update();
}
