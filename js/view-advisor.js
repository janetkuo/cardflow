// CardFlow Advisor & Analytics Subview: Donut Chart, Chase 5/24, Overlap Optimizer & Spend Advisor

import { CREDIT_CATEGORY_META } from './palettes.js';
import { currentLang, t } from './i18n.js';
import { DUPLICATE_PERK_GROUPS, PRESET_CARDS, PRESET_CREDITS, ADVISOR_RULES } from './data.js';
import {
  ADVISOR_MODE_KEY, today, appState,
  isCreditMuted, isCardOwned, getOwnedCardsInPerkGroup
} from './state.js';
import { describeDonutArc } from './logic.js';

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
        <button data-action="open-manage-cards" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
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

export let currentAdvisorCat = 'dining';
let currentAdvisorMode = (typeof localStorage !== 'undefined' && localStorage.getItem(ADVISOR_MODE_KEY)) || 'domestic';

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
        <button data-action="open-manage-cards" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0 ml-2 cursor-pointer">
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
        <button data-action="switch-subview" data-tab="cards" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0 ml-2">
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
          <button data-action="open-manage-cards" class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1">
            <span>✨</span>
            <span>${t('btnSelectCards')}</span>
          </button>
          <button data-action="load-demo-pack" class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700/80 text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1">
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
