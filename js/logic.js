// CardFlow Pure Calculations, Cycle Logic & SVG Arc Helpers

import { currentLang, t } from './i18n.js';
import { PRESET_CREDITS } from './data.js';
import { appState, today, selectedYear, selectedMonth, isCreditMuted } from './state.js';

// SVG Arc Math Helpers (PocketFlow algorithm)
export function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = angleInDegrees * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
}

export function describeDonutArc(cx, cy, r_in, r_out, startAngle, endAngle) {
  if (endAngle <= startAngle) return '';
  const p1 = polarToCartesian(cx, cy, r_out, startAngle);
  const p2 = polarToCartesian(cx, cy, r_out, endAngle);
  const p3 = polarToCartesian(cx, cy, r_in, endAngle);
  const p4 = polarToCartesian(cx, cy, r_in, startAngle);
  const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${r_out} ${r_out} 0 ${largeArcFlag} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${r_in} ${r_in} 0 ${largeArcFlag} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    `Z`
  ].join(" ");
}


export function computeAnnualUtilization(creditsList, curYear, curMonth) {
  const curQuarter = Math.ceil(curMonth / 3);
  let totalAnnualPerks = 0;
  let totalClaimedAnnualValue = 0;
  let totalExpiredAnnualValue = 0;

  creditsList.forEach(c => {
    const meta = appState.cardMeta?.[c.cardId];
    const openedYear = meta?.openedYear ? Number(meta.openedYear) : null;
    const openedMonth = meta?.openedMonth ? Number(meta.openedMonth) : null;

    if (c.period === 'monthly') {
      totalAnnualPerks += c.amount * 12;
      for (let m = 1; m <= 12; m++) {
        const mStr = `${curYear}-${String(m).padStart(2, '0')}`;
        const isCl = !!appState.creditsClaimed[`${c.id}_${mStr}`];
        if (isCl) {
          totalClaimedAnnualValue += c.amount;
        } else if (m < curMonth) {
          const wasOwnedThen = !(openedYear === curYear && openedMonth && m < openedMonth);
          if (wasOwnedThen) {
            totalExpiredAnnualValue += c.amount;
          }
        }
      }
    } else if (c.period === 'quarterly') {
      totalAnnualPerks += c.amount * 4;
      for (let q = 1; q <= 4; q++) {
        const isCl = !!appState.creditsClaimed[`${c.id}_${curYear}_Q${q}`];
        if (isCl) {
          totalClaimedAnnualValue += c.amount;
        } else if (q < curQuarter) {
          const qEndMonth = q * 3;
          const wasOwnedInQ = !(openedYear === curYear && openedMonth && openedMonth > qEndMonth);
          if (wasOwnedInQ) {
            totalExpiredAnnualValue += c.amount;
          }
        }
      }
    } else if (c.period === 'semiannual') {
      totalAnnualPerks += c.amount * 2;
      ['H1', 'H2'].forEach((h, idx) => {
        const isCl = !!appState.creditsClaimed[`${c.id}_${curYear}_${h}`];
        if (isCl) {
          totalClaimedAnnualValue += c.amount;
        } else if (idx === 0 && curMonth > 6) {
          const wasOwnedInH1 = !(openedYear === curYear && openedMonth && openedMonth > 6);
          if (wasOwnedInH1) {
            totalExpiredAnnualValue += c.amount;
          }
        }
      });
    } else {
      totalAnnualPerks += c.amount;
      const isCl = !!appState.creditsClaimed[`${c.id}_${curYear}`];
      if (isCl) {
        totalClaimedAnnualValue += c.amount;
      }
    }
  });

  const remainingValue = Math.max(0, totalAnnualPerks - totalClaimedAnnualValue - totalExpiredAnnualValue);
  const claimedPct = totalAnnualPerks > 0 ? Math.min(100, Math.round((totalClaimedAnnualValue / totalAnnualPerks) * 100)) : 0;
  const expiredPct = totalAnnualPerks > 0 ? Math.min(100 - claimedPct, Math.round((totalExpiredAnnualValue / totalAnnualPerks) * 100)) : 0;
  const remainingPct = Math.max(0, 100 - claimedPct - expiredPct);

  return {
    totalAnnualPerks,
    totalClaimedAnnualValue,
    totalExpiredAnnualValue,
    remainingValue,
    claimedPct,
    expiredPct,
    remainingPct
  };
}


export function getCreditUrgencyInfo(item, curYear, curMonth) {
  const meta = appState.cardMeta?.[item.cardId];
  const openedMonth = meta?.openedMonth ? Number(meta.openedMonth) : null;

  let isDueThisMonth = false;
  let isExpiringSoon = false;
  let urgencyBadgeText = '';
  let urgencyOrder = 99; // Lower number = higher urgency

  if (item.period === 'monthly') {
    isDueThisMonth = true;
    urgencyOrder = 10;
  } else if (item.period === 'quarterly') {
    if (curMonth % 3 === 0) {
      isDueThisMonth = true;
      isExpiringSoon = true;
      urgencyBadgeText = t('badgeExpiringQuarter');
      urgencyOrder = 1;
    } else {
      urgencyOrder = 20;
    }
  } else if (item.period === 'semiannual') {
    if (curMonth % 6 === 0) {
      isDueThisMonth = true;
      isExpiringSoon = true;
      urgencyBadgeText = t('badgeExpiringHalf');
      urgencyOrder = 2;
    } else {
      urgencyOrder = 30;
    }
  } else if (item.period === 'annual') {
    if (openedMonth && openedMonth === curMonth) {
      isDueThisMonth = true;
      isExpiringSoon = true;
      urgencyBadgeText = t('badgeExpiringAnniversary');
      urgencyOrder = 3;
    } else if (curMonth === 12) {
      isDueThisMonth = true;
      isExpiringSoon = true;
      urgencyBadgeText = t('badgeExpiringAnnual');
      urgencyOrder = 3;
    } else {
      urgencyOrder = 40;
    }
  }

  return { isDueThisMonth, isExpiringSoon, urgencyBadgeText, urgencyOrder };
}


export function getCreditCycleInfo(item, curYear, curMonth) {
  const meta = appState.cardMeta?.[item.cardId];
  const openedMonth = meta?.openedMonth ? Number(meta.openedMonth) : null;
  const isAnniversary = item.period === 'annual' && item.cycleType === 'anniversary';

  let daysRemaining = null;
  let cycleText = '';
  let isExpiringImminent = false;

  const curDay = today.getDate();
  const isCurrentViewingMonth = (selectedYear === today.getFullYear() && selectedMonth === (today.getMonth() + 1));

  if (item.period === 'monthly') {
    const lastDayOfMonth = new Date(curYear, curMonth, 0).getDate();
    if (isCurrentViewingMonth) {
      daysRemaining = Math.max(0, lastDayOfMonth - curDay);
      if (daysRemaining <= 7) isExpiringImminent = true;
      const daysText = daysRemaining === 0 ? (currentLang === 'zh-TW' ? '今日到期' : 'Due today') : t('daysRemaining').replace('{n}', daysRemaining);
      cycleText = `${daysText} · ${t('resetsMonthly')}`;
    } else {
      cycleText = t('resetsMonthly');
    }
  } else if (item.period === 'quarterly') {
    const curQuarter = Math.ceil(curMonth / 3);
    const isQuarterEndMonth = (curMonth % 3 === 0);
    const lastDayOfQMonth = new Date(curYear, curMonth, 0).getDate();
    if (isCurrentViewingMonth && isQuarterEndMonth) {
      daysRemaining = Math.max(0, lastDayOfQMonth - curDay);
      if (daysRemaining <= 14) isExpiringImminent = true;
      const daysText = daysRemaining === 0 ? (currentLang === 'zh-TW' ? '今日到期' : 'Due today') : t('daysRemaining').replace('{n}', daysRemaining);
      cycleText = `${daysText} · ${t('resetsQuarterly')}`;
    } else {
      cycleText = `Q${curQuarter} · ${t('resetsQuarterly')}`;
    }
  } else if (item.period === 'semiannual') {
    const curHalf = curMonth <= 6 ? 1 : 2;
    const isHalfEndMonth = (curMonth % 6 === 0);
    const lastDayOfHMonth = new Date(curYear, curMonth, 0).getDate();
    if (isCurrentViewingMonth && isHalfEndMonth) {
      daysRemaining = Math.max(0, lastDayOfHMonth - curDay);
      if (daysRemaining <= 20) isExpiringImminent = true;
      const daysText = daysRemaining === 0 ? (currentLang === 'zh-TW' ? '今日到期' : 'Due today') : t('daysRemaining').replace('{n}', daysRemaining);
      cycleText = `${daysText} · ${t('resetsSemiannual')}`;
    } else {
      cycleText = `${curHalf === 1 ? 'H1' : 'H2'} · ${t('resetsSemiannual')}`;
    }
  } else if (item.period === 'annual') {
    if (isAnniversary) {
      if (openedMonth) {
        if (isCurrentViewingMonth && curMonth === openedMonth) {
          const lastDayOfAnniv = new Date(curYear, openedMonth, 0).getDate();
          daysRemaining = Math.max(0, lastDayOfAnniv - curDay);
          if (daysRemaining <= 30) isExpiringImminent = true;
          const daysText = daysRemaining === 0 ? (currentLang === 'zh-TW' ? '今日到期' : 'Due today') : t('daysRemaining').replace('{n}', daysRemaining);
          cycleText = `${daysText} · ${t('resetsAnniversary')}`;
        } else {
          cycleText = `${t('cadenceAnniversary')} · ${openedMonth} ${t('monthUnit')}`;
        }
      } else {
        cycleText = `${t('cadenceAnniversary')} (${t('btnSetDates')})`;
      }
    } else {
      // Calendar year
      if (isCurrentViewingMonth && curMonth === 12) {
        const lastDayOfYear = 31;
        daysRemaining = Math.max(0, lastDayOfYear - curDay);
        if (daysRemaining <= 30) isExpiringImminent = true;
        const daysText = daysRemaining === 0 ? (currentLang === 'zh-TW' ? '今日到期' : 'Due today') : t('daysRemaining').replace('{n}', daysRemaining);
        cycleText = `${daysText} · ${t('resetsAnnual')}`;
      } else {
        cycleText = t('cadenceAnnual');
      }
    }
  }

  return { daysRemaining, cycleText, isExpiringImminent, isAnniversary };
}


export function getCardClaimedValueThisYear(cardId, curYear) {
  const credits = PRESET_CREDITS.filter(cr => cr.cardId === cardId && !isCreditMuted(cr.id));
  let claimed = 0;
  credits.forEach(c => {
    if (c.period === 'monthly') {
      for (let m = 1; m <= 12; m++) {
        const mStr = `${curYear}-${String(m).padStart(2, '0')}`;
        if (appState.creditsClaimed[`${c.id}_${mStr}`]) claimed += c.amount;
      }
    } else if (c.period === 'quarterly') {
      for (let q = 1; q <= 4; q++) {
        if (appState.creditsClaimed[`${c.id}_${curYear}_Q${q}`]) claimed += c.amount;
      }
    } else if (c.period === 'semiannual') {
      ['H1', 'H2'].forEach(h => {
        if (appState.creditsClaimed[`${c.id}_${curYear}_${h}`]) claimed += c.amount;
      });
    } else {
      if (appState.creditsClaimed[`${c.id}_${curYear}`]) claimed += c.amount;
    }
  });
  return claimed;
}


export function getDecisionBadgeInfo(status) {
  switch (status) {
    case 'keep':
      return {
        text: t('decisionStatusKeep'),
        icon: '✓',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50'
      };
    case 'considering':
      return {
        text: t('decisionStatusConsidering'),
        icon: '🤔',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50'
      };
    case 'retention':
      return {
        text: t('decisionStatusRetention'),
        icon: '🎁',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50'
      };
    case 'downgrade':
      return {
        text: t('decisionStatusDowngrade'),
        icon: '📉',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50'
      };
    case 'cancel':
      return {
        text: t('decisionStatusCancel'),
        icon: '✂️',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50'
      };
    default:
      return null;
  }
}


export function findLinkedCredit(cardId, perk) {
  if (perk.creditId) {
    return PRESET_CREDITS.find(c => c.id === perk.creditId) || null;
  }
  const titleStr = (typeof perk.title === 'object' ? (perk.title['zh-TW'] + ' ' + perk.title.en) : String(perk.title)).toLowerCase();
  return PRESET_CREDITS.find(c => {
    if (c.cardId !== cardId) return false;
    const cTitle = (typeof c.title === 'object' ? (c.title['zh-TW'] + ' ' + c.title.en) : String(c.title)).toLowerCase();
    if (titleStr.includes('dining') && cTitle.includes('dining')) return true;
    if (titleStr.includes('餐廳') && cTitle.includes('餐廳')) return true;
    if (titleStr.includes('doordash') && cTitle.includes('doordash')) return true;
    if (titleStr.includes('walmart') && cTitle.includes('walmart')) return true;
    if (titleStr.includes('wireless') && cTitle.includes('wireless')) return true;
    if (titleStr.includes('話費') && cTitle.includes('話費')) return true;
    if (titleStr.includes('fhr') && cTitle.includes('fhr')) return true;
    if (titleStr.includes('dell') && cTitle.includes('dell')) return true;
    if (titleStr.includes('clear') && cTitle.includes('clear')) return true;
    if (titleStr.includes('indeed') && cTitle.includes('indeed')) return true;
    if (titleStr.includes('travelbank') && cTitle.includes('travelbank')) return true;
    if ((titleStr.includes('airline') || titleStr.includes('航空')) && (cTitle.includes('airline') || cTitle.includes('航空'))) return true;
    if ((titleStr.includes('travel') || titleStr.includes('旅遊')) && (cTitle.includes('travel') || cTitle.includes('旅遊'))) return true;
    return false;
  }) || null;
}


