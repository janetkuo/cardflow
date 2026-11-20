// CardFlow UI Views, Charts, Filters & Action Handlers

import { MORANDI_PALETTES, CREDIT_CATEGORY_META } from './palettes.js';
import { currentLang, setCurrentLang, t } from './i18n.js';
import { DUPLICATE_PERK_GROUPS, PRESET_CARDS, PRESET_CREDITS, ADVISOR_RULES } from './data.js';
import {
  THEME_KEY, PALETTE_KEY, ADVISOR_MODE_KEY, ACTIVE_TAB_KEY, VALID_SUBVIEWS,
  today, selectedYear, selectedMonth,
  currentTheme, setCurrentTheme, currentPalette, setCurrentPalette,
  appState, normalizeAppState, saveState,
  escapeHtml, getMonthKey, isCreditMuted, isCreditSkipped, isCardOwned, getOwnedCardsInPerkGroup
} from './state.js';
import {
  describeDonutArc, computeAnnualUtilization, getCreditUrgencyInfo,
  getCreditCycleInfo, getCardClaimedValueThisYear, getDecisionBadgeInfo, findLinkedCredit
} from './logic.js';
import { showToast, openModalEl, closeModalEl, showConfirmDialog } from './ui-core.js';
import { updateDriveUI } from './drive.js';

export function setCardOwnership(cardId, isOwned) {
  if (!appState.ownedCards) {
    appState.ownedCards = {};
  }
  appState.ownedCards[cardId] = !!isOwned;
  saveState();
  renderAllViews();
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
  renderAllViews();
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
  renderAllViews();
  showToast(t('toastDemoLoaded'));
}


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


let activeCardDateId = null;

export function openCardDateModal(cardId) {
  const modal = document.getElementById('card-date-modal');
  const card = PRESET_CARDS.find(c => c.id === cardId);
  if (!modal || !card) return;

  activeCardDateId = cardId;
  const nick = typeof card.nickname === 'object' ? (card.nickname[currentLang] || card.nickname['zh-TW']) : card.nickname;
  
  const subEl = document.getElementById('card-date-modal-sub');
  if (subEl) {
    subEl.innerText = `${nick} (${card.issuer} · ${card.annualFee === 0 ? t('noAnnualFeeLabel') : '$' + card.annualFee})`;
  }

  const meta = appState.cardMeta?.[cardId] || {};

  const yearSelect = document.getElementById('card-date-year-select');
  if (yearSelect) {
    let yearOptions = `<option value="">${t('cardDateYearSelectDefault')}</option>`;
    const curYear = new Date().getFullYear();
    for (let y = curYear + 1; y >= 2015; y--) {
      const selected = meta.openedYear === y ? 'selected' : '';
      yearOptions += `<option value="${y}" ${selected}>${y}${currentLang === 'zh-TW' ? ' 年' : ''}</option>`;
    }
    yearSelect.innerHTML = yearOptions;
    yearSelect.value = meta.openedYear ? String(meta.openedYear) : '';
  }

  const monthSelect = document.getElementById('card-date-month-select');
  if (monthSelect) {
    let monthOptions = `<option value="">${t('cardDateMonthSelectDefault')}</option>`;
    const monthNamesEn = ['Jan (1)', 'Feb (2)', 'Mar (3)', 'Apr (4)', 'May (5)', 'Jun (6)', 'Jul (7)', 'Aug (8)', 'Sep (9)', 'Oct (10)', 'Nov (11)', 'Dec (12)'];
    for (let m = 1; m <= 12; m++) {
      const selected = meta.openedMonth === m ? 'selected' : '';
      const mText = currentLang === 'zh-TW' ? `${m} 月` : monthNamesEn[m - 1];
      monthOptions += `<option value="${m}" ${selected}>${mText}</option>`;
    }
    monthSelect.innerHTML = monthOptions;
    monthSelect.value = meta.openedMonth ? String(meta.openedMonth) : '';
  }

  const renewSelect = document.getElementById('card-date-renew-select');
  if (renewSelect) {
    let renewOptions = `<option value="">${t('cardDateRenewSelectDefault')}</option>`;
    if (card.annualFee === 0) {
      renewOptions += `<option value="0" ${meta.renewMonth === 0 || meta.renewMonth === 'No AF' ? 'selected' : ''}>${t('cardDateRenewNoAf')}</option>`;
    }
    const monthNamesEn = ['Jan (1)', 'Feb (2)', 'Mar (3)', 'Apr (4)', 'May (5)', 'Jun (6)', 'Jul (7)', 'Aug (8)', 'Sep (9)', 'Oct (10)', 'Nov (11)', 'Dec (12)'];
    for (let m = 1; m <= 12; m++) {
      const selected = Number(meta.renewMonth) === m ? 'selected' : '';
      const mText = currentLang === 'zh-TW' ? `${m} 月` : monthNamesEn[m - 1];
      renewOptions += `<option value="${m}" ${selected}>${mText}</option>`;
    }
    renewSelect.innerHTML = renewOptions;
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
  renderAllViews();
  showToast(t('toastDateSaved'));
}

export function clearCardDate() {
  if (!activeCardDateId) return;
  if (appState.cardMeta && appState.cardMeta[activeCardDateId]) {
    delete appState.cardMeta[activeCardDateId];
    saveState();
  }
  closeCardDateModal();
  renderAllViews();
  showToast(t('toastDateCleared'));
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

export function switchPeriodFromModal(p) {
  closeAnnualBreakdownModal();
  setPeriodFilter(p);
  const feed = document.getElementById('credits-feed-container');
  if (feed) {
    feed.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}


export function renderAnnualBreakdownModal() {
  const container = document.getElementById('annual-breakdown-content');
  const totalAmountEl = document.getElementById('annual-modal-total-amount');
  const cardsCountEl = document.getElementById('annual-modal-cards-count');
  if (!container) return;

  const ownedCredits = PRESET_CREDITS.filter(item => isCardOwned(item.cardId) && !isCreditMuted(item.id));
  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;

  if (cardsCountEl) {
    cardsCountEl.innerText = `${ownedCount} ${t('cardsCountBadgeSuffix')}`;
  }

  // Calculate stats for all 4 periods
  const monthlyCredits = ownedCredits.filter(c => c.period === 'monthly');
  const qtrCredits = ownedCredits.filter(c => c.period === 'quarterly');
  const semiCredits = ownedCredits.filter(c => c.period === 'semiannual');
  const annualCredits = ownedCredits.filter(c => c.period === 'annual');

  const monthlyFace = monthlyCredits.reduce((acc, c) => acc + c.amount, 0);
  const monthlyAnnual = monthlyFace * 12;

  const qtrFace = qtrCredits.reduce((acc, c) => acc + c.amount, 0);
  const qtrAnnual = qtrFace * 4;

  const semiFace = semiCredits.reduce((acc, c) => acc + c.amount, 0);
  const semiAnnual = semiFace * 2;

  const annualFace = annualCredits.reduce((acc, c) => acc + c.amount, 0);
  const annualAnnual = annualFace;

  const totalAnnual = monthlyAnnual + qtrAnnual + semiAnnual + annualAnnual;

  if (totalAmountEl) {
    totalAmountEl.innerText = Math.round(totalAnnual).toLocaleString();
  }

  if (ownedCount === 0 || ownedCredits.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
        <div class="text-3xl">🎴</div>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          ${t('annualModalNoCardsDesc')}
        </p>
        <button onclick="closeAnnualBreakdownModal(); openManageCardsModal();" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer">
          ➕ ${t('btnSelectCards')}
        </button>
      </div>
    `;
    return;
  }

  const fmt = (n) => n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
  const pct = (part) => totalAnnual > 0 ? ((part / totalAnnual) * 100).toFixed(1) : '0';

  // Calculate annual utilization metrics (Claimed vs Expired vs Remaining)
  const {
    totalClaimedAnnualValue,
    totalExpiredAnnualValue,
    remainingValue,
    claimedPct,
    expiredPct,
    remainingPct
  } = computeAnnualUtilization(ownedCredits, selectedYear, selectedMonth);

  const utilizationCardHtml = `
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

  const totalAnnualFees = PRESET_CARDS.filter(c => isCardOwned(c.id)).reduce((acc, c) => acc + c.annualFee, 0);
  const netDiff = totalAnnualFees - totalClaimedAnnualValue;
  const isBrokenEven = totalClaimedAnnualValue >= totalAnnualFees;

  const netAfModalHtml = `
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
        <div class="${isBrokenEven ? 'bg-emerald-500' : 'bg-indigo-600'} h-full transition-all duration-500" style="width: ${totalAnnualFees > 0 ? Math.min(100, Math.round((totalClaimedAnnualValue / totalAnnualFees) * 100)) : 100}%"></div>
      </div>
      <div class="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>${t('annualFeeLabel')}: $${totalAnnualFees.toLocaleString()} · ${t('statClaimedPrefix')}: $${Math.round(totalClaimedAnnualValue).toLocaleString()}</span>
        <span>${t('netAFProgress')} ${totalAnnualFees > 0 ? Math.round((totalClaimedAnnualValue / totalAnnualFees) * 100) : 100}%</span>
      </div>
    </div>
  `;

  const sections = [
    {
      id: 'monthly',
      title: t('periodMonthly'),
      icon: '📅',
      colorBadge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
      formulaText: currentLang === 'zh-TW' ? `${fmt(monthlyFace)}/月 × 12 個月` : `${fmt(monthlyFace)}/mo × 12 mos`,
      annualVal: monthlyAnnual,
      share: pct(monthlyAnnual),
      items: monthlyCredits,
      filterTarget: 'monthly'
    },
    {
      id: 'quarterly',
      title: t('periodQuarterly'),
      icon: '⏳',
      colorBadge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60',
      formulaText: currentLang === 'zh-TW' ? `${fmt(qtrFace)}/季 × 4 季` : `${fmt(qtrFace)}/qtr × 4 qtrs`,
      annualVal: qtrAnnual,
      share: pct(qtrAnnual),
      items: qtrCredits,
      filterTarget: 'quarterly'
    },
    {
      id: 'semiannual',
      title: currentLang === 'zh-TW' ? '半年期折抵' : 'Semi-Annual',
      icon: '🌓',
      colorBadge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60',
      formulaText: currentLang === 'zh-TW' ? `${fmt(semiFace)}/半年 × 2 次` : `${fmt(semiFace)}/cycle × 2 cycles`,
      annualVal: semiAnnual,
      share: pct(semiAnnual),
      items: semiCredits,
      filterTarget: 'semiannual'
    },
    {
      id: 'annual',
      title: t('periodAnnual'),
      icon: '🎁',
      colorBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
      formulaText: currentLang === 'zh-TW' ? `${fmt(annualFace)}/年 × 1 次` : `${fmt(annualFace)}/yr × 1 cycle`,
      annualVal: annualAnnual,
      share: pct(annualAnnual),
      items: annualCredits,
      filterTarget: 'annual'
    }
  ];

  container.innerHTML = utilizationCardHtml + netAfModalHtml + sections.map(sec => {
    const itemsHtml = sec.items.length > 0
      ? sec.items.map(it => {
          const tText = typeof it.title === 'object' ? (it.title[currentLang] || it.title['zh-TW']) : it.title;
          const cText = typeof it.card === 'object' ? (it.card[currentLang] || it.card['zh-TW']) : it.card;
          return `
            <div class="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
              <span class="truncate text-slate-700 dark:text-slate-300 font-medium mr-2">
                ${tText} <span class="text-slate-400 text-[10px]">(${cText})</span>
              </span>
              <span class="shrink-0 font-bold text-slate-800 dark:text-slate-200">
                +${fmt(it.amount)}
              </span>
            </div>
          `;
        }).join('')
      : `<div class="text-[11px] text-slate-400 py-1 italic">${currentLang === 'zh-TW' ? '目前無此週期之權益' : 'No perks active in this period'}</div>`;

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

        <div class="space-y-0.5 pt-0.5">
          ${itemsHtml}
        </div>

        ${sec.items.length > 0 ? `
          <div class="pt-1 text-right">
            <button onclick="switchPeriodFromModal('${sec.filterTarget}')" class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition inline-flex items-center gap-1 cursor-pointer">
              <span>${t('viewThisPeriodPerks')}</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
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
    const nick = typeof card.nickname === 'object' ? (card.nickname[currentLang] || card.nickname['zh-TW']) : card.nickname;
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
        <button onclick="event.stopPropagation(); openCardDateModal('${card.id}')"
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 shadow-2xs transition shrink-0"
                title="${t('btnSetDates')}">
          📅 ${dateText}
        </button>
      `;
    }

    return `
      <div role="button" tabindex="0" aria-pressed="${owned}"
           onclick="toggleCardOwnership('${card.id}')"
           onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCardOwnership('${card.id}'); }"
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

// --- 6. THEME & PALETTE LOGIC ---
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
    btn.onclick = () => applyPalette(p.id);
    btn.innerHTML = `
      <span class="w-5 h-5 rounded-full shadow-xs" style="background-color: ${p.primary}"></span>
      <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">${p.name[currentLang] || p.name['zh-TW']}</span>
    `;
    container.appendChild(btn);
  });
}

// --- 7. BILINGUAL TRANSLATION (i18n) ---

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


// --- 9. RENDER DUE CREDITS ---
let currentPeriodFilter = 'monthly';


let currentCreditsViewMode = 'timeline'; // 'timeline' | 'cadence'

export function setCreditsViewMode(mode) {
  currentCreditsViewMode = mode;
  const timeBtn = document.getElementById('view-mode-timeline-btn');
  const cadBtn = document.getElementById('view-mode-cadence-btn');
  if (timeBtn && cadBtn) {
    if (mode === 'timeline') {
      timeBtn.className = 'py-1 px-2.5 rounded-lg transition flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold';
      cadBtn.className = 'py-1 px-2.5 rounded-lg transition flex items-center gap-1 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-bold';
    } else {
      timeBtn.className = 'py-1 px-2.5 rounded-lg transition flex items-center gap-1 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-bold';
      cadBtn.className = 'py-1 px-2.5 rounded-lg transition flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs font-bold';
    }
  }
  renderCredits();
}


export function renderNetEffectiveAF() {
  const curYear = selectedYear;
  const ownedCards = PRESET_CARDS.filter(c => isCardOwned(c.id));
  const totalAnnualFees = ownedCards.reduce((acc, c) => acc + c.annualFee, 0);

  let totalClaimedOffsets = 0;
  const cardStats = ownedCards.map(c => {
    const claimed = getCardClaimedValueThisYear(c.id, curYear);
    totalClaimedOffsets += claimed;
    const netCost = c.annualFee - claimed;
    const pct = c.annualFee > 0 ? Math.round((claimed / c.annualFee) * 100) : 100;
    return { card: c, claimed, netCost, pct };
  });

  cardStats.sort((a, b) => b.card.annualFee - a.card.annualFee);

  const netDiff = totalAnnualFees - totalClaimedOffsets;
  const breakEvenPct = totalAnnualFees > 0 ? Math.min(100, Math.round((totalClaimedOffsets / totalAnnualFees) * 100)) : 100;
  const isFullyBrokenEven = totalAnnualFees > 0 ? (totalClaimedOffsets >= totalAnnualFees) : true;

  // 1. Update Hero Banner Strip
  const heroStatusEl = document.getElementById('hero-net-af-status');
  const heroBarEl = document.getElementById('hero-net-af-bar');
  const heroClaimedLabel = document.getElementById('hero-net-af-claimed-label');
  const heroPctLabel = document.getElementById('hero-net-af-pct-label');

  if (heroStatusEl) {
    if (ownedCards.length === 0) {
      heroStatusEl.innerText = `$0 (${t('noOwnedCardsTitle')})`;
    } else if (totalAnnualFees === 0) {
      heroStatusEl.innerText = t('netAFCardZero');
    } else if (isFullyBrokenEven) {
      const profit = Math.round(Math.abs(netDiff));
      heroStatusEl.innerText = t('netAFBreakEven').replace('${n}', profit);
    } else {
      const remainingShort = Math.round(netDiff);
      heroStatusEl.innerText = `$${remainingShort} (${t('netAFRemaining').replace('${n}', '$' + remainingShort)})`;
    }
  }

  if (heroBarEl) {
    heroBarEl.style.width = `${breakEvenPct}%`;
    heroBarEl.className = isFullyBrokenEven
      ? 'bg-emerald-400 h-full transition-all duration-500'
      : 'bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500';
  }

  if (heroClaimedLabel) {
    heroClaimedLabel.innerText = `${t('statClaimedPrefix')} $${Math.round(totalClaimedOffsets).toLocaleString()} / ${t('annualFeeLabel')} $${totalAnnualFees.toLocaleString()}`;
  }

  if (heroPctLabel) {
    heroPctLabel.innerText = `${t('netAFProgress')} ${breakEvenPct}%`;
  }

  // 2. Update Advisor & Analytics Section
  const kpiTotalAfVal = document.getElementById('kpi-total-af-val');
  const kpiClaimedVal = document.getElementById('kpi-claimed-val');
  const kpiNetAfVal = document.getElementById('kpi-net-af-val');
  const netAfStatusBadge = document.getElementById('net-af-status-badge');
  const netAfBarVal = document.getElementById('net-af-bar-val');
  const netAfBarFill = document.getElementById('net-af-bar-fill');
  const cardsListContainer = document.getElementById('net-af-cards-list');

  if (kpiTotalAfVal) kpiTotalAfVal.innerText = `$${totalAnnualFees.toLocaleString()}`;
  if (kpiClaimedVal) kpiClaimedVal.innerText = `$${Math.round(totalClaimedOffsets).toLocaleString()}`;
  if (kpiNetAfVal) {
    if (isFullyBrokenEven && totalAnnualFees > 0) {
      kpiNetAfVal.innerText = `+$${Math.round(Math.abs(netDiff)).toLocaleString()}`;
      kpiNetAfVal.className = 'text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5';
    } else {
      kpiNetAfVal.innerText = `$${Math.round(Math.max(0, netDiff)).toLocaleString()}`;
      kpiNetAfVal.className = 'text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5';
    }
  }

  if (netAfStatusBadge) {
    if (ownedCards.length === 0) {
      netAfStatusBadge.innerText = t('noOwnedCardsTitle');
      netAfStatusBadge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
    } else if (isFullyBrokenEven) {
      const profit = Math.round(Math.abs(netDiff));
      netAfStatusBadge.innerText = `🎉 ${t('netAFBreakEven').replace('${n}', profit)}`;
      netAfStatusBadge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
    } else {
      netAfStatusBadge.innerText = `${t('netAFProgress')} ${breakEvenPct}%`;
      netAfStatusBadge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40';
    }
  }

  if (netAfBarVal) netAfBarVal.innerText = `${breakEvenPct}%`;
  if (netAfBarFill) {
    netAfBarFill.style.width = `${breakEvenPct}%`;
    netAfBarFill.className = isFullyBrokenEven
      ? 'bg-emerald-500 h-full transition-all duration-500'
      : 'bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-500';
  }

  if (cardsListContainer) {
    if (ownedCards.length === 0) {
      cardsListContainer.innerHTML = `
        <div class="p-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          ${t('netAfNoCardsDesc')}
        </div>
      `;
    } else {
      cardsListContainer.innerHTML = cardStats.map(({ card, claimed, netCost, pct }) => {
        const nick = typeof card.nickname === 'object' ? (card.nickname[currentLang] || card.nickname['zh-TW']) : card.nickname;
        const isFree = card.annualFee === 0;
        const isCardBreakEven = isFree || (claimed >= card.annualFee);

        let statusText = '';
        let statusClass = '';
        if (isFree) {
          statusText = t('netAFCardZero');
          statusClass = 'text-emerald-600 dark:text-emerald-400';
        } else if (isCardBreakEven) {
          statusText = `✓ ${t('netAfCardFullyOffset').replace('${n}', Math.round(Math.abs(netCost)))}`;
          statusClass = 'text-emerald-600 dark:text-emerald-400 font-extrabold';
        } else {
          const shortVal = Math.round(netCost);
          statusText = `${t('netEffectiveAF')}: $${shortVal} (${t('netAFCardShort').replace('${n}', '$' + shortVal)})`;
          statusClass = 'text-indigo-600 dark:text-indigo-400 font-bold';
        }

        return `
          <div class="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${card.name}</div>
                <div class="text-[10px] text-slate-400">${nick} · ${card.issuer}</div>
              </div>
              <div class="text-right shrink-0">
                <div class="text-xs ${statusClass}">${statusText}</div>
                <div class="text-[10px] text-slate-400">${t('annualFeeLabel')}: $${card.annualFee}</div>
              </div>
            </div>
            ${!isFree ? `
              <div class="space-y-1 pt-0.5">
                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden flex shadow-inner">
                  <div class="${isCardBreakEven ? 'bg-emerald-500' : 'bg-indigo-600'} h-full transition-all duration-500" style="width: ${Math.min(100, pct)}%"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>${t('statClaimedPrefix')} $${Math.round(claimed).toLocaleString()} / $${card.annualFee}</span>
                  <span>${pct}%</span>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  }
}

export function setPeriodFilter(p) {
  currentPeriodFilter = p === 'all' ? 'annual' : p;
  
  const activePeriod = currentPeriodFilter;
  ['monthly', 'quarterly', 'semiannual', 'annual'].forEach(key => {
    const b = document.getElementById(`period-${key}-btn`);
    if (b) {
      if (key === activePeriod) {
        b.className = 'period-filter-btn py-1.5 px-1 rounded-xl transition bg-indigo-600 text-white shadow-xs cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 font-bold text-xs';
      } else {
        b.className = 'period-filter-btn py-1.5 px-1 rounded-xl transition text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 font-bold text-xs';
      }
    }
  });

  renderCredits();
}

export function renderCredits() {
  const container = document.getElementById('credits-feed-container');
  if (!container) return;
  container.innerHTML = '';

  const curYear = selectedYear;
  const curMonth = selectedMonth;
  const curQuarter = Math.ceil(curMonth / 3);
  const curHalf = curMonth <= 6 ? 1 : 2;
  const mKey = getMonthKey();

  // Filter credits to owned cards only
  const allOwnedCredits = PRESET_CREDITS.filter(item => isCardOwned(item.cardId));
  const ownedCredits = allOwnedCredits.filter(item => !isCreditMuted(item.id));
  const mutedOwnedCredits = allOwnedCredits.filter(item => isCreditMuted(item.id));
  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;

  let monthlyUnclaimed = 0;
  let monthlyClaimedCount = 0;
  let totalMonthlyItems = 0;

  // Pre-calculate urgency info for all active owned credits
  const creditMetaList = ownedCredits.map(item => {
    const urgency = getCreditUrgencyInfo(item, curYear, curMonth);
    return { item, urgency };
  });

  // Calculate monthly pending metrics & annual utilization via shared helper
  ownedCredits.forEach(c => {
    const meta = appState.cardMeta?.[c.cardId];
    const openedMonth = meta?.openedMonth ? Number(meta.openedMonth) : null;

    if (c.period === 'monthly') {
      totalMonthlyItems++;
      const currentMonthClaimed = !!appState.creditsClaimed[`${c.id}_${mKey}`];
      const currentMonthSkipped = isCreditSkipped(`${c.id}_${mKey}`);
      if (currentMonthClaimed) {
        monthlyClaimedCount++;
      } else if (!currentMonthSkipped) {
        monthlyUnclaimed += c.amount;
      }
    } else if (c.period === 'quarterly') {
      if (curMonth % 3 === 0) {
        const isCl = !!appState.creditsClaimed[`${c.id}_${curYear}_Q${curQuarter}`];
        const isSk = isCreditSkipped(`${c.id}_${curYear}_Q${curQuarter}`);
        totalMonthlyItems++;
        if (isCl) {
          monthlyClaimedCount++;
        } else if (!isSk) {
          monthlyUnclaimed += c.amount;
        }
      }
    } else if (c.period === 'semiannual') {
      if (curMonth % 6 === 0) {
        const isCl = !!appState.creditsClaimed[`${c.id}_${curYear}_H${curHalf}`];
        const isSk = isCreditSkipped(`${c.id}_${curYear}_H${curHalf}`);
        totalMonthlyItems++;
        if (isCl) {
          monthlyClaimedCount++;
        } else if (!isSk) {
          monthlyUnclaimed += c.amount;
        }
      }
    } else {
      const isCl = !!appState.creditsClaimed[`${c.id}_${curYear}`];
      const isSk = isCreditSkipped(`${c.id}_${curYear}`);
      const isAnnivThisMonth = openedMonth && openedMonth === curMonth;
      if (curMonth === 12 || isAnnivThisMonth) {
        totalMonthlyItems++;
        if (isCl) {
          monthlyClaimedCount++;
        } else if (!isSk) {
          monthlyUnclaimed += c.amount;
        }
      }
    }
  });

  const {
    totalAnnualPerks,
    totalClaimedAnnualValue,
    totalExpiredAnnualValue,
    remainingValue,
    claimedPct,
    expiredPct,
    remainingPct
  } = computeAnnualUtilization(ownedCredits, curYear, curMonth);

  // Calculate items matching each tab for badge counts (timeline vs pure cadence mode)
  const monthItems = creditMetaList.filter(({ item, urgency }) => urgency.isDueThisMonth);
  const quarterItems = creditMetaList.filter(({ item }) => {
    if (item.period === 'monthly' || item.period === 'quarterly') return true;
    if (item.period === 'semiannual' && (curQuarter === 2 || curQuarter === 4)) return true;
    if (item.period === 'annual') {
      if (item.cycleType === 'anniversary') {
        const annivMonth = appState.cardMeta?.[item.cardId]?.openedMonth ? Number(appState.cardMeta[item.cardId].openedMonth) : null;
        if (annivMonth) return Math.ceil(annivMonth / 3) === curQuarter;
      }
      return curQuarter === 4;
    }
    return false;
  });
  const halfItems = creditMetaList.filter(({ item }) => {
    if (item.period === 'monthly' || item.period === 'quarterly' || item.period === 'semiannual') return true;
    if (item.period === 'annual') {
      if (item.cycleType === 'anniversary') {
        const annivMonth = appState.cardMeta?.[item.cardId]?.openedMonth ? Number(appState.cardMeta[item.cardId].openedMonth) : null;
        if (annivMonth) return (annivMonth <= 6 ? 1 : 2) === curHalf;
      }
      return curHalf === 2;
    }
    return false;
  });
  const yearItems = creditMetaList;

  const monthCadenceItems = creditMetaList.filter(({ item }) => item.period === 'monthly');
  const quarterCadenceItems = creditMetaList.filter(({ item }) => item.period === 'quarterly');
  const halfCadenceItems = creditMetaList.filter(({ item }) => item.period === 'semiannual');
  const yearCadenceItems = creditMetaList.filter(({ item }) => item.period === 'annual');

  const isCadenceMode = currentCreditsViewMode === 'cadence';

  // Update Period Tab Badges & Labels
  const badgeMonth = document.getElementById('badge-period-month');
  if (badgeMonth) badgeMonth.innerText = `(${isCadenceMode ? monthCadenceItems.length : monthItems.length})`;

  const badgeQuarter = document.getElementById('badge-period-quarter');
  if (badgeQuarter) badgeQuarter.innerText = `(${isCadenceMode ? quarterCadenceItems.length : quarterItems.length})`;

  const badgeHalf = document.getElementById('badge-period-half');
  if (badgeHalf) badgeHalf.innerText = `(${isCadenceMode ? halfCadenceItems.length : halfItems.length})`;

  const badgeYear = document.getElementById('badge-period-year');
  if (badgeYear) badgeYear.innerText = `(${isCadenceMode ? yearCadenceItems.length : yearItems.length})`;

  const labelMonth = document.getElementById('label-period-month');
  if (labelMonth) labelMonth.innerText = t('periodTabMonth');

  const labelQuarter = document.getElementById('label-period-quarter');
  if (labelQuarter) labelQuarter.innerText = isCadenceMode ? t('periodQuarterlyLabel') : t('periodTabQuarter');

  const labelHalf = document.getElementById('label-period-half');
  if (labelHalf) {
    if (isCadenceMode) {
      labelHalf.innerText = t('periodSemiAnnualLabel');
    } else {
      labelHalf.innerText = curMonth <= 6 ? t('periodTabHalfH1') : t('periodTabHalfH2');
    }
  }

  const labelYear = document.getElementById('label-period-year');
  if (labelYear) labelYear.innerText = t('periodTabYear');

  // Determine items to display based on active period filter and view mode
  let displayMetaList = monthItems;
  if (isCadenceMode) {
    if (currentPeriodFilter === 'quarterly') {
      displayMetaList = quarterCadenceItems;
    } else if (currentPeriodFilter === 'semiannual') {
      displayMetaList = halfCadenceItems;
    } else if (currentPeriodFilter === 'annual' || currentPeriodFilter === 'all') {
      displayMetaList = yearCadenceItems;
    } else {
      displayMetaList = monthCadenceItems;
    }
  } else {
    if (currentPeriodFilter === 'quarterly') {
      displayMetaList = quarterItems;
    } else if (currentPeriodFilter === 'semiannual') {
      displayMetaList = halfItems;
    } else if (currentPeriodFilter === 'annual' || currentPeriodFilter === 'all') {
      displayMetaList = yearItems;
    } else {
      displayMetaList = monthItems;
    }
  }

  // Determine stateKey and claim status for each item
  const preparedItems = displayMetaList.map(({ item, urgency }) => {
    let stateKey = '';
    if (item.period === 'monthly') {
      stateKey = `${item.id}_${mKey}`;
    } else if (item.period === 'semiannual') {
      stateKey = `${item.id}_${curYear}_H${curHalf}`;
    } else if (item.period === 'quarterly') {
      stateKey = `${item.id}_${curYear}_Q${curQuarter}`;
    } else {
      stateKey = `${item.id}_${curYear}`;
    }
    const isClaimed = !!appState.creditsClaimed[stateKey];
    const isSkipped = isCreditSkipped(stateKey);
    return { item, urgency, stateKey, isClaimed, isSkipped };
  });

  // Sort items: Unclaimed active first, then by urgencyOrder, then by amount desc
  preparedItems.sort((a, b) => {
    const aActive = !a.isClaimed && !a.isSkipped;
    const bActive = !b.isClaimed && !b.isSkipped;
    if (aActive !== bActive) {
      return aActive ? -1 : 1;
    }
    if (a.isClaimed !== b.isClaimed) {
      return a.isClaimed ? 1 : -1;
    }
    if (a.urgency.urgencyOrder !== b.urgency.urgencyOrder) {
      return a.urgency.urgencyOrder - b.urgency.urgencyOrder;
    }
    return b.item.amount - a.item.amount;
  });

  // Empty state handling
  if (ownedCount === 0) {
    container.innerHTML = `
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-dashed border-indigo-200 dark:border-indigo-800/60 text-center space-y-4 shadow-xs">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-3xl shadow-inner">
          💳
        </div>
        <div class="max-w-md mx-auto space-y-1.5">
          <h3 class="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            ${t('onboardingTitle')}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            ${t('onboardingDesc')}
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button onclick="openManageCardsModal()" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-1.5 cursor-pointer">
            <span>➕</span>
            <span>${t('btnSelectCards')}</span>
          </button>
          <button onclick="loadDemoStarterPack()" class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <span>⚡</span>
            <span>${t('btnLoadDemoPack')}</span>
          </button>
        </div>
        <div class="text-[11px] text-slate-400 dark:text-slate-500 pt-2 flex items-center justify-center gap-3 flex-wrap">
          <span>🔒 ${t('onboardingFeature1')}</span>
          <span>·</span>
          <span>${t('onboardingFeature2')}</span>
          <span>·</span>
          <span>${t('onboardingFeature3')}</span>
        </div>
      </div>
    `;
  } else if (preparedItems.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <div class="text-3xl mb-2">💳</div>
        <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${t('noCreditsDue')}</div>
        <div class="text-[11px] text-slate-400 mt-1">${t('noCreditsDueSub')}</div>
      </div>
    `;
  } else {
    preparedItems.forEach(({ item, urgency, stateKey, isClaimed, isSkipped }) => {
      const titleText = typeof item.title === 'object' ? (item.title[currentLang] || item.title['zh-TW']) : item.title;
      const cardText = typeof item.card === 'object' ? (item.card[currentLang] || item.card['zh-TW']) : item.card;
      const tipText = typeof item.tip === 'object' ? (item.tip[currentLang] || item.tip['zh-TW']) : item.tip;

      let cycleBadgeHtml = '';
      if (isClaimed) {
        cycleBadgeHtml = `
          <span class="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 shrink-0">
            ✓ ${t('claimedThisCycle')}
          </span>
        `;
      } else if (!isSkipped) {
        const cycleInfo = getCreditCycleInfo(item, curYear, curMonth);
        const badgeBg = cycleInfo.isExpiringImminent
          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 font-bold'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 font-medium';
        const icon = cycleInfo.isExpiringImminent ? '⏳' : (cycleInfo.isAnniversary ? '📅' : '🗓️');

        cycleBadgeHtml = `
          <span class="px-1.5 py-0.5 rounded-md text-[10px] ${badgeBg} flex items-center gap-1 shrink-0" title="${cycleInfo.cycleText}">
            <span>${icon}</span>
            <span>${cycleInfo.cycleText}</span>
          </span>
        `;
      }

      let urgencyBadgeHtml = '';
      if (urgency.isExpiringSoon && !isSkipped) {
        urgencyBadgeHtml = `
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1 shrink-0 ${isClaimed ? 'opacity-70' : 'animate-pulse shadow-2xs'}">
            <span>⏰</span>
            <span>${urgency.urgencyBadgeText}</span>
          </span>
        `;
      }

      let skippedBadgeHtml = '';
      if (isSkipped) {
        skippedBadgeHtml = `
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 shrink-0">
            ⏭️ ${t('skippedThisCycle')}
          </span>
        `;
      }

      const cardEl = document.createElement('div');
      cardEl.id = `credit-item-${item.id}`;
      let cardBgClass = 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800';
      if (isClaimed) {
        cardBgClass = 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60';
      } else if (isSkipped) {
        cardBgClass = 'bg-slate-50/50 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-70';
      }
      cardEl.className = `p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${cardBgClass}`;

      let statusSubText = isClaimed ? t('claimedThisMonth') : t('readyToClaim');
      if (isSkipped) {
        statusSubText = t('statusSkipped');
      } else if (!isClaimed && urgency.isExpiringSoon) {
        statusSubText = currentLang === 'zh-TW' ? '本月截止' : 'Expires this mo';
      }

      let checkBtnHtml = '';
      if (isClaimed) {
        checkBtnHtml = `
          <button onclick="toggleCreditClaim('${stateKey}')" class="w-6 h-6 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer bg-indigo-600 border-indigo-600 text-white">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
          </button>
        `;
      } else if (isSkipped) {
        checkBtnHtml = `
          <button onclick="toggleCreditSkip('${stateKey}')" class="w-6 h-6 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400" title="${t('perkActionUnskipThisCycle')}">
            <span class="text-xs">⏭</span>
          </button>
        `;
      } else {
        checkBtnHtml = `
          <button onclick="toggleCreditClaim('${stateKey}')" class="w-6 h-6 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500">
          </button>
        `;
      }

      cardEl.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          ${checkBtnHtml}
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs sm:text-sm font-bold ${isClaimed ? 'line-through text-slate-400 dark:text-slate-500' : isSkipped ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}">${titleText}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">${cardText}</span>
              ${urgencyBadgeHtml}
              ${cycleBadgeHtml}
              ${skippedBadgeHtml}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5 truncate">${tipText}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <div class="text-right">
            <div class="text-xs sm:text-sm font-extrabold ${isClaimed || isSkipped ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'}">+$${item.amount.toFixed(2)}</div>
            <div class="text-[10px] ${urgency.isExpiringSoon && !isClaimed && !isSkipped ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'} mt-0.5">${statusSubText}</div>
          </div>
          <button onclick="openPerkActionModal('${item.id}', '${stateKey}')" class="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="${t('managePerkActionTitle')}">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="4" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="10" cy="16" r="2"/></svg>
          </button>
        </div>
      `;
      container.appendChild(cardEl);
    });
  }

  // Update Hero Card Monthly Metrics
  const valEl = document.getElementById('monthly-remaining-val');
  if (valEl) valEl.innerText = monthlyUnclaimed.toFixed(2);

  const dueLabel = document.getElementById('monthly-due-label');
  if (dueLabel) dueLabel.innerText = t('monthlyDueLabel');

  const ratioEl = document.getElementById('monthly-claimed-ratio');
  if (ratioEl) ratioEl.innerText = `${monthlyClaimedCount} / ${totalMonthlyItems || 0}`;

  const unitLabel = document.getElementById('monthly-unit-label');
  if (unitLabel) unitLabel.innerText = t('usedUnit');

  // Update Hero Card Annual Utilization (computed via shared computeAnnualUtilization above)
  const utilPctEl = document.getElementById('annual-utilization-pct');
  if (utilPctEl) {
    utilPctEl.innerText = `${claimedPct}%`;
  }

  const annualAmount = document.getElementById('annual-value-amount');
  if (annualAmount) annualAmount.innerText = Math.round(totalAnnualPerks).toLocaleString();

  const annualUnit = document.getElementById('annual-unit-label');
  if (annualUnit) annualUnit.innerText = t('perYearUnit');

  // Mini Utilization Bar: Emerald (Claimed) + Gray (Expired) + Transparent (Remaining)
  const segMonthly = document.getElementById('bar-segment-monthly');
  const segSemi = document.getElementById('bar-segment-semi');
  const segAnnual = document.getElementById('bar-segment-annual');

  if (segMonthly && segSemi && segAnnual) {
    segMonthly.style.width = `${claimedPct}%`;
    segSemi.style.width = `${expiredPct}%`;
    segAnnual.style.width = `${remainingPct}%`;

    segMonthly.title = `${t('barTitleClaimed')}: $${Math.round(totalClaimedAnnualValue).toLocaleString()} (${claimedPct}%)`;
    segSemi.title = `${t('barTitleExpired')}: $${Math.round(totalExpiredAnnualValue).toLocaleString()} (${expiredPct}%)`;
    segAnnual.title = `${t('barTitleRemaining')}: $${Math.round(remainingValue).toLocaleString()} (${remainingPct}%)`;
  }

  // Micro Legend text
  const legClaimed = document.getElementById('legend-claimed');
  if (legClaimed) legClaimed.innerText = `${t('statClaimedPrefix')} $${Math.round(totalClaimedAnnualValue).toLocaleString()}`;

  const legExpired = document.getElementById('legend-expired');
  if (legExpired) legExpired.innerText = `${t('statExpiredPrefix')} $${Math.round(totalExpiredAnnualValue).toLocaleString()}`;

  const legRemaining = document.getElementById('legend-remaining');
  if (legRemaining) legRemaining.innerText = `${t('statRemainingPrefix')} $${Math.round(remainingValue).toLocaleString()}`;

  // Balance Badge
  const badgeEl = document.getElementById('balance-badge');
  if (badgeEl) {
    if (ownedCount === 0) {
      badgeEl.innerText = t('balanceNoCards');
      badgeEl.className = 'px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/25 backdrop-blur-sm inline-flex items-center gap-1';
    } else if (totalMonthlyItems === 0 || monthlyUnclaimed === 0) {
      badgeEl.innerText = t('balanceHealthy');
      badgeEl.className = 'px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-bold border border-emerald-300/40 backdrop-blur-sm inline-flex items-center gap-1';
    } else {
      badgeEl.innerText = t('balanceAction');
      badgeEl.className = 'px-2.5 py-1 rounded-full bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-300/40 backdrop-blur-sm inline-flex items-center gap-1';
    }
  }

  const donutBadge = document.getElementById('donut-cards-count-badge');
  if (donutBadge) {
    donutBadge.innerHTML = `<span>🎴</span><span>${ownedCount} / ${PRESET_CARDS.length} ${t('cardsCountBadgeSuffix')}</span>`;
    donutBadge.className = 'px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/25 backdrop-blur-sm transition inline-flex items-center gap-1 cursor-pointer';
  }

  // Hidden alias button for verify.py
  const allBtn = document.getElementById('period-all-btn');
  if (allBtn) {
    allBtn.innerText = t('periodAll');
  }

  // Credits Count Label
  const countLabel = document.getElementById('credits-count-label');
  if (countLabel) {
    countLabel.innerText = `${preparedItems.length} ${t('itemsUnit')}`;
  }

  // Urgency hint under segmented tabs
  const hintEl = document.getElementById('credits-urgency-hint');
  if (hintEl) {
    if (isCadenceMode) {
      if (currentPeriodFilter === 'monthly') {
        hintEl.innerText = t('creditsCadenceHintMonth');
      } else if (currentPeriodFilter === 'quarterly') {
        hintEl.innerText = t('creditsCadenceHintQuarter');
      } else if (currentPeriodFilter === 'semiannual') {
        hintEl.innerText = t('creditsCadenceHintHalf');
      } else {
        hintEl.innerText = t('creditsCadenceHintYear');
      }
    } else {
      if (currentPeriodFilter === 'monthly') {
        hintEl.innerText = t('creditsUrgencyHintMonth');
      } else if (currentPeriodFilter === 'quarterly') {
        hintEl.innerText = t('creditsUrgencyHintQuarter');
      } else if (currentPeriodFilter === 'semiannual') {
        hintEl.innerText = t('creditsUrgencyHintHalf');
      } else {
        hintEl.innerText = t('creditsUrgencyHintYear');
      }
    }
  }

  // Render collapsible muted section at bottom of credits feed
  renderMutedCreditsSection(mutedOwnedCredits);

  // Update Net Effective AF indicators & progress
  renderNetEffectiveAF();
}

// --- Muted Credits Section & Perk Action Modal Handlers ---
let isMutedSectionExpanded = false;

export function renderMutedCreditsSection(mutedCredits) {
  const section = document.getElementById('muted-credits-section');
  const countBadge = document.getElementById('muted-section-count-badge');
  const list = document.getElementById('muted-credits-list');
  if (!section || !list) return;

  if (!mutedCredits || mutedCredits.length === 0) {
    section.classList.add('hidden');
    list.innerHTML = '';
    return;
  }

  section.classList.remove('hidden');
  if (countBadge) countBadge.innerText = mutedCredits.length;

  list.innerHTML = mutedCredits.map(item => {
    const titleText = typeof item.title === 'object' ? (item.title[currentLang] || item.title['zh-TW']) : item.title;
    const cardText = typeof item.card === 'object' ? (item.card[currentLang] || item.card['zh-TW']) : item.card;
    const periodLabel = item.period === 'monthly' ? t('periodTabMonth') :
                        item.period === 'quarterly' ? t('periodQuarterly') :
                        item.period === 'semiannual' ? t('periodSemiAnnual') : t('periodTabYear');

    return `
      <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 line-through">${titleText}</span>
            <span class="px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-400">${cardText}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">🔕 ${t('mutedTag')}</span>
          </div>
          <div class="text-[10.5px] text-slate-400 mt-0.5">+$${item.amount.toFixed(2)} (${periodLabel})</div>
        </div>
        <button onclick="unmuteCredit('${item.id}')" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-2xs transition shrink-0 cursor-pointer flex items-center gap-1">
          <span>↩️</span>
          <span>${t('restoreTrackingBtn')}</span>
        </button>
      </div>
    `;
  }).join('');
}

export function toggleMutedCreditsSection() {
  const list = document.getElementById('muted-credits-list');
  const chevron = document.getElementById('muted-section-chevron');
  if (!list) return;
  isMutedSectionExpanded = !isMutedSectionExpanded;
  if (isMutedSectionExpanded) {
    list.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  } else {
    list.classList.add('hidden');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }
}

let activePerkActionCreditId = null;
let activePerkActionStateKey = null;

export function openPerkActionModal(creditId, stateKey) {
  const modal = document.getElementById('perk-action-modal');
  const credit = PRESET_CREDITS.find(c => c.id === creditId);
  if (!modal || !credit) return;

  activePerkActionCreditId = creditId;
  activePerkActionStateKey = stateKey;

  const cardNameEl = document.getElementById('perk-action-modal-card');
  const titleEl = document.getElementById('perk-action-modal-title');
  const skipTitleEl = document.getElementById('perk-action-skip-title');
  const skipSubEl = document.getElementById('perk-action-skip-sub');
  const muteTitleEl = document.getElementById('perk-action-mute-title');
  const muteSubEl = document.getElementById('perk-action-mute-sub');

  const cardText = typeof credit.card === 'object' ? (credit.card[currentLang] || credit.card['zh-TW']) : credit.card;
  const titleText = typeof credit.title === 'object' ? (credit.title[currentLang] || credit.title['zh-TW']) : credit.title;

  if (cardNameEl) cardNameEl.innerText = cardText;
  if (titleEl) titleEl.innerText = titleText;

  const isSkipped = isCreditSkipped(stateKey);
  if (skipTitleEl) {
    skipTitleEl.innerText = isSkipped ? t('perkActionUnskipThisCycle') : t('perkActionSkipThisCycle');
  }
  if (skipSubEl) {
    skipSubEl.innerText = isSkipped ? t('toastPerkUnskipped') : t('perkActionSkipDesc');
  }
  if (muteTitleEl) muteTitleEl.innerText = t('perkActionMutePermanent');
  if (muteSubEl) muteSubEl.innerText = t('perkActionMuteDesc');

  openModalEl(modal);
}

export function closePerkActionModal() {
  const modal = document.getElementById('perk-action-modal');
  closeModalEl(modal);
  activePerkActionCreditId = null;
  activePerkActionStateKey = null;
}

export function toggleCreditSkip(stateKey) {
  if (!appState.skippedCredits) appState.skippedCredits = {};
  const willBeSkipped = !appState.skippedCredits[stateKey];
  appState.skippedCredits[stateKey] = willBeSkipped;

  if (willBeSkipped && appState.creditsClaimed && appState.creditsClaimed[stateKey]) {
    delete appState.creditsClaimed[stateKey];
  }

  saveState();
  renderCredits();
  showToast(willBeSkipped ? t('toastPerkSkipped') : t('toastPerkUnskipped'));
}

export function muteCredit(creditId) {
  if (!appState.mutedCredits) appState.mutedCredits = {};
  appState.mutedCredits[creditId] = true;
  saveState();
  renderCredits();
  renderDonutChart();
  showToast(t('toastPerkMuted'));
}

export function unmuteCredit(creditId) {
  if (appState.mutedCredits && appState.mutedCredits[creditId]) {
    delete appState.mutedCredits[creditId];
  }
  saveState();
  renderCredits();
  renderDonutChart();
  showToast(t('toastPerkUnmuted'));
}

export function toggleCreditClaim(key) {
  if (appState.skippedCredits && appState.skippedCredits[key]) {
    delete appState.skippedCredits[key];
    appState.creditsClaimed[key] = true;
  } else {
    appState.creditsClaimed[key] = !appState.creditsClaimed[key];
  }
  saveState();
  renderCredits();
}

export function performResetCurrentMonth() {
  const mKey = getMonthKey();
  Object.keys(appState.creditsClaimed).forEach(k => {
    if (k.includes(mKey)) delete appState.creditsClaimed[k];
  });
  if (appState.skippedCredits) {
    Object.keys(appState.skippedCredits).forEach(k => {
      if (k.includes(mKey)) delete appState.skippedCredits[k];
    });
  }
  saveState();
  renderCredits();
  showToast(t('toastMonthReset'));
}

export function resetCurrentMonth() {
  showConfirmDialog({
    title: t('confirmResetMonthTitle'),
    message: t('confirmResetMonthDesc'),
    confirmLabel: t('confirmBtnProceed'),
    dangerous: false,
    onConfirm: performResetCurrentMonth
  });
}


// --- 10. RENDER CARDS GRID ---
let currentIssuerFilter = 'all';
let currentOwnershipFilter = 'owned'; // 'owned' by default for intuitive wallet view, or 'all', 'unowned'
export let currentCardsViewMode = 'detailed';
try {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('cardflow_cards_view_mode');
    if (saved === 'compact' || saved === 'detailed') {
      currentCardsViewMode = saved;
    }
  }
} catch (e) {}

export let expandedCardIds = new Set();

export function setOwnershipFilter(mode) {
  currentOwnershipFilter = mode;
  renderCards();
}

export function setCardsViewMode(mode) {
  currentCardsViewMode = mode;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cardflow_cards_view_mode', mode);
    }
  } catch (e) {}
  renderCards();
}

export function toggleCardDetailExpand(cardId) {
  if (expandedCardIds.has(cardId)) {
    expandedCardIds.delete(cardId);
  } else {
    expandedCardIds.add(cardId);
  }
  renderCards();
}


export function jumpToCredit(creditId) {
  const credit = PRESET_CREDITS.find(c => c.id === creditId);
  if (!credit) return;

  if (!isCardOwned(credit.cardId)) {
    showToast(t('toastActivateCardFirst'));
    return;
  }

  switchSubView('credits');

  if (currentPeriodFilter !== 'all' && currentPeriodFilter !== credit.period) {
    setPeriodFilter(credit.period);
  } else {
    renderCredits();
  }

  if (isCreditMuted(credit.id)) {
    const list = document.getElementById('muted-credits-list');
    const chevron = document.getElementById('muted-section-chevron');
    if (list && list.classList.contains('hidden')) {
      isMutedSectionExpanded = true;
      list.classList.remove('hidden');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
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

  const title = typeof credit.title === 'object' ? (credit.title[currentLang] || credit.title['zh-TW']) : credit.title;
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

export function renderCards() {
  const container = document.getElementById('cards-list-container');
  if (!container) return;
  container.innerHTML = '';

  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;
  const unownedCount = PRESET_CARDS.length - ownedCount;

  // Update ownership filter pill buttons
  const allBtn = document.getElementById('card-filter-all-btn');
  const ownedBtn = document.getElementById('card-filter-owned-btn');
  const unownedBtn = document.getElementById('card-filter-unowned-btn');

  if (ownedBtn) {
    ownedBtn.innerText = `${t('filterOwned')} (${ownedCount})`;
    ownedBtn.className = `card-ownership-filter-btn py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${currentOwnershipFilter === 'owned' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`;
  }
  if (allBtn) {
    allBtn.innerText = `${t('filterAllCards')} (${PRESET_CARDS.length})`;
    allBtn.className = `card-ownership-filter-btn py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${currentOwnershipFilter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`;
  }
  if (unownedBtn) {
    unownedBtn.innerText = `${t('filterUnowned')} (${unownedCount})`;
    unownedBtn.className = `card-ownership-filter-btn py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${currentOwnershipFilter === 'unowned' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`;
  }

  // Update view mode toggle buttons
  const compactBtn = document.getElementById('cards-view-compact-btn');
  const detailedBtn = document.getElementById('cards-view-detailed-btn');
  if (compactBtn && detailedBtn) {
    if (currentCardsViewMode === 'compact') {
      compactBtn.className = 'py-1 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 bg-indigo-600 text-white shadow-xs';
      detailedBtn.className = 'py-1 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
    } else {
      detailedBtn.className = 'py-1 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 bg-indigo-600 text-white shadow-xs';
      compactBtn.className = 'py-1 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
    }
  }

  const tabLabelCards = document.getElementById('tab-label-cards');
  if (tabLabelCards) {
    tabLabelCards.innerText = `${t('tabCards')} (${ownedCount})`;
  }
  const mobLabelCards = document.getElementById('mob-label-cards');
  if (mobLabelCards) {
    mobLabelCards.innerText = t('tabCards');
  }

  const searchVal = (document.getElementById('cards-search-input')?.value || '').toLowerCase().trim();

  const filtered = PRESET_CARDS.filter(c => {
    const isOwned = isCardOwned(c.id);
    if (currentOwnershipFilter === 'owned' && !isOwned) return false;
    if (currentOwnershipFilter === 'unowned' && isOwned) return false;
    if (currentIssuerFilter !== 'all' && c.issuer !== currentIssuerFilter) return false;
    if (searchVal) {
      const nick = typeof c.nickname === 'object' ? (c.nickname[currentLang] || c.nickname['zh-TW']) : c.nickname;
      const matchName = c.name.toLowerCase().includes(searchVal);
      const matchNick = nick.toLowerCase().includes(searchVal);
      const matchCat = c.categories.some(cat => {
        const catName = typeof cat.name === 'object' ? (cat.name[currentLang] || cat.name['zh-TW']) : cat.name;
        return catName.toLowerCase().includes(searchVal) || cat.mult.toLowerCase().includes(searchVal);
      });
      const matchPerk = c.perks.some(p => {
        const perkTitle = typeof p.title === 'object' ? (p.title[currentLang] || p.title['zh-TW']) : p.title;
        return perkTitle.toLowerCase().includes(searchVal);
      });
      return matchName || matchNick || matchCat || matchPerk;
    }
    return true;
  });

  if (filtered.length === 0) {
    if (currentOwnershipFilter === 'owned' && ownedCount === 0) {
      container.innerHTML = `
        <div class="col-span-1 sm:col-span-2 p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/60 border-2 border-dashed border-indigo-200 dark:border-indigo-800/60 text-center space-y-4">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-3xl">
            🎴
          </div>
          <div class="max-w-md mx-auto space-y-1.5">
            <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">
              ${t('noOwnedCardsTitle')}
            </h3>
            <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              ${t('noOwnedCardsDesc')}
            </p>
          </div>
          <div class="flex items-center justify-center gap-2.5 pt-1 flex-wrap">
            <button onclick="openManageCardsModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5">
              <span>➕</span>
              <span>${t('manageCardsBtnLabel')}</span>
            </button>
            <button onclick="loadDemoStarterPack()" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
              <span>⚡</span>
              <span>${t('btnLoadDemoPack')}</span>
            </button>
            <button onclick="setOwnershipFilter('all')" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition cursor-pointer">
              ${t('btnBrowseAllCards')}
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="col-span-1 sm:col-span-2 p-8 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div class="text-3xl mb-2">🔍</div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${currentLang === 'zh-TW' ? '找不到符合條件的卡片' : 'No matching cards found'}</div>
        </div>
      `;
    }
    return;
  }

  filtered.forEach(card => {
    const isOwned = isCardOwned(card.id);
    const el = document.createElement('div');
    el.className = `p-4 sm:p-5 rounded-3xl transition flex flex-col justify-between ${isOwned ? 'bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700' : 'bg-slate-50/70 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 opacity-65 hover:opacity-100'}`;

    const nick = typeof card.nickname === 'object' ? (card.nickname[currentLang] || card.nickname['zh-TW']) : card.nickname;
    const meta = appState.cardMeta?.[card.id];
    let renewMonth = null;
    if (meta && meta.renewMonth !== undefined && meta.renewMonth !== null) {
      renewMonth = meta.renewMonth === 'No AF' || meta.renewMonth === 0 ? t('noAnnualFeeLabel') : `${meta.renewMonth} ${t('monthUnit')}`;
    } else if (meta && meta.openedMonth) {
      renewMonth = card.annualFee === 0 ? t('noAnnualFeeLabel') : `${meta.openedMonth} ${t('monthUnit')}`;
    } else if (card.renewMonth) {
      renewMonth = typeof card.renewMonth === 'object' ? (card.renewMonth[currentLang] || card.renewMonth['zh-TW']) : card.renewMonth;
    }
    const openedYearVal = meta?.openedYear || null;

    // Decision Status & Notes
    const decisionInfo = meta?.retentionStatus ? getDecisionBadgeInfo(meta.retentionStatus) : null;
    let decisionBadgeHtml = '';
    if (decisionInfo) {
      decisionBadgeHtml = `
        <button onclick="event.stopPropagation(); openCardDateModal('${card.id}')"
                class="px-2 py-0.5 rounded-lg text-[10.5px] font-bold border transition flex items-center gap-1 cursor-pointer shadow-2xs ${decisionInfo.badgeClass}"
                title="${t('btnEditDecisionTooltip')}">
          <span>${decisionInfo.icon}</span>
          <span>${decisionInfo.text}</span>
          <span class="text-[9px] opacity-70">✎</span>
        </button>
      `;
    } else {
      decisionBadgeHtml = `
        <button onclick="event.stopPropagation(); openCardDateModal('${card.id}')"
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400"
                title="${t('btnEditDecisionTooltip')}">
          <span>📝</span>
          <span>${t('btnRecordDecision')}</span>
        </button>
      `;
    }

    const safeRetentionNote = meta?.retentionNote ? escapeHtml(meta.retentionNote) : '';

    const decisionNoteHtml = safeRetentionNote ? `
      <div class="mt-1 text-[10.5px] px-2 py-1 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <span class="text-indigo-500 font-bold shrink-0">📝</span>
        <span class="truncate"><strong>${t('decisionNotePrefix')}:</strong> ${safeRetentionNote}</span>
      </div>
    ` : '';

    let renewalAlertHtml = '';
    const curM = today.getMonth() + 1;
    const numRenewM = (meta && meta.renewMonth && meta.renewMonth !== 'No AF') ? Number(meta.renewMonth) : (meta?.openedMonth ? Number(meta.openedMonth) : null);
    if (isOwned && card.annualFee > 0 && numRenewM) {
      if (numRenewM === curM) {
        renewalAlertHtml = `
          <div class="mt-2.5 p-2.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/50 space-y-1.5">
            <div class="flex items-center justify-between gap-1.5 flex-wrap">
              <div class="text-[11px] text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1.5">
                <span>⏳</span>
                <span><strong>${t('renewDueThisMonth')}:</strong> $${card.annualFee} · ${t('retentionReminder')}</span>
              </div>
              ${decisionBadgeHtml}
            </div>
            ${decisionNoteHtml}
          </div>
        `;
      } else if (numRenewM === (curM % 12) + 1) {
        renewalAlertHtml = `
          <div class="mt-2.5 p-2.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 space-y-1.5">
            <div class="flex items-center justify-between gap-1.5 flex-wrap">
              <div class="text-[11px] text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1.5">
                <span>⏳</span>
                <span><strong>${t('renewDueNextMonth')}:</strong> $${card.annualFee}</span>
              </div>
              ${decisionBadgeHtml}
            </div>
            ${decisionNoteHtml}
          </div>
        `;
      }
    }

    const standaloneDecisionHtml = (decisionInfo && !renewalAlertHtml) ? `
      <div class="pt-1.5 mt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-1.5 flex-wrap text-[10.5px]">
        <span class="text-slate-400 font-medium">${t('decisionStatusLabel')}:</span>
        <button onclick="event.stopPropagation(); openCardDateModal('${card.id}')"
                class="px-2 py-0.5 rounded-lg font-bold border transition flex items-center gap-1 cursor-pointer shadow-2xs ${decisionInfo.badgeClass}"
                title="${t('btnEditDecisionTooltip')}">
          <span>${decisionInfo.icon}</span>
          <span>${decisionInfo.text}</span>
          ${safeRetentionNote ? `<span class="opacity-80 font-normal truncate max-w-[120px]">(${safeRetentionNote})</span>` : ''}
          <span class="text-[9px] opacity-70">✎</span>
        </button>
      </div>
    ` : '';

    const signupBonus = card.signupBonus ? (typeof card.signupBonus === 'object' ? (card.signupBonus[currentLang] || card.signupBonus['zh-TW']) : card.signupBonus) : null;
    const useForText = card.useFor ? (typeof card.useFor === 'object' ? (card.useFor[currentLang] || card.useFor['zh-TW']) : card.useFor) : null;

    let catList = card.categories.map(cat => {
      const catName = typeof cat.name === 'object' ? (cat.name[currentLang] || cat.name['zh-TW']) : cat.name;
      return `
        <div class="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-400 font-medium">${catName}</span>
          <span class="font-bold text-amber-600 dark:text-amber-400">${cat.mult}</span>
        </div>
      `;
    }).join('');

    let perkList = card.perks.map(p => {
      const title = typeof p.title === 'object' ? (p.title[currentLang] || p.title['zh-TW']) : p.title;
      const note = typeof p.note === 'object' ? (p.note[currentLang] || p.note['zh-TW']) : p.note;

      let overlapBadgeHtml = '';
      if (p.group && isOwned) {
        const ownedInGroup = getOwnedCardsInPerkGroup(p.group);
        if (ownedInGroup.length >= 2) {
          const groupMeta = DUPLICATE_PERK_GROUPS[p.group];
          const badgePrefix = t('overlapBadgePrefix');
          const badgeSuffix = t('overlapBadgeSuffix');

          let tipText = '';
          if (p.group === 'global-entry') {
            tipText = t('overlapBadgeFamilyTip');
          } else if (p.best) {
            tipText = `👑 ${t('overlapBadgeTopChoice')}`;
          } else {
            tipText = t('overlapBadgeBackup');
          }

          const tipTitle = groupMeta ? (groupMeta.tip[currentLang] || groupMeta.tip['zh-TW']) : '';

          overlapBadgeHtml = `
            <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 shrink-0" title="${tipTitle}">
              <span>⚠️</span>
              <span>${badgePrefix} ${ownedInGroup.length} ${badgeSuffix}</span>
              ${tipText ? `<span class="opacity-80">· ${tipText}</span>` : ''}
            </span>
          `;
        }
      }

      // Deeplink & Quick Jump
      const linkedCredit = findLinkedCredit(card.id, p);
      let jumpActionHtml = '';

      if (linkedCredit) {
        jumpActionHtml = `
          <button onclick="event.stopPropagation(); jumpToCredit('${linkedCredit.id}')"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition cursor-pointer shrink-0 shadow-2xs"
                  title="${t('jumpToCreditTooltip')}">
            <span>⚡</span>
            <span>${t('jumpToCreditBtn')}</span>
          </button>
        `;
      } else if (p.fncLink) {
        jumpActionHtml = `
          <button onclick="event.stopPropagation(); jumpToLoyalty()"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer shrink-0 shadow-2xs"
                  title="${t('jumpToLoyaltyTooltip')}">
            <span>🏨</span>
            <span>${t('jumpToLoyaltyBtn')}</span>
          </button>
        `;
      }

      const isClickableTitle = Boolean(linkedCredit || p.fncLink);
      const titleClickAttr = linkedCredit
        ? `onclick="jumpToCredit('${linkedCredit.id}')"`
        : p.fncLink
        ? `onclick="jumpToLoyalty()"`
        : '';

      return `
        <li class="text-[11px] text-slate-600 dark:text-slate-300 flex items-start justify-between gap-1.5 py-0.5">
          <div class="flex items-start gap-1.5 flex-wrap min-w-0">
            <span class="text-indigo-500 font-bold shrink-0">·</span>
            <span ${titleClickAttr} class="${isClickableTitle ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition' : ''}">
              <strong class="${isClickableTitle ? 'underline decoration-dotted decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2' : ''}">${title}</strong>: ${note}
            </span>
            ${overlapBadgeHtml}
          </div>
          ${jumpActionHtml}
        </li>
      `;
    }).join('');

    const issuerBg = card.issuer === 'Amex'
      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/40'
      : card.issuer === 'Chase'
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/40'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/50';

    const ftfBadge = card.noFtf
      ? `<span class="px-1.5 py-0.5 rounded-full text-[9.5px] font-medium bg-emerald-50/70 text-emerald-700/90 dark:bg-emerald-950/30 dark:text-emerald-300/90 border border-emerald-200/60 dark:border-emerald-800/40">${t('noFtfLabel')}</span>`
      : `<span class="px-1.5 py-0.5 rounded-full text-[9.5px] font-medium bg-rose-50/70 text-rose-600/90 dark:bg-rose-950/30 dark:text-rose-400/90 border border-rose-200/60 dark:border-rose-800/40">⚠️ ${t('ftfFeeLabel')} ${card.ftfRate}</span>`;

    const metalBadge = card.metal
      ? `<span class="px-1.5 py-0.5 rounded-full text-[9.5px] font-medium bg-slate-100/80 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50">${t('metalBadge')}</span>`
      : '';

    const ownershipBtnClass = isOwned
      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/60 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300';

    const bonusHtml = signupBonus ? `
      <div class="mt-2 px-2.5 py-1.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-[10.5px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
        <span class="shrink-0">🎁</span>
        <span class="truncate"><strong>${t('signupBonusLabel')}:</strong> ${signupBonus}</span>
      </div>
    ` : '';

    const useForHtml = useForText ? `
      <div class="mt-2.5 p-2.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/40 text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
        <div class="font-bold text-indigo-600 dark:text-indigo-400 mb-0.5 flex items-center gap-1">
          <span>💡</span><span>${t('useForLabel')}</span>
        </div>
        <p class="text-[10.5px] text-slate-600 dark:text-slate-400">${useForText}</p>
      </div>
    ` : '';

    const isExpanded = currentCardsViewMode === 'detailed' || expandedCardIds.has(card.id);

    let detailsHtml = '';
    if (isExpanded) {
      detailsHtml = `
        ${bonusHtml}

        <div class="space-y-1 my-2.5">
          ${catList}
        </div>

        ${useForHtml}

        <div class="pt-2 mt-3 border-t border-slate-100 dark:border-slate-800/80">
          <ul class="space-y-1">
            ${perkList}
          </ul>
        </div>

        ${currentCardsViewMode === 'compact' ? `
          <div class="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
            <button onclick="toggleCardDetailExpand('${card.id}')"
                    class="px-2.5 py-1 rounded-xl text-[10.5px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100/70 dark:bg-slate-800/60 transition cursor-pointer flex items-center gap-1">
              <span>${t('collapseCardDetails')}</span>
              <span>▲</span>
            </button>
          </div>
        ` : ''}
      `;
    } else {
      detailsHtml = `
        <div class="pt-2 mt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            ${card.categories.length} ${t('cardCategoriesCount')} · ${card.perks.length} ${t('cardPerksCount')}
          </span>
          <button onclick="toggleCardDetailExpand('${card.id}')"
                  class="px-2.5 py-1 rounded-xl text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30 transition cursor-pointer flex items-center gap-1">
            <span>${t('expandCardDetails')}</span>
            <span>▼</span>
          </button>
        </div>
      `;
    }

    el.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${issuerBg}">
              ${card.issuer}
            </span>
            ${metalBadge}
            ${ftfBadge}
          </div>

          <button onclick="toggleCardOwnership('${card.id}')"
                  class="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold transition flex items-center gap-1 cursor-pointer border shadow-2xs ${ownershipBtnClass}">
            ${isOwned ? '<span>✓</span> <span>' + t('cardOwned') + '</span>' : '<span>+</span> <span>' + t('cardNotOwned') + '</span>'}
          </button>
        </div>

        <h4 class="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug tracking-tight">${card.name}</h4>
        <div class="text-[11.5px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">${nick}</div>

        <div class="my-2.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[11px] text-slate-400">${t('annualFeeLabel')}: </span>
              <span class="text-xs font-black ${card.annualFee === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}">
                ${card.annualFee === 0 ? t('noAnnualFeeLabel') : '$' + card.annualFee}
              </span>
            </div>
            ${isOwned ? `
              <button onclick="event.stopPropagation(); openCardDateModal('${card.id}')"
                      class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 shadow-2xs transition flex items-center gap-1">
                <span>⚙️</span>
                <span>${(renewMonth || openedYearVal) ? t('btnEditDates') : t('btnSetDates')}</span>
              </button>
            ` : ''}
          </div>
          ${isOwned && card.annualFee > 0 ? (() => {
            const cardClaimedVal = getCardClaimedValueThisYear(card.id, selectedYear);
            const cardNetCost = card.annualFee - cardClaimedVal;
            const cardPct = Math.round((cardClaimedVal / card.annualFee) * 100);
            const isCardBreakEven = cardClaimedVal >= card.annualFee;
            const shortVal = Math.round(cardNetCost);
            return `
              <div class="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div class="flex items-center justify-between text-[11px] font-bold">
                  <span class="text-slate-500 dark:text-slate-400">${t('netEffectiveAF')}</span>
                  <span class="${isCardBreakEven ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-indigo-600 dark:text-indigo-400 font-bold'}">
                    ${isCardBreakEven ? `✓ ${t('netAfCardFullyOffset').replace('${n}', Math.round(Math.abs(cardNetCost)))}` : `$${shortVal} (${t('netAFCardShort').replace('${n}', '$' + shortVal)})`}
                  </span>
                </div>
                <div class="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-1.5 overflow-hidden flex shadow-inner">
                  <div class="${isCardBreakEven ? 'bg-emerald-500' : 'bg-indigo-600'} h-full transition-all duration-500" style="width: ${Math.min(100, cardPct)}%"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>${t('statClaimedPrefix')} $${Math.round(cardClaimedVal).toLocaleString()} / $${card.annualFee}</span>
                  <span>${cardPct}%</span>
                </div>
              </div>
            `;
          })() : ''}
          <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
            ${renewMonth ? `<span>📅 ${t('renewMonthLabel')}: <strong class="text-slate-700 dark:text-slate-200">${renewMonth}</strong></span>` : ''}
            ${openedYearVal ? `<span class="text-slate-300 dark:text-slate-600">|</span><span>${t('openedYearLabel')} <strong class="text-slate-700 dark:text-slate-200">${openedYearVal}</strong></span>` : ''}
          </div>
          ${standaloneDecisionHtml}
        </div>

        ${renewalAlertHtml}

        ${detailsHtml}
      </div>
    `;
    container.appendChild(el);
  });
}

// --- 11. RENDER FNC AWARDS ---
export function renderFncs() {
  const container = document.getElementById('fnc-cards-container');
  if (!container) return;
  container.innerHTML = '';

  const ownedBrilliant = isCardOwned('bonvoy-brilliant');
  const ownedIhg = isCardOwned('ihg-premier');

  // Build combined list of FNCs:
  // 1. Auto-derived from owned hotel cards
  const autoFncs = [];
  const curMonth = today.getMonth() + 1;
  if (ownedBrilliant) {
    const meta = appState.cardMeta?.['bonvoy-brilliant'] || {};
    const renewMonth = meta.renewMonth && meta.renewMonth !== 'No AF' ? Number(meta.renewMonth) : (meta.openedMonth ? Number(meta.openedMonth) : 6);
    const annMonthStr = String(renewMonth).padStart(2, '0');
    const grantYear = (selectedYear === today.getFullYear() && curMonth < renewMonth) ? selectedYear - 1 : selectedYear;
    const expireYear = grantYear + 1;
    const expireDate = `${expireYear}-${annMonthStr}-28`;
    const autoKey = `auto_fnc_brilliant_${grantYear}`;
    const used = !!appState.fncsClaimed?.[autoKey];

    autoFncs.push({
      id: autoKey,
      isAuto: true,
      cardId: 'bonvoy-brilliant',
      name: {
        en: 'Marriott 85k Free Night Award (Annual Renewal)',
        'zh-TW': '萬豪 85,000 分年度免費住宿券 (自動推算)'
      },
      issuer: 'Marriott',
      points: '85,000 pts',
      grantNote: {
        en: `Issued ~Month ${renewMonth} · Valid 1 yr`,
        'zh-TW': `約每年 ${renewMonth} 月出帳入帳 · 效期 1 年`
      },
      expireDate: expireDate,
      used: used
    });
  }

  if (ownedIhg) {
    const meta = appState.cardMeta?.['ihg-premier'] || {};
    const renewMonth = meta.renewMonth && meta.renewMonth !== 'No AF' ? Number(meta.renewMonth) : (meta.openedMonth ? Number(meta.openedMonth) : 6);
    const annMonthStr = String(renewMonth).padStart(2, '0');
    const grantYear = (selectedYear === today.getFullYear() && curMonth < renewMonth) ? selectedYear - 1 : selectedYear;
    const expireYear = grantYear + 1;
    const expireDate = `${expireYear}-${annMonthStr}-28`;
    const autoKey = `auto_fnc_ihg_${grantYear}`;
    const used = !!appState.fncsClaimed?.[autoKey];

    autoFncs.push({
      id: autoKey,
      isAuto: true,
      cardId: 'ihg-premier',
      name: {
        en: 'IHG 50k Free Night Award (Annual Renewal)',
        'zh-TW': 'IHG 50,000 分年度免費住宿券 (自動推算)'
      },
      issuer: 'IHG',
      points: '50,000 pts',
      grantNote: {
        en: `Issued ~Month ${renewMonth} · Valid 1 yr`,
        'zh-TW': `約每年 ${renewMonth} 月出帳入帳 · 效期 1 年`
      },
      expireDate: expireDate,
      used: used
    });
  }

  const allFncs = [...autoFncs, ...(appState.fncs || [])];

  if (allFncs.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 col-span-full">
        <div class="text-2xl mb-1.5">🎟️</div>
        <div class="text-xs font-bold text-slate-700 dark:text-slate-300">${t('fncNoCertificates')}</div>
        <div class="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
          ${t('fncNoCertificatesSub')}
        </div>
      </div>
    `;
    return;
  }

  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  allFncs.forEach(fnc => {
    const expDate = parseLocalYmd(fnc.expireDate) || new Date(fnc.expireDate);
    const diffDays = isNaN(expDate.getTime()) ? 0 : Math.round((expDate - todayMidnight) / (1000 * 60 * 60 * 24));
    const isUrgent = diffDays <= 60 && !fnc.used;

    const nameText = escapeHtml(typeof fnc.name === 'object' ? (fnc.name[currentLang] || fnc.name['zh-TW']) : fnc.name);
    const grantText = fnc.grantNote ? escapeHtml(typeof fnc.grantNote === 'object' ? (fnc.grantNote[currentLang] || fnc.grantNote['zh-TW']) : fnc.grantNote) : null;
    const safeIssuer = escapeHtml(fnc.issuer);
    const safePoints = escapeHtml(fnc.points);
    const safeExpire = escapeHtml(fnc.expireDate);
    const safeIdAttr = escapeHtml(fnc.id);

    const el = document.createElement('div');
    el.className = `p-3.5 rounded-2xl border transition ${fnc.used ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60' : isUrgent ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60' : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'}`;
    
    el.innerHTML = `
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${fnc.issuer === 'Marriott' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'}">
            ${safeIssuer}
          </span>
          ${fnc.isAuto ? `<span class="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">✨ ${t('fncAutoDerived')}</span>` : ''}
        </div>
        <span class="text-xs font-black text-amber-600 dark:text-amber-400">${safePoints}</span>
      </div>
      <div class="text-xs font-bold text-slate-800 dark:text-slate-100 ${fnc.used ? 'line-through text-slate-400' : ''}">${nameText}</div>
      ${grantText ? `<div class="text-[10px] text-slate-400 mt-0.5">${grantText}</div>` : ''}
      <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span>${safeExpire}</span>
          ${!fnc.used ? `<span class="ml-1 font-bold ${isUrgent ? 'text-amber-600 dark:text-amber-400 animate-pulse' : ''}">(${diffDays > 0 ? diffDays + ' ' + t('daysLeft') : t('expired')})</span>` : ''}
        </div>
        <button onclick="toggleFncStatus('${safeIdAttr}')" class="px-2 py-1 rounded-lg border text-[10px] font-bold transition ${fnc.used ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500'}">
          ${fnc.used ? t('markUnused') : t('markRedeemed')}
        </button>
      </div>
    `;
    container.appendChild(el);
  });
}

export function toggleFncStatus(id) {
  if (id.startsWith('auto_')) {
    if (!appState.fncsClaimed) appState.fncsClaimed = {};
    appState.fncsClaimed[id] = !appState.fncsClaimed[id];
  } else {
    const target = appState.fncs.find(f => f.id === id);
    if (target) {
      target.used = !target.used;
    }
  }
  saveState();
  renderFncs();
}

// --- 12. RENDER LOYALTY STATUSES (LEFT PANE) ---
export function renderLoyaltyStatusCards() {
  const container = document.getElementById('loyalty-status-list');
  if (!container) return;

  const statuses = [
    {
      icon: '🏨',
      cardIds: ['bonvoy-brilliant'],
      name: { en: 'Marriott Bonvoy Platinum', 'zh-TW': '萬豪尊貴白金會籍 (Platinum)' },
      desc: { en: 'From Bonvoy Brilliant · Breakfast, Lounge, 4pm Checkout', 'zh-TW': '來自萬豪 Brilliant · 免費雙人早餐、行政酒廊、下午 4 點退房' },
      badge: { en: 'Platinum', 'zh-TW': '白金會籍' },
      badgeCls: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40'
    },
    {
      icon: '✨',
      cardIds: ['ihg-premier'],
      name: { en: 'IHG One Rewards Platinum', 'zh-TW': 'IHG 白金精英會籍 (Platinum)' },
      desc: { en: 'From IHG Premier · 4th Night Free on Award Stays (Grandfathered through 2027)', 'zh-TW': '來自 IHG Premier · 享有一年無限次點數換房住四免一 (持卡享白金至2027底)' },
      badge: { en: 'Platinum', 'zh-TW': '白金會籍' },
      badgeCls: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
    },
    {
      icon: '🏅',
      cardIds: ['amex-biz-plat'],
      name: { en: 'Hilton Honors Gold & Leaders Club', 'zh-TW': '希爾頓金卡 (Gold) & Leaders Club' },
      desc: { en: 'From Amex Biz Plat · Daily Food & Beverage Credit / Breakfast', 'zh-TW': '來自商業大白 · 每日餐飲折抵金或免費早餐、獨立奢華飯店升等' },
      badge: { en: 'Gold', 'zh-TW': '金卡會籍' },
      badgeCls: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
    },
    {
      icon: '🚗',
      cardIds: ['venture-x', 'amex-biz-plat'],
      name: { en: "Hertz President's Circle", 'zh-TW': "Hertz President's Circle 頂級會籍" },
      desc: { en: 'From Venture X & Biz Plat · Ultimate Choice Upgrades', 'zh-TW': '來自 Venture X 與商業大白 · 專屬車位自選升級豪華車款' },
      badge: { en: 'Top Tier', 'zh-TW': '頂級車主' },
      badgeCls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
    }
  ];

  container.innerHTML = statuses.map(s => {
    const isUnlocked = s.cardIds.some(cid => isCardOwned(cid));
    const statusName = s.name[currentLang] || s.name['zh-TW'];
    const statusDesc = s.desc[currentLang] || s.desc['zh-TW'];
    const badgeText = isUnlocked 
      ? (s.badge[currentLang] || s.badge['zh-TW'])
      : (currentLang === 'zh-TW' ? '未持有對應卡片' : 'Card Required');
    const badgeCls = isUnlocked
      ? s.badgeCls
      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border-slate-200 dark:border-slate-700';

    return `
      <div class="p-2.5 rounded-2xl border transition flex items-center justify-between gap-2.5 ${isUnlocked ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800' : 'bg-slate-50/40 dark:bg-slate-800/30 border-dashed border-slate-200 dark:border-slate-800/60 opacity-60'}">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-lg shrink-0">${s.icon}</span>
          <div class="min-w-0">
            <div class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">${statusName}</div>
            <div class="text-[10px] text-slate-400 truncate">${statusDesc}</div>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badgeCls}">
          ${isUnlocked ? '✓ ' + badgeText : badgeText}
        </span>
      </div>
    `;
  }).join('');
}

// --- 13. RENDER TRANSFER CHEAT SHEET (RIGHT PANE) ---
export function renderTransferCheatSheet() {
  const container = document.getElementById('transfer-cheat-list');
  if (!container) return;

  if (currentLang === 'zh-TW') {
    container.innerHTML = `
      <!-- Chase UR -->
      <div class="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-blue-700 dark:text-blue-300">Chase Ultimate Rewards (UR 點數)</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">CSP + CFU + CIC + CIU</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>推薦兌換夥伴:</strong> 聯合航空 United、加拿大航空 Aeroplan、法荷航 Flying Blue、凱悅 World of Hyatt（現行比率 4:3）。<br>
          <span class="text-indigo-600 dark:text-indigo-400 font-medium">💡 歸戶技巧:</span> 在轉點前，務必先將免年費卡（Ink Cash、CFU、CIU）累積的 UR 點數合併至升級後的 CSP 藍寶石卡，即可解鎖 1:1 航空哩程轉點特權！
        </p>
      </div>

      <!-- Amex MR -->
      <div class="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-sky-700 dark:text-sky-300">Amex Membership Rewards (MR 點數)</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold">商業大白 + 商業金卡 + BBP + ED</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>推薦兌換夥伴:</strong> 全日空 ANA（美日往返商務艙神卡）、加拿大航空 Aeroplan、維珍航空 Virgin Atlantic、國泰亞洲萬里通。<br>
          <span class="text-sky-600 dark:text-sky-400 font-medium">💡 35% 點數回饋開票:</span> 商業大白享有「Pay with Points」開機票退還 35% 點數特權（滿 5,000 點起觸發，1 點價值高達 1.54 美分）！免年費的 BBP 更是永久保留手頭 MR 點數的無敵防線。
        </p>
      </div>

      <!-- Capital One Miles -->
      <div class="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300">Capital One 哩程</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">Venture X</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>推薦兌換夥伴:</strong> 土耳其航空 Miles&Smiles（換夏威夷極佳）、哥倫比亞航空 Avianca LifeMiles（星空聯盟免手續費）、英國航空 Avios。<br>
          <span class="text-emerald-600 dark:text-emerald-400 font-medium">💡 旅遊消費一鍵抵扣:</span> 過去 90 天內的任何機票、火車或飯店消費，均能以 1 哩 = 1 美分的比例直接折抵帳單，毫無使用限制！
        </p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-blue-700 dark:text-blue-300">Chase Ultimate Rewards (UR)</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">CSP + CFU + CIC + CIU</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Top Redemptions:</strong> United Airlines, Air Canada Aeroplan, Flying Blue, World of Hyatt (4:3 ratio).<br>
          <span class="text-indigo-600 dark:text-indigo-400 font-medium">💡 Combine Points:</span> Move all UR points from Ink Cash & CFU to CSP before initiating 1:1 partner transfers!
        </p>
      </div>
      <div class="p-3.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-sky-700 dark:text-sky-300">Amex Membership Rewards (MR)</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold">Biz Plat + Biz Gold + BBP + ED</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Top Redemptions:</strong> All Nippon Airways (ANA) roundtrip business, Aeroplan, Virgin Atlantic, Delta.<br>
          <span class="text-sky-600 dark:text-sky-400 font-medium">💡 35% Pay with Points:</span> Biz Plat unlocks 35% points back on Amex Travel flights (min 5k pts, 1pt = 1.54¢)! BBP preserves MR points with $0 annual fee.
        </p>
      </div>
      <div class="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300">Capital One Miles</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">Venture X</span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Top Redemptions:</strong> Turkish Airlines Miles&Smiles, Avianca LifeMiles, British Airways Avios, Singapore Airlines.<br>
          <span class="text-emerald-600 dark:text-emerald-400 font-medium">💡 Purchase Eraser:</span> Instantly redeem at 1.0 ¢/mile against any travel purchase made within the last 90 days.
        </p>
      </div>
    `;
  }
}

// --- 14. SVG DONUT CHART (PocketFlow Arc Algorithm) ---
export function renderDonutChart() {
  const svg = document.getElementById('donut-chart-svg');
  const legend = document.getElementById('donut-legend-list');
  if (!svg || !legend) return;

  const badge = document.getElementById('donut-cards-count-badge');
  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;
  if (badge) {
    badge.innerText = `${ownedCount} / ${PRESET_CARDS.length} ${t('cardsCountBadgeSuffix')}`;
  }

  // Calculate annual category sums dynamically from owned cards' credits
  const catSums = {};
  let totalAnnual = 0;

  PRESET_CREDITS.forEach(cr => {
    if (!isCardOwned(cr.cardId) || isCreditMuted(cr.id)) return;
    let factor = 1;
    if (cr.period === 'monthly') factor = 12;
    else if (cr.period === 'quarterly') factor = 4;
    else if (cr.period === 'semiannual') factor = 2;

    const annualVal = cr.amount * factor;
    catSums[cr.cat] = (catSums[cr.cat] || 0) + annualVal;
    totalAnnual += annualVal;
  });

  const centerTitle = document.getElementById('donut-center-title');
  const centerVal = document.getElementById('donut-center-val');
  const centerSub = document.getElementById('donut-center-sub');

  if (centerTitle) centerTitle.innerText = t('donutCenterTitle');
  if (centerVal) centerVal.innerText = `$${Math.round(totalAnnual).toLocaleString()}`;
  if (centerSub) centerSub.innerText = totalAnnual === 0 ? t('donutNoCreditsSub') : t('donutCenterSub');

  if (totalAnnual === 0) {
    svg.innerHTML = `
      <circle cx="100" cy="100" r="71" fill="none" stroke="#e2e8f0" stroke-width="26" class="dark:stroke-slate-800"/>
    `;
    legend.innerHTML = `
      <div class="col-span-2 text-center py-4 space-y-2">
        <p class="text-xs text-slate-400 dark:text-slate-500">${t('donutNoCredits')}</p>
        <button onclick="openManageCardsModal()" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
          ➕ ${t('manageCardsBtnLabel')}
        </button>
      </div>
    `;
    return;
  }

  const sortedCats = Object.entries(catSums)
    .sort((a, b) => b[1] - a[1])
    .map(([catKey, amount]) => {
      const meta = CREDIT_CATEGORY_META[catKey] || { name: { en: catKey, 'zh-TW': catKey }, color: '#4EB896' };
      return {
        key: catKey,
        name: meta.name,
        color: meta.color,
        amount: amount
      };
    });

  if (sortedCats.length === 1) {
    const c = sortedCats[0];
    const catName = c.name[currentLang] || c.name['zh-TW'];
    svg.innerHTML = `
      <path class="donut-slice" fill="${c.color}"
            d="${describeDonutArc(100, 100, 58, 84, 0, 179.99)} ${describeDonutArc(100, 100, 58, 84, 180, 359.99)}"
            data-cat-name="${catName}" data-cat-amount="${Math.round(c.amount)}" data-cat-pct="100">
      </path>
    `;
  } else {
    const gapDeg = 2.5;
    const totalGaps = gapDeg * sortedCats.length;
    const availableDeg = 360 - totalGaps;
    const minDeg = 6.0;

    let degs = sortedCats.map(c => Math.max((c.amount / totalAnnual) * availableDeg, minDeg));
    const sumDegs = degs.reduce((a, b) => a + b, 0);
    degs = degs.map(d => (d / sumDegs) * availableDeg);

    let currentAngle = 0;
    svg.innerHTML = sortedCats.map((c, idx) => {
      const catName = c.name[currentLang] || c.name['zh-TW'];
      const sliceDeg = degs[idx];
      const startAngle = currentAngle;
      const endAngle = startAngle + sliceDeg;
      currentAngle = endAngle + gapDeg;
      const rawPct = (c.amount / totalAnnual) * 100;
      const pctDisplay = rawPct < 1 && rawPct > 0 ? '< 1' : Math.round(rawPct);

      return `
        <path class="donut-slice" fill="${c.color}"
              d="${describeDonutArc(100, 100, 58, 84, startAngle, endAngle)}"
              data-cat-name="${catName}" data-cat-amount="${Math.round(c.amount)}" data-cat-pct="${pctDisplay}">
        </path>
      `;
    }).join('');
  }

  // Hover & touch interactions on donut slices
  svg.querySelectorAll('.donut-slice').forEach(slice => {
    const handleInspect = () => {
      const name = slice.getAttribute('data-cat-name');
      const amt = Number(slice.getAttribute('data-cat-amount'));
      const pct = slice.getAttribute('data-cat-pct');
      if (centerTitle) centerTitle.innerText = name;
      if (centerVal) centerVal.innerText = `$${amt.toLocaleString()}`;
      if (centerSub) centerSub.innerText = `${pct}% ${t('donutCenterPct')}`;
    };

    const handleReset = () => {
      if (centerTitle) centerTitle.innerText = t('donutCenterTitle');
      if (centerVal) centerVal.innerText = `$${Math.round(totalAnnual).toLocaleString()}`;
      if (centerSub) centerSub.innerText = t('donutCenterSub');
    };

    slice.addEventListener('mouseenter', handleInspect);
    slice.addEventListener('mouseleave', handleReset);
    slice.addEventListener('touchstart', handleInspect, { passive: true });
  });

  // Render Legend
  legend.innerHTML = sortedCats.map(c => {
    const catName = c.name[currentLang] || c.name['zh-TW'];
    const pct = Math.round((c.amount / totalAnnual) * 100);
    return `
      <div class="flex items-center justify-between gap-1 text-[11px] p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${c.color}"></span>
          <span class="text-slate-600 dark:text-slate-300 font-medium truncate">${catName}</span>
        </div>
        <span class="text-slate-400 font-semibold shrink-0">$${Math.round(c.amount)} (${pct}%)</span>
      </div>
    `;
  }).join('');
}

// --- 15. CARD ADVISOR RECOMMENDATION LOGIC ---
export let currentAdvisorCat = 'dining';
let currentAdvisorMode = localStorage.getItem(ADVISOR_MODE_KEY) || 'domestic';

export function setAdvisorMode(mode) {
  currentAdvisorMode = mode;
  try { localStorage.setItem(ADVISOR_MODE_KEY, mode); } catch (_) {}
  updateAdvisorModeUI();
  selectAdvisorCategory(currentAdvisorCat);
}

export function updateAdvisorModeUI() {
  const domBtn = document.getElementById('adv-loc-domestic-btn');
  const ovesBtn = document.getElementById('adv-loc-overseas-btn');
  if (domBtn && ovesBtn) {
    if (currentAdvisorMode === 'overseas') {
      ovesBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer bg-amber-600 text-white shadow-xs font-bold';
      domBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold';
    } else {
      domBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer bg-indigo-600 text-white shadow-xs font-bold';
      ovesBtn.className = 'flex-1 py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold';
    }
  }
}


export function renderChase524() {
  const box = document.getElementById('chase-524-box');
  const badge = document.getElementById('chase-524-badge');
  const detail = document.getElementById('chase-524-detail');
  if (!box || !badge || !detail) return;

  const personalCardIds = PRESET_CARDS.filter(c => !c.isBusiness).map(c => c.id);
  const ownedPersonalCards = personalCardIds.filter(id => isCardOwned(id));

  if (ownedPersonalCards.length === 0) {
    badge.innerText = `0 / 24`;
    badge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    detail.innerHTML = `
      <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>💡 ${t('chase524NoPersonalCards')}</span>
        <button onclick="openManageCardsModal()" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0 ml-2 cursor-pointer">
          ${t('btnSelectCards')} →
        </button>
      </div>
    `;
    return;
  }

  let cardsWithDates = 0;
  let in24Count = 0;
  const recentCards = [];

  const curYear = today.getFullYear();
  const curMonth = today.getMonth() + 1;

  ownedPersonalCards.forEach(id => {
    const meta = appState.cardMeta?.[id];
    if (meta && meta.openedYear && meta.openedMonth) {
      cardsWithDates++;
      const monthsElapsed = (curYear - meta.openedYear) * 12 + (curMonth - meta.openedMonth);
      if (monthsElapsed >= 0 && monthsElapsed < 24) {
        in24Count++;
        const cardObj = PRESET_CARDS.find(c => c.id === id);
        const nick = cardObj ? (typeof cardObj.nickname === 'object' ? (cardObj.nickname[currentLang] || cardObj.nickname['zh-TW']) : cardObj.nickname) : id;
        recentCards.push({
          name: nick,
          date: `${meta.openedYear}/${meta.openedMonth}`,
          monthsLeft: 24 - monthsElapsed
        });
      }
    }
  });

  if (cardsWithDates === 0) {
    badge.innerText = `? / 24`;
    badge.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    detail.innerHTML = `
      <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>💡 ${t('chase524Unset')}</span>
        <button onclick="switchSubView('cards')" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0 ml-2">
          ${t('tabCards').split(' ')[0]} →
        </button>
      </div>
    `;
    return;
  }

  const isSafe = in24Count < 5;
  badge.innerText = `${in24Count} / 24 (${isSafe ? t('chase524Safe') : t('chase524Warning')})`;
  badge.className = `text-xs font-bold px-2.5 py-0.5 rounded-full ${isSafe ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'}`;

  const cardsHtml = recentCards.map(c => `
    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      <strong>${c.name}</strong> (${c.date}) · ${c.monthsLeft} ${t('monthsUntilDrop')}
    </span>
  `).join(' ');

  detail.innerHTML = `
    <div class="space-y-1.5 pt-1">
      <div class="text-[11px] text-slate-600 dark:text-slate-300">
        ${isSafe ? t('chase524SafeDesc').replace('{n}', in24Count).replace('{rem}', 5 - in24Count) : t('chase524WarningDesc').replace('{n}', in24Count)}
      </div>
      ${recentCards.length > 0 ? `<div class="flex flex-wrap gap-1.5 pt-1">${cardsHtml}</div>` : ''}
    </div>
  `;
}

export function renderOverlapOptimizer() {
  const container = document.getElementById('overlap-optimizer-list');
  const badgeEl = document.getElementById('overlap-status-badge');
  if (!container) return;

  const groups = Object.values(DUPLICATE_PERK_GROUPS);
  let totalOverlaps = 0;

  const html = groups.map(group => {
    const ownedCards = getOwnedCardsInPerkGroup(group.id);
    const hasOverlap = ownedCards.length >= 2;
    if (hasOverlap) totalOverlaps++;

    const groupTitle = typeof group.name === 'object' ? (group.name[currentLang] || group.name['zh-TW']) : group.name;
    const groupTip = typeof group.tip === 'object' ? (group.tip[currentLang] || group.tip['zh-TW']) : group.tip;

    let statusPill = '';
    let cardsSummaryHtml = '';

    if (ownedCards.length === 0) {
      statusPill = `<span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">${currentLang === 'zh-TW' ? '未持有' : 'Unowned'}</span>`;
      
      const libraryCards = PRESET_CARDS.filter(c => c.perks && c.perks.some(p => p.group === group.id));
      const libNames = libraryCards.map(c => {
        const nick = typeof c.nickname === 'object' ? (c.nickname[currentLang] || c.nickname['zh-TW']) : c.nickname;
        return nick;
      }).join('、');

      cardsSummaryHtml = `
        <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          ${currentLang === 'zh-TW' ? `全卡庫提供卡片：${libNames}` : `Library benchmark: ${libNames}`}
        </div>
      `;
    } else {
      if (hasOverlap) {
        statusPill = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">⚠️ ${t('overlapBadgePrefix')} ${ownedCards.length} ${t('overlapBadgeSuffix')}</span>`;
      } else {
        statusPill = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">✨ ${currentLang === 'zh-TW' ? '1張卡涵蓋' : '1 Card Owned'}</span>`;
      }

      const cardBadges = ownedCards.map(c => {
        const nick = typeof c.nickname === 'object' ? (c.nickname[currentLang] || c.nickname['zh-TW']) : c.nickname;
        const perkObj = c.perks.find(p => p.group === group.id);
        const isBest = perkObj && perkObj.best;
        const badgeClass = isBest
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 font-bold'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';

        return `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] border ${badgeClass}">
            ${isBest ? '👑 ' : ''}${nick}
          </span>
        `;
      }).join(' ');

      cardsSummaryHtml = `
        <div class="flex items-center gap-1.5 flex-wrap mt-1">
          ${cardBadges}
        </div>
      `;
    }

    return `
      <div class="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-base shrink-0">${group.icon}</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${groupTitle}</span>
          </div>
          ${statusPill}
        </div>
        ${cardsSummaryHtml}
        <div class="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
          <span class="font-bold text-indigo-600 dark:text-indigo-400">💡 ${currentLang === 'zh-TW' ? '最佳策略：' : 'Optimal Action: '}</span>
          ${groupTip}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  if (badgeEl) {
    if (totalOverlaps > 0) {
      badgeEl.innerText = t('overlapStatusDetected').replace('{n}', totalOverlaps);
      badgeEl.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60';
    } else {
      badgeEl.innerText = t('overlapStatusOptimal');
      badgeEl.className = 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
    }
  }
}

export function selectAdvisorCategory(cat) {
  if (cat === 'foreign') {
    currentAdvisorMode = 'overseas';
    try { localStorage.setItem(ADVISOR_MODE_KEY, 'overseas'); } catch (_) {}
    updateAdvisorModeUI();
    cat = (currentAdvisorCat === 'foreign' || !currentAdvisorCat) ? 'dining' : currentAdvisorCat;
  }
  currentAdvisorCat = cat;

  document.querySelectorAll('.adv-cat-btn').forEach(btn => {
    btn.className = 'adv-cat-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
  });

  const activeBtn = document.getElementById(`adv-${cat}-btn`);
  if (activeBtn) {
    activeBtn.className = 'adv-cat-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer bg-indigo-600 text-white border-indigo-600 shadow-xs';
  }

  updateAdvisorModeUI();

  const rule = ADVISOR_RULES[cat] || ADVISOR_RULES.dining;
  const box = document.getElementById('advisor-result-box');
  if (!box || !rule) return;

  const isOverseas = (currentAdvisorMode === 'overseas');
  const modeData = (isOverseas && rule.overseas) ? rule.overseas : (rule.domestic || rule);

  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;

  // Update advisor subheading dynamically
  const subEl = document.getElementById('advisor-subheading');
  if (subEl) {
    if (ownedCount === 0) {
      subEl.innerText = t('advisorSubheadingEmpty');
    } else {
      subEl.innerText = t('advisorSubheadingOwned').replace('{n}', ownedCount);
    }
  }

  const candidateCards = modeData.candidateCards || [];
  const ownedInCat = candidateCards.filter(id => isCardOwned(id));

  let headerBannerHtml = '';
  if (ownedCount === 0) {
    headerBannerHtml = `
      <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50/95 via-sky-50/80 to-blue-50/90 dark:from-blue-950/50 dark:via-slate-900/90 dark:to-blue-950/40 border border-blue-200/90 dark:border-blue-700/60 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-start gap-3 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/70 border border-blue-200/80 dark:border-blue-700/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0 text-base shadow-2xs">
            💡
          </div>
          <div class="min-w-0">
            <div class="text-xs sm:text-[13px] font-extrabold text-blue-950 dark:text-blue-100 flex items-center gap-1.5">
              <span>${t('advisorNoCardsBannerTitle')}</span>
            </div>
            <div class="text-[11px] text-blue-900/80 dark:text-blue-200/85 mt-0.5 leading-relaxed">
              ${t('advisorNoCardsBannerDesc')}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0 self-start sm:self-center pt-0.5 sm:pt-0">
          <button onclick="openManageCardsModal()" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1">
            <span>✨</span>
            <span>${t('btnSelectCards')}</span>
          </button>
          <button onclick="loadDemoStarterPack()" class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700/80 text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1">
            <span>⚡</span>
            <span>${t('btnLoadDemoPack')}</span>
          </button>
        </div>
      </div>
    `;
  } else if (ownedInCat.length > 0) {
    let topCardId = ownedInCat[0];
    if (isOverseas) {
      const topNoFtf = ownedInCat.find(id => {
        const c = PRESET_CARDS.find(card => card.id === id);
        return c && c.noFtf;
      });
      if (topNoFtf) topCardId = topNoFtf;
    }
    const cardObj = PRESET_CARDS.find(c => c.id === topCardId);
    const topMeta = modeData.cards[topCardId];
    const topNick = cardObj ? (typeof cardObj.nickname === 'object' ? (cardObj.nickname[currentLang] || cardObj.nickname['zh-TW']) : cardObj.nickname) : topCardId;

    const isFtfWarning = isOverseas && cardObj && !cardObj.noFtf;

    if (isFtfWarning) {
      headerBannerHtml = `
        <div class="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/40 dark:to-rose-950/30 border border-amber-300 dark:border-amber-700/60 mb-3 space-y-1 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>${t('advisorWalletPick')}: <strong>${topNick}</strong></span>
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-xs">
              ⚠️ ${cardObj.ftfRate} FTF
            </span>
          </div>
          <p class="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            ${t('advisorOverseasFtfWarning')}
          </p>
        </div>
      `;
    } else {
      const bannerBg = isOverseas
        ? 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border-amber-200 dark:border-amber-800/60'
        : 'from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800/60';
      const textTheme = isOverseas
        ? 'text-amber-900 dark:text-amber-200'
        : 'text-emerald-900 dark:text-emerald-200';
      const badgeBg = isOverseas ? 'bg-amber-600' : 'bg-emerald-600';
      const noteTheme = isOverseas
        ? 'text-amber-800 dark:text-amber-300'
        : 'text-emerald-800 dark:text-emerald-300';

      headerBannerHtml = `
        <div class="p-3.5 rounded-2xl bg-gradient-to-r ${bannerBg} border mb-3 space-y-1 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-extrabold ${textTheme} flex items-center gap-1.5">
              <span class="text-sm">${isOverseas ? '🌍' : '👑'}</span>
              <span>${t('advisorWalletPick')}: <strong>${topNick}</strong></span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${badgeBg} text-white shadow-xs">
              ${topMeta ? topMeta.mult : (cardObj && cardObj.noFtf ? '0% FTF' : '')}
            </span>
          </div>
          <p class="text-[11px] ${noteTheme} leading-relaxed">
            ${topMeta ? (topMeta.note[currentLang] || topMeta.note['zh-TW']) : ''}
          </p>
        </div>
      `;
    }
  } else {
    headerBannerHtml = `
      <div class="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 mb-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <span class="text-base leading-none">ℹ️</span>
        <div class="text-[11px] leading-relaxed">
          ${t('advisorNoOwnedInCat')}
        </div>
      </div>
    `;
  }

  const cardsListHtml = candidateCards.map(cId => {
    const cMeta = modeData.cards[cId];
    if (!cMeta) return '';
    const isOwned = isCardOwned(cId);
    const cardObj = PRESET_CARDS.find(c => c.id === cId);
    const nick = cardObj ? (typeof cardObj.nickname === 'object' ? (cardObj.nickname[currentLang] || cardObj.nickname['zh-TW']) : cardObj.nickname) : cId;
    const badgeText = typeof cMeta.badge === 'object' ? (cMeta.badge[currentLang] || cMeta.badge['zh-TW']) : cMeta.badge;
    const noteText = typeof cMeta.note === 'object' ? (cMeta.note[currentLang] || cMeta.note['zh-TW']) : cMeta.note;

    return `
      <div class="p-3 rounded-2xl border transition ${isOwned ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-xs' : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-75'}">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-900 dark:text-white">${nick}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isOwned ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}">
              ${isOwned ? `✓ ${t('cardOwned')}` : t('cardNotOwned')}
            </span>
          </div>
          <span class="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
            ${cMeta.mult} · ${badgeText}
          </span>
        </div>
        <p class="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          ${noteText}
        </p>
      </div>
    `;
  }).join('');

  let ftfTrapHtml = '';
  if (modeData.ftfTraps && modeData.ftfTraps.length > 0) {
    const trapCardsHtml = modeData.ftfTraps.map(trap => {
      const isOwned = isCardOwned(trap.id);
      const cardObj = PRESET_CARDS.find(c => c.id === trap.id);
      const nick = cardObj ? (typeof cardObj.nickname === 'object' ? (cardObj.nickname[currentLang] || cardObj.nickname['zh-TW']) : cardObj.nickname) : trap.id;
      return `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] ${isOwned ? 'font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 border border-rose-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200'}">
          ${nick} (${trap.rate}) ${isOwned ? `· ${t('cardOwned')}` : ''}
        </span>
      `;
    }).join(' ');

    ftfTrapHtml = `
      <div class="p-3 rounded-2xl bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 mt-2 space-y-1.5">
        <div class="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
          <span>⚠️</span>
          <span>${currentLang === 'zh-TW' ? '海外交易手續費 (FTF) 避雷指南' : 'Foreign Transaction Fee (FTF) Traps'}</span>
        </div>
        <p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
          ${currentLang === 'zh-TW' ? '以下卡片出國或刷外幣會額外收取手續費，請務必收進皮夾避免刷卡倒賠：' : 'The following cards charge foreign transaction fees. Never swipe them outside the US:'}
        </p>
        <div class="flex flex-wrap gap-1.5 pt-0.5">
          ${trapCardsHtml}
        </div>
      </div>
    `;
  }

  const catTitle = rule.title[currentLang] || rule.title['zh-TW'];
  const modeBadgeText = isOverseas ? t('advisorModeOverseasBadge') : t('advisorModeDomesticBadge');
  const modeBadgeClass = isOverseas
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700/60'
    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700/60';

  box.innerHTML = `
    <div class="border-b border-slate-200 dark:border-slate-700/60 pb-2.5 mb-2.5">
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <div class="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">${t('advisorHeading')}</div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${modeBadgeClass}">
          ${isOverseas ? '🌍' : '🇺🇸'} ${modeBadgeText}
        </span>
      </div>
      <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">${catTitle}</h4>
      <div class="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
        🏆 ${t('advisorAllLibraryGuide')}: ${modeData.winner}
      </div>
    </div>
    ${headerBannerHtml}
    <div class="space-y-2">
      ${cardsListHtml}
    </div>
    ${ftfTrapHtml}
  `;
}

// --- 16. SUBVIEW SWITCHING ---

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

  // Instantly scroll to top so mobile view immediately reflects the active tab!
  if (typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// --- 17. FOLDABLE OBSERVER (Pixel 10 Pro Fold) ---
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


export function setCurrentIssuerFilter(val) { currentIssuerFilter = val; }
