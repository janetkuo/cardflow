// CardFlow Modals & Portfolio Actions: Manage Cards, Card Dates/Decisions, Demo Pack & Annual Breakdown

import { t, pickText } from './i18n.js';
import { PRESET_CARDS, PRESET_CREDITS } from './data.js';
import {
  selectedYear, selectedMonth, appState, saveState,
  isCreditMuted, isCardOwned
} from './state.js';
import { computeAnnualUtilization } from './logic.js';
import { showToast, openModalEl, closeModalEl } from './ui-core.js';

let modalsChangeHandler = null;
let activeCardDateId = null;

export function registerModalsChangeHandler(fn) {
  modalsChangeHandler = fn;
}

function notifyModalsChanged() {
  if (modalsChangeHandler) {
    modalsChangeHandler();
  }
}

export function setCardOwnership(cardId, isOwned) {
  if (!appState.ownedCards) {
    appState.ownedCards = {};
  }
  appState.ownedCards[cardId] = !!isOwned;
  saveState();
  notifyModalsChanged();
}

export function toggleCardOwnership(cardId) {
  setCardOwnership(cardId, !isCardOwned(cardId));
}

export function selectAllCards(owned) {
  if (!appState.ownedCards) appState.ownedCards = {};
  PRESET_CARDS.forEach(c => {
    appState.ownedCards[c.id] = owned;
  });
  saveState();
  notifyModalsChanged();
}

export function loadDemoStarterPack() {
  if (!appState.ownedCards) appState.ownedCards = {};
  if (!appState.cardMeta) appState.cardMeta = {};

  appState.ownedCards['csp'] = true;
  appState.ownedCards['cfu'] = true;
  appState.ownedCards['bonvoy-brilliant'] = true;

  appState.cardMeta['csp'] = { openedYear: 2024, openedMonth: 10, renewMonth: 10 };
  appState.cardMeta['cfu'] = { openedYear: 2023, openedMonth: 3, renewMonth: 'No AF' };
  appState.cardMeta['bonvoy-brilliant'] = { openedYear: 2023, openedMonth: 6, renewMonth: 6 };

  saveState();
  notifyModalsChanged();
  showToast(t('toastDemoLoaded'));
}

function buildMonthSelectOptionsHtml(defaultLabelKey, selectedMonthNum, extraZeroHtml = '') {
  const monthNames = t('monthOptionNames').split(',');
  let html = `<option value="">${t(defaultLabelKey)}</option>${extraZeroHtml}`;
  for (let m = 1; m <= 12; m++) {
    const selected = Number(selectedMonthNum) === m ? 'selected' : '';
    const mText = monthNames[m - 1] || String(m);
    html += `<option value="${m}" ${selected}>${mText}</option>`;
  }
  return html;
}

export function openCardDateModal(cardId) {
  const modal = document.getElementById('card-date-modal');
  const card = PRESET_CARDS.find(c => c.id === cardId);
  if (!modal || !card) return;

  activeCardDateId = cardId;
  const nick = pickText(card.nickname);

  const subEl = document.getElementById('card-date-modal-sub');
  if (subEl) {
    subEl.innerText = `${nick} (${card.issuer} · ${card.annualFee === 0 ? t('noAnnualFeeLabel') : '$' + card.annualFee})`;
  }

  const meta = appState.cardMeta?.[cardId] || {};

  const yearSelect = document.getElementById('card-date-year-select');
  if (yearSelect) {
    let yearOptions = `<option value="">${t('cardDateYearSelectDefault')}</option>`;
    const curYear = new Date().getFullYear();
    const yearFmt = t('yearOptionFormat');
    for (let y = curYear + 1; y >= 2015; y--) {
      const selected = meta.openedYear === y ? 'selected' : '';
      yearOptions += `<option value="${y}" ${selected}>${yearFmt.replace('{y}', y)}</option>`;
    }
    yearSelect.innerHTML = yearOptions;
    yearSelect.value = meta.openedYear ? String(meta.openedYear) : '';
  }

  const monthSelect = document.getElementById('card-date-month-select');
  if (monthSelect) {
    monthSelect.innerHTML = buildMonthSelectOptionsHtml('cardDateMonthSelectDefault', meta.openedMonth);
    monthSelect.value = meta.openedMonth ? String(meta.openedMonth) : '';
  }

  const renewSelect = document.getElementById('card-date-renew-select');
  if (renewSelect) {
    const noAfOption = card.annualFee === 0
      ? `<option value="0" ${meta.renewMonth === 0 || meta.renewMonth === 'No AF' ? 'selected' : ''}>${t('cardDateRenewNoAf')}</option>`
      : '';
    renewSelect.innerHTML = buildMonthSelectOptionsHtml('cardDateRenewSelectDefault', meta.renewMonth, noAfOption);
    renewSelect.value = (meta.renewMonth !== undefined && meta.renewMonth !== null) ? String(meta.renewMonth) : '';
  }

  const decisionSelect = document.getElementById('card-date-decision-select');
  if (decisionSelect) {
    decisionSelect.innerHTML = `
      <option value="">${t('decisionStatusSelectDefault')}</option>
      <option value="keep">✓ ${t('decisionStatusKeep')}</option>
      <option value="considering">🤔 ${t('decisionStatusConsidering')}</option>
      <option value="retention">🎁 ${t('decisionStatusRetention')}</option>
      <option value="downgrade">📉 ${t('decisionStatusDowngrade')}</option>
      <option value="cancel">✂️ ${t('decisionStatusCancel')}</option>
    `;
    decisionSelect.value = meta.retentionStatus || '';
  }

  const noteInput = document.getElementById('card-date-note-input');
  if (noteInput) {
    noteInput.value = meta.retentionNote || '';
    noteInput.placeholder = t('cardDateNotePlaceholder');
  }

  openModalEl(modal);
}

export function closeCardDateModal() {
  const modal = document.getElementById('card-date-modal');
  closeModalEl(modal);
  activeCardDateId = null;
}

export function saveCardDate() {
  if (!activeCardDateId) return;
  if (!appState.cardMeta) appState.cardMeta = {};

  const yearVal = document.getElementById('card-date-year-select')?.value;
  const monthVal = document.getElementById('card-date-month-select')?.value;
  const renewVal = document.getElementById('card-date-renew-select')?.value;
  const decisionVal = document.getElementById('card-date-decision-select')?.value || '';
  const noteVal = (document.getElementById('card-date-note-input')?.value || '').trim();

  const openedYear = yearVal ? parseInt(yearVal, 10) : null;
  const openedMonth = monthVal ? parseInt(monthVal, 10) : null;
  let renewMonth = null;
  if (renewVal !== '') {
    renewMonth = renewVal === '0' ? 'No AF' : parseInt(renewVal, 10);
  }

  const newMeta = {
    openedYear,
    openedMonth,
    renewMonth
  };

  if (decisionVal) {
    newMeta.retentionStatus = decisionVal;
  }
  if (noteVal) {
    newMeta.retentionNote = noteVal;
  }

  appState.cardMeta[activeCardDateId] = newMeta;

  if (!appState.ownedCards) appState.ownedCards = {};
  appState.ownedCards[activeCardDateId] = true;

  saveState();
  closeCardDateModal();
  notifyModalsChanged();
  showToast(t('toastDateSaved'));
}

export function clearCardDate() {
  if (!activeCardDateId) return;
  if (appState.cardMeta && appState.cardMeta[activeCardDateId]) {
    delete appState.cardMeta[activeCardDateId];
    saveState();
  }
  closeCardDateModal();
  notifyModalsChanged();
  showToast(t('toastDateCleared'));
}

export function openManageCardsModal() {
  const modal = document.getElementById('manage-cards-modal');
  if (modal) {
    renderManageCardsChecklist();
    openModalEl(modal);
  }
}

export function closeManageCardsModal() {
  const modal = document.getElementById('manage-cards-modal');
  closeModalEl(modal);
}

export function openAnnualBreakdownModal() {
  const modal = document.getElementById('annual-breakdown-modal');
  if (modal) {
    renderAnnualBreakdownModal();
    openModalEl(modal);
  }
}

export function closeAnnualBreakdownModal() {
  const modal = document.getElementById('annual-breakdown-modal');
  closeModalEl(modal);
}

function buildAnnualUtilizationStripHtml({
  totalClaimedAnnualValue, totalExpiredAnnualValue, remainingValue,
  claimedPct, expiredPct, remainingPct
}) {
  return `
    <div class="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-50 to-emerald-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/30 border border-indigo-200/60 dark:border-indigo-800/50 space-y-2.5">
      <div class="flex items-center justify-between text-xs font-bold">
        <span class="flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
          <span>📊</span>
          <span>${t('annualValueTitle')}</span>
        </span>
        <span class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">${claimedPct}%</span>
      </div>
      <div class="w-full h-2.5 bg-black/20 dark:bg-black/40 rounded-full overflow-hidden flex shadow-inner border border-slate-200 dark:border-slate-700/60">
        <div class="bg-slate-400 dark:bg-slate-500 h-full transition-all duration-500" style="width: ${expiredPct}%"></div>
        <div class="bg-emerald-500 h-full transition-all duration-500" style="width: ${claimedPct}%"></div>
        <div class="bg-transparent h-full transition-all duration-500" style="width: ${remainingPct}%"></div>
      </div>
      <div class="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex-wrap gap-1.5 pt-0.5">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-slate-400"></span>${t('statExpiredPrefix')} $${Math.round(totalExpiredAnnualValue).toLocaleString()} (${expiredPct}%)</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span>${t('statClaimedPrefix')} $${Math.round(totalClaimedAnnualValue).toLocaleString()} (${claimedPct}%)</span>
        <span class="flex items-center gap-1 opacity-75">${t('statRemainingPrefix')} $${Math.round(remainingValue).toLocaleString()}</span>
      </div>
    </div>
  `;
}

function buildAnnualNetAfStripHtml(totalClaimedAnnualValue) {
  const totalAnnualFees = PRESET_CARDS.filter(c => isCardOwned(c.id)).reduce((acc, c) => acc + c.annualFee, 0);
  const netDiff = totalAnnualFees - totalClaimedAnnualValue;
  const isBrokenEven = totalClaimedAnnualValue >= totalAnnualFees;
  const pctNum = totalAnnualFees > 0 ? Math.round((totalClaimedAnnualValue / totalAnnualFees) * 100) : 100;

  return `
    <div class="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-50 to-emerald-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/30 border border-indigo-200/60 dark:border-indigo-800/50 space-y-2">
      <div class="flex items-center justify-between text-xs font-bold">
        <span class="flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
          <span>💰</span>
          <span>${t('netAFSectionTitle')}</span>
        </span>
        <span class="text-xs font-extrabold ${isBrokenEven && totalAnnualFees > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}">
          ${totalAnnualFees === 0 ? t('netAFCardZero') : (isBrokenEven ? t('netAFBreakEven').replace('${n}', Math.round(totalClaimedAnnualValue - totalAnnualFees)) : t('netAFRemaining').replace('${n}', '$' + Math.round(netDiff)))}
        </span>
      </div>
      <div class="w-full bg-black/20 dark:bg-black/40 rounded-full h-2 overflow-hidden flex shadow-inner">
        <div class="${isBrokenEven ? 'bg-emerald-500' : 'bg-indigo-600'} h-full transition-all duration-500" style="width: ${Math.min(100, pctNum)}%"></div>
      </div>
      <div class="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>${t('annualFeeLabel')}: $${totalAnnualFees.toLocaleString()} · ${t('statClaimedPrefix')}: $${Math.round(totalClaimedAnnualValue).toLocaleString()}</span>
        <span>${t('netAFProgress')} ${pctNum}%</span>
      </div>
    </div>
  `;
}

function buildAnnualPeriodSectionCardHtml(sec, fmt) {
  const itemsHtml = sec.items.length > 0
    ? sec.items.map(it => `
        <div class="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
          <span class="truncate text-slate-700 dark:text-slate-300 font-medium mr-2">
            ${pickText(it.title)} <span class="text-slate-400 text-[10px]">(${pickText(it.card)})</span>
          </span>
          <span class="shrink-0 font-bold text-slate-800 dark:text-slate-200">
            +${fmt(it.amount)}
          </span>
        </div>
      `).join('')
    : `<div class="text-[11px] text-slate-400 py-1 italic">${t('annualNoPerksInPeriod')}</div>`;

  return `
    <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-base">${sec.icon}</span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${sec.title}</span>
          <span class="px-1.5 py-0.5 rounded-md text-[10px] font-bold ${sec.colorBadge}">
            ${sec.share}% ${t('shareUnit')}
          </span>
        </div>
        <div class="text-right shrink-0">
          <div class="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            +$${Math.round(sec.annualVal).toLocaleString()} ${t('perYearUnit')}
          </div>
        </div>
      </div>

      <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>${t('formulaLabel')}: ${sec.formulaText}</span>
        <span class="font-bold text-slate-700 dark:text-slate-300">${sec.items.length} ${t('itemsUnit')}</span>
      </div>

      <div class="space-y-0.5 pt-0.5">${itemsHtml}</div>

      ${sec.items.length > 0 ? `
        <div class="pt-1 text-right">
          <button data-action="switch-period-from-modal" data-period="${sec.filterTarget}" class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition inline-flex items-center gap-1 cursor-pointer">
            <span>${t('viewThisPeriodPerks')}</span>
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

const ANNUAL_SECTION_SPECS = [
  { id: 'monthly', titleKey: 'periodMonthly', formulaKey: 'formulaMonthly', mult: 12, icon: '📅', colorBadge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60' },
  { id: 'quarterly', titleKey: 'periodQuarterly', formulaKey: 'formulaQuarterly', mult: 4, icon: '⏳', colorBadge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60' },
  { id: 'semiannual', titleKey: 'periodSemiAnnualLabel', formulaKey: 'formulaSemiannual', mult: 2, icon: '🌓', colorBadge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60' },
  { id: 'annual', titleKey: 'periodAnnual', formulaKey: 'formulaAnnual', mult: 1, icon: '🎁', colorBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' }
];

export function renderAnnualBreakdownModal() {
  const container = document.getElementById('annual-breakdown-content');
  const totalAmountEl = document.getElementById('annual-modal-total-amount');
  const cardsCountEl = document.getElementById('annual-modal-cards-count');
  if (!container) return;

  const ownedCredits = PRESET_CREDITS.filter(item => isCardOwned(item.cardId) && !isCreditMuted(item.id));
  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;
  if (cardsCountEl) cardsCountEl.innerText = `${ownedCount} ${t('cardsCountBadgeSuffix')}`;

  const fmt = (n) => n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
  const rawSections = ANNUAL_SECTION_SPECS.map(spec => {
    const items = ownedCredits.filter(c => c.period === spec.id);
    const face = items.reduce((acc, c) => acc + c.amount, 0);
    return { ...spec, items, face, annualVal: face * spec.mult };
  });
  const totalAnnual = rawSections.reduce((acc, s) => acc + s.annualVal, 0);

  if (totalAmountEl) totalAmountEl.innerText = Math.round(totalAnnual).toLocaleString();

  if (ownedCount === 0 || ownedCredits.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="text-3xl">🎴</div>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          ${t('annualModalNoCardsDesc')}
        </p>
        <button data-action="close-annual-and-open-manage" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer">
          ➕ ${t('btnSelectCards')}
        </button>
      </div>
    `;
    return;
  }

  const utilization = computeAnnualUtilization(ownedCredits, selectedYear, selectedMonth);
  const sectionsHtml = rawSections.map(s => buildAnnualPeriodSectionCardHtml({
    title: t(s.titleKey),
    icon: s.icon,
    colorBadge: s.colorBadge,
    formulaText: t(s.formulaKey).replace('{amt}', fmt(s.face)),
    annualVal: s.annualVal,
    share: totalAnnual > 0 ? ((s.annualVal / totalAnnual) * 100).toFixed(1) : '0',
    items: s.items,
    filterTarget: s.id
  }, fmt)).join('');

  container.innerHTML =
    buildAnnualUtilizationStripHtml(utilization) +
    buildAnnualNetAfStripHtml(utilization.totalClaimedAnnualValue) +
    sectionsHtml;
}

export function renderManageCardsChecklist() {
  const container = document.getElementById('manage-cards-checklist');
  const summaryEl = document.getElementById('manage-cards-count-summary');
  if (!container) return;

  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;
  if (summaryEl) {
    summaryEl.innerText = `${ownedCount} / ${PRESET_CARDS.length} ${t('cardsCountBadgeSuffix')}`;
  }

  container.innerHTML = PRESET_CARDS.map(card => {
    const owned = isCardOwned(card.id);
    const nick = pickText(card.nickname);
    const issuerBg = card.issuer === 'Amex' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200' :
                     card.issuer === 'Chase' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200' :
                     'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';

    const meta = appState.cardMeta?.[card.id];
    let datePill = '';
    if (owned) {
      const dateText = (meta && meta.openedYear && meta.openedMonth)
        ? `${meta.openedYear}/${meta.openedMonth}`
        : (meta && meta.openedMonth ? `${meta.openedMonth}${t('monthUnit')}` : `+ ${t('btnSetDates')}`);
      datePill = `
        <button data-action="open-card-date" data-card-id="${card.id}"
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 shadow-2xs transition shrink-0"
                title="${t('btnSetDates')}">
          📅 ${dateText}
        </button>
      `;
    }

    return `
      <div role="button" tabindex="0" aria-pressed="${owned}"
           data-action="toggle-card-ownership" data-card-id="${card.id}"
           class="p-2.5 sm:p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${owned ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60 shadow-xs' : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'}">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${owned ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'}">
            ${owned ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="px-1.5 py-0.5 rounded-full text-[9px] font-bold ${issuerBg} border">
                ${card.issuer}
              </span>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${nick}</span>
            </div>
            <div class="text-[11px] text-slate-400 truncate mt-0.5">${card.name}</div>
          </div>
        </div>
        <div class="text-right shrink-0 flex items-center gap-2">
          ${datePill}
          <span class="text-xs font-black ${card.annualFee === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}">
            ${card.annualFee === 0 ? t('noAnnualFeeLabel') : '$' + card.annualFee}
          </span>
        </div>
      </div>
    `;
  }).join('');
}
