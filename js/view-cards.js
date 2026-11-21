// CardFlow Cards Grid Subview: Portfolio Filtering, Compact/Detailed View & Deep Links

import { t, pickText } from './i18n.js';
import { DUPLICATE_PERK_GROUPS, PRESET_CARDS } from './data.js';
import {
  today, selectedYear, appState,
  escapeHtml, isCardOwned, getOwnedCardsInPerkGroup
} from './state.js';
import {
  getCardClaimedValueThisYear, getDecisionBadgeInfo, findLinkedCredit
} from './logic.js';

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

export function setCurrentIssuerFilter(val) {
  currentIssuerFilter = val;
}

export function toggleCardDetailExpand(cardId) {
  if (expandedCardIds.has(cardId)) {
    expandedCardIds.delete(cardId);
  } else {
    expandedCardIds.add(cardId);
  }
  renderCards();
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
      const nick = pickText(c.nickname);
      const matchName = c.name.toLowerCase().includes(searchVal);
      const matchNick = nick.toLowerCase().includes(searchVal);
      const matchCat = c.categories.some(cat => {
        const catName = pickText(cat.name);
        return catName.toLowerCase().includes(searchVal) || cat.mult.toLowerCase().includes(searchVal);
      });
      const matchPerk = c.perks.some(p => {
        const perkTitle = pickText(p.title);
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
            <button data-action="open-manage-cards" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5">
              <span>➕</span>
              <span>${t('manageCardsBtnLabel')}</span>
            </button>
            <button data-action="load-demo-pack" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
              <span>⚡</span>
              <span>${t('btnLoadDemoPack')}</span>
            </button>
            <button data-action="set-ownership-filter" data-filter="all" class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition cursor-pointer">
              ${t('btnBrowseAllCards')}
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="col-span-1 sm:col-span-2 p-8 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div class="text-3xl mb-2">🔍</div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${t('noMatchingCards')}</div>
        </div>
      `;
    }
    return;
  }

  filtered.forEach(card => {
    const isOwned = isCardOwned(card.id);
    const el = document.createElement('div');
    el.className = `p-4 sm:p-5 rounded-3xl transition flex flex-col justify-between ${isOwned ? 'bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700' : 'bg-slate-50/70 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 opacity-65 hover:opacity-100'}`;

    const nick = pickText(card.nickname);
    const meta = appState.cardMeta?.[card.id];
    let renewMonth = null;
    if (meta && meta.renewMonth !== undefined && meta.renewMonth !== null) {
      renewMonth = meta.renewMonth === 'No AF' || meta.renewMonth === 0 ? t('noAnnualFeeLabel') : `${meta.renewMonth} ${t('monthUnit')}`;
    } else if (meta && meta.openedMonth) {
      renewMonth = card.annualFee === 0 ? t('noAnnualFeeLabel') : `${meta.openedMonth} ${t('monthUnit')}`;
    } else if (card.renewMonth) {
      renewMonth = pickText(card.renewMonth);
    }
    const openedYearVal = meta?.openedYear || null;

    // Decision Status & Notes
    const decisionInfo = meta?.retentionStatus ? getDecisionBadgeInfo(meta.retentionStatus) : null;
    let decisionBadgeHtml = '';
    if (decisionInfo) {
      decisionBadgeHtml = `
        <button data-action="open-card-date" data-card-id="${card.id}"
                class="px-2 py-0.5 rounded-lg text-[10.5px] font-bold border transition flex items-center gap-1 cursor-pointer shadow-2xs ${decisionInfo.badgeClass}"
                title="${t('btnEditDecisionTooltip')}">
          <span>${decisionInfo.icon}</span>
          <span>${decisionInfo.text}</span>
          <span class="text-[9px] opacity-70">✎</span>
        </button>
      `;
    } else {
      decisionBadgeHtml = `
        <button data-action="open-card-date" data-card-id="${card.id}"
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
        <button data-action="open-card-date" data-card-id="${card.id}"
                class="px-2 py-0.5 rounded-lg font-bold border transition flex items-center gap-1 cursor-pointer shadow-2xs ${decisionInfo.badgeClass}"
                title="${t('btnEditDecisionTooltip')}">
          <span>${decisionInfo.icon}</span>
          <span>${decisionInfo.text}</span>
          ${safeRetentionNote ? `<span class="opacity-80 font-normal truncate max-w-[120px]">(${safeRetentionNote})</span>` : ''}
          <span class="text-[9px] opacity-70">✎</span>
        </button>
      </div>
    ` : '';

    const signupBonus = card.signupBonus ? pickText(card.signupBonus) : null;
    const useForText = card.useFor ? pickText(card.useFor) : null;

    let catList = card.categories.map(cat => {
      const catName = pickText(cat.name);
      return `
        <div class="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 dark:border-slate-800/60">
          <span class="text-slate-600 dark:text-slate-400 font-medium">${catName}</span>
          <span class="font-bold text-amber-600 dark:text-amber-400">${cat.mult}</span>
        </div>
      `;
    }).join('');

    let perkList = card.perks.map(p => {
      const title = pickText(p.title);
      const note = pickText(p.note);

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

          const tipTitle = groupMeta ? pickText(groupMeta.tip) : '';

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
          <button data-action="jump-to-credit" data-credit-id="${linkedCredit.id}"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition cursor-pointer shrink-0 shadow-2xs"
                  title="${t('jumpToCreditTooltip')}">
            <span>⚡</span>
            <span>${t('jumpToCreditBtn')}</span>
          </button>
        `;
      } else if (p.fncLink) {
        jumpActionHtml = `
          <button data-action="jump-to-loyalty"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition cursor-pointer shrink-0 shadow-2xs"
                  title="${t('jumpToLoyaltyTooltip')}">
            <span>🏨</span>
            <span>${t('jumpToLoyaltyBtn')}</span>
          </button>
        `;
      }

      const isClickableTitle = Boolean(linkedCredit || p.fncLink);
      const titleActionAttr = linkedCredit
        ? `role="button" tabindex="0" data-action="jump-to-credit" data-credit-id="${linkedCredit.id}"`
        : p.fncLink
        ? `role="button" tabindex="0" data-action="jump-to-loyalty"`
        : '';

      return `
        <li class="text-[11px] text-slate-600 dark:text-slate-300 flex items-start justify-between gap-1.5 py-0.5">
          <div class="flex items-start gap-1.5 flex-wrap min-w-0">
            <span class="text-indigo-500 font-bold shrink-0">·</span>
            <span ${titleActionAttr} class="${isClickableTitle ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition' : ''}">
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
            <button data-action="toggle-card-expand" data-card-id="${card.id}"
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
          <button data-action="toggle-card-expand" data-card-id="${card.id}"
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

          <button data-action="toggle-card-ownership" data-card-id="${card.id}"
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
              <button data-action="open-card-date" data-card-id="${card.id}"
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
