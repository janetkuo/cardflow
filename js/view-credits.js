// CardFlow Credits Subview: Timeline/Cadence Filters, Claim/Skip/Mute, Reset Month & Net Effective AF

import { t, pickText } from './i18n.js';
import { PRESET_CARDS, PRESET_CREDITS } from './data.js';
import {
  selectedYear, selectedMonth, appState, saveState,
  getMonthKey, isCreditMuted, isCreditSkipped, isCardOwned
} from './state.js';
import {
  computeCreditDashboardData, getCreditCycleInfo, getCardClaimedValueThisYear
} from './logic.js';
import { showToast, openModalEl, closeModalEl, showConfirmDialog } from './ui-core.js';

let currentPeriodFilter = 'monthly';
let currentCreditsViewMode = 'timeline'; // 'timeline' | 'cadence'
let isMutedSectionExpanded = false;
let activePerkActionCreditId = null;
let activePerkActionStateKey = null;
let creditsMuteChangeHandler = null;

export function registerCreditsMuteChangeHandler(fn) {
  creditsMuteChangeHandler = fn;
}

export function getCurrentPeriodFilter() {
  return currentPeriodFilter;
}

export function expandMutedSection() {
  const list = document.getElementById('muted-credits-list');
  const chevron = document.getElementById('muted-section-chevron');
  if (list && list.classList.contains('hidden')) {
    isMutedSectionExpanded = true;
    list.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
}

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
        const nick = pickText(card.nickname);
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

const CADENCE_HINT_KEYS = {
  monthly: 'creditsCadenceHintMonth',
  quarterly: 'creditsCadenceHintQuarter',
  semiannual: 'creditsCadenceHintHalf'
};

const URGENCY_HINT_KEYS = {
  monthly: 'creditsUrgencyHintMonth',
  quarterly: 'creditsUrgencyHintQuarter',
  semiannual: 'creditsUrgencyHintHalf'
};

function renderCreditsEmptyState(container, ownedCount) {
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
          <button data-action="open-manage-cards" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center gap-1.5 cursor-pointer">
            <span>➕</span>
            <span>${t('btnSelectCards')}</span>
          </button>
          <button data-action="load-demo-pack" class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
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
    return;
  }

  container.innerHTML = `
    <div class="p-8 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
      <div class="text-3xl mb-2">💳</div>
      <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${t('noCreditsDue')}</div>
      <div class="text-[11px] text-slate-400 mt-1">${t('noCreditsDueSub')}</div>
    </div>
  `;
}

function buildCreditFeedItemElement({ item, urgency, stateKey, isClaimed, isSkipped }, curYear, curMonth) {
  const titleText = pickText(item.title);
  const cardText = pickText(item.card);
  const tipText = pickText(item.tip);

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

  const urgencyBadgeHtml = (urgency.isExpiringSoon && !isSkipped)
    ? `
      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1 shrink-0 ${isClaimed ? 'opacity-70' : 'animate-pulse shadow-2xs'}">
        <span>⏰</span>
        <span>${urgency.urgencyBadgeText}</span>
      </span>
    `
    : '';

  const skippedBadgeHtml = isSkipped
    ? `
      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 shrink-0">
        ⏭️ ${t('skippedThisCycle')}
      </span>
    `
    : '';

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
    statusSubText = t('expiresThisMo');
  }

  let checkBtnHtml = '';
  if (isClaimed) {
    checkBtnHtml = `
      <button data-action="toggle-credit-claim" data-state-key="${stateKey}" class="w-6 h-6 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer bg-indigo-600 border-indigo-600 text-white">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
      </button>
    `;
  } else if (isSkipped) {
    checkBtnHtml = `
      <button data-action="toggle-credit-skip" data-state-key="${stateKey}" class="w-6 h-6 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400" title="${t('perkActionUnskipThisCycle')}">
        <span class="text-xs">⏭</span>
      </button>
    `;
  } else {
    checkBtnHtml = `
      <button data-action="toggle-credit-claim" data-state-key="${stateKey}" class="w-6 h-6 rounded-xl border flex items-center justify-center transition shrink-0 cursor-pointer border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500">
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
      <button data-action="open-perk-action" data-credit-id="${item.id}" data-state-key="${stateKey}" class="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="${t('managePerkActionTitle')}">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="4" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="10" cy="16" r="2"/></svg>
      </button>
    </div>
  `;
  return cardEl;
}

function updateCreditsDashboardSummary({
  ownedCount, monthlyUnclaimed, monthlyClaimedCount, totalMonthlyItems,
  utilization, counts, displayCount, isCadenceMode, curMonth
}) {
  const {
    totalAnnualPerks, totalClaimedAnnualValue, totalExpiredAnnualValue,
    remainingValue, claimedPct, expiredPct, remainingPct
  } = utilization;

  const badgeMonth = document.getElementById('badge-period-month');
  if (badgeMonth) badgeMonth.innerText = `(${counts.month})`;
  const badgeQuarter = document.getElementById('badge-period-quarter');
  if (badgeQuarter) badgeQuarter.innerText = `(${counts.quarter})`;
  const badgeHalf = document.getElementById('badge-period-half');
  if (badgeHalf) badgeHalf.innerText = `(${counts.half})`;
  const badgeYear = document.getElementById('badge-period-year');
  if (badgeYear) badgeYear.innerText = `(${counts.year})`;

  const labelMonth = document.getElementById('label-period-month');
  if (labelMonth) labelMonth.innerText = t('periodTabMonth');
  const labelQuarter = document.getElementById('label-period-quarter');
  if (labelQuarter) labelQuarter.innerText = isCadenceMode ? t('periodQuarterlyLabel') : t('periodTabQuarter');
  const labelHalf = document.getElementById('label-period-half');
  if (labelHalf) {
    labelHalf.innerText = isCadenceMode
      ? t('periodSemiAnnualLabel')
      : (curMonth <= 6 ? t('periodTabHalfH1') : t('periodTabHalfH2'));
  }
  const labelYear = document.getElementById('label-period-year');
  if (labelYear) labelYear.innerText = t('periodTabYear');

  const valEl = document.getElementById('monthly-remaining-val');
  if (valEl) valEl.innerText = monthlyUnclaimed.toFixed(2);
  const dueLabel = document.getElementById('monthly-due-label');
  if (dueLabel) dueLabel.innerText = t('monthlyDueLabel');
  const ratioEl = document.getElementById('monthly-claimed-ratio');
  if (ratioEl) ratioEl.innerText = `${monthlyClaimedCount} / ${totalMonthlyItems || 0}`;
  const unitLabel = document.getElementById('monthly-unit-label');
  if (unitLabel) unitLabel.innerText = t('usedUnit');

  const utilPctEl = document.getElementById('annual-utilization-pct');
  if (utilPctEl) utilPctEl.innerText = `${claimedPct}%`;
  const annualAmount = document.getElementById('annual-value-amount');
  if (annualAmount) annualAmount.innerText = Math.round(totalAnnualPerks).toLocaleString();
  const annualUnit = document.getElementById('annual-unit-label');
  if (annualUnit) annualUnit.innerText = t('perYearUnit');

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

  const legClaimed = document.getElementById('legend-claimed');
  if (legClaimed) legClaimed.innerText = `${t('statClaimedPrefix')} $${Math.round(totalClaimedAnnualValue).toLocaleString()}`;
  const legExpired = document.getElementById('legend-expired');
  if (legExpired) legExpired.innerText = `${t('statExpiredPrefix')} $${Math.round(totalExpiredAnnualValue).toLocaleString()}`;
  const legRemaining = document.getElementById('legend-remaining');
  if (legRemaining) legRemaining.innerText = `${t('statRemainingPrefix')} $${Math.round(remainingValue).toLocaleString()}`;

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

  const allBtn = document.getElementById('period-all-btn');
  if (allBtn) allBtn.innerText = t('periodAll');

  const countLabel = document.getElementById('credits-count-label');
  if (countLabel) countLabel.innerText = `${displayCount} ${t('itemsUnit')}`;

  const hintEl = document.getElementById('credits-urgency-hint');
  if (hintEl) {
    const map = isCadenceMode ? CADENCE_HINT_KEYS : URGENCY_HINT_KEYS;
    const defaultKey = isCadenceMode ? 'creditsCadenceHintYear' : 'creditsUrgencyHintYear';
    hintEl.innerText = t(map[currentPeriodFilter] || defaultKey);
  }
}

export function renderCredits() {
  const container = document.getElementById('credits-feed-container');
  if (!container) return;
  container.innerHTML = '';

  const curYear = selectedYear;
  const curMonth = selectedMonth;
  const allOwnedCredits = PRESET_CREDITS.filter(item => isCardOwned(item.cardId));
  const ownedCredits = allOwnedCredits.filter(item => !isCreditMuted(item.id));
  const mutedOwnedCredits = allOwnedCredits.filter(item => isCreditMuted(item.id));
  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;
  const isCadenceMode = currentCreditsViewMode === 'cadence';

  const dashboard = computeCreditDashboardData({
    ownedCredits,
    curYear,
    curMonth,
    periodFilter: currentPeriodFilter,
    viewMode: currentCreditsViewMode
  });

  if (ownedCount === 0 || dashboard.preparedItems.length === 0) {
    renderCreditsEmptyState(container, ownedCount);
  } else {
    dashboard.preparedItems.forEach(entry => {
      container.appendChild(buildCreditFeedItemElement(entry, curYear, curMonth));
    });
  }

  updateCreditsDashboardSummary({
    ownedCount,
    monthlyUnclaimed: dashboard.monthlyUnclaimed,
    monthlyClaimedCount: dashboard.monthlyClaimedCount,
    totalMonthlyItems: dashboard.totalMonthlyItems,
    utilization: dashboard.utilization,
    counts: dashboard.counts,
    displayCount: dashboard.preparedItems.length,
    isCadenceMode,
    curMonth
  });

  renderMutedCreditsSection(mutedOwnedCredits);
  renderNetEffectiveAF();
}

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
    const titleText = pickText(item.title);
    const cardText = pickText(item.card);
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
        <button data-action="unmute-credit" data-credit-id="${item.id}" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-2xs transition shrink-0 cursor-pointer flex items-center gap-1">
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

  const cardText = pickText(credit.card);
  const titleText = pickText(credit.title);

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

export function skipActivePerk() {
  if (activePerkActionStateKey) {
    toggleCreditSkip(activePerkActionStateKey);
    closePerkActionModal();
  }
}

export function muteActivePerk() {
  if (activePerkActionCreditId) {
    muteCredit(activePerkActionCreditId);
    closePerkActionModal();
  }
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
  if (creditsMuteChangeHandler) creditsMuteChangeHandler();
  showToast(t('toastPerkMuted'));
}

export function unmuteCredit(creditId) {
  if (appState.mutedCredits && appState.mutedCredits[creditId]) {
    delete appState.mutedCredits[creditId];
  }
  saveState();
  renderCredits();
  if (creditsMuteChangeHandler) creditsMuteChangeHandler();
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
