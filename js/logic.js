// CardFlow Pure Calculations, Cycle Logic & SVG Arc Helpers

import { t, pickText } from './i18n.js';
import { PRESET_CARDS, PRESET_CREDITS } from './data.js';
import { appState, today, selectedYear, selectedMonth, isCreditMuted, isCreditSkipped, isCardOwned } from './state.js';

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

  const formatDaysText = (days) => (days === 0 ? t('dueToday') : t('daysRemaining').replace('{n}', days));

  if (item.period === 'monthly') {
    const lastDayOfMonth = new Date(curYear, curMonth, 0).getDate();
    if (isCurrentViewingMonth) {
      daysRemaining = Math.max(0, lastDayOfMonth - curDay);
      if (daysRemaining <= 7) isExpiringImminent = true;
      cycleText = `${formatDaysText(daysRemaining)} · ${t('resetsMonthly')}`;
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
      cycleText = `${formatDaysText(daysRemaining)} · ${t('resetsQuarterly')}`;
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
      cycleText = `${formatDaysText(daysRemaining)} · ${t('resetsSemiannual')}`;
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
          cycleText = `${formatDaysText(daysRemaining)} · ${t('resetsAnniversary')}`;
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
        cycleText = `${formatDaysText(daysRemaining)} · ${t('resetsAnnual')}`;
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

/** Build canonical localStorage key for a credit item in a given period/month. */
export function getCreditStateKey(item, curYear, curMonth) {
  if (item.period === 'monthly') {
    const mStr = `${curYear}-${String(curMonth).padStart(2, '0')}`;
    return `${item.id}_${mStr}`;
  }
  if (item.period === 'quarterly') {
    const curQuarter = Math.ceil(curMonth / 3);
    return `${item.id}_${curYear}_Q${curQuarter}`;
  }
  if (item.period === 'semiannual') {
    const curHalf = curMonth <= 6 ? 1 : 2;
    return `${item.id}_${curYear}_H${curHalf}`;
  }
  return `${item.id}_${curYear}`;
}

/** Aggregate monthly metrics, timeline/cadence period buckets, and sorted credits feed data. */
export function computeCreditDashboardData({ ownedCredits, curYear, curMonth, periodFilter, viewMode }) {
  const curQuarter = Math.ceil(curMonth / 3);
  const curHalf = curMonth <= 6 ? 1 : 2;

  let monthlyUnclaimed = 0;
  let monthlyClaimedCount = 0;
  let totalMonthlyItems = 0;

  const creditMetaList = ownedCredits.map(item => ({
    item,
    urgency: getCreditUrgencyInfo(item, curYear, curMonth)
  }));

  ownedCredits.forEach(c => {
    const meta = appState.cardMeta?.[c.cardId];
    const openedMonth = meta?.openedMonth ? Number(meta.openedMonth) : null;
    const isDueNow =
      c.period === 'monthly' ||
      (c.period === 'quarterly' && curMonth % 3 === 0) ||
      (c.period === 'semiannual' && curMonth % 6 === 0) ||
      (c.period === 'annual' && (curMonth === 12 || (openedMonth && openedMonth === curMonth)));

    if (!isDueNow) return;
    const key = getCreditStateKey(c, curYear, curMonth);
    totalMonthlyItems++;
    if (appState.creditsClaimed[key]) {
      monthlyClaimedCount++;
    } else if (!isCreditSkipped(key)) {
      monthlyUnclaimed += c.amount;
    }
  });

  const utilization = computeAnnualUtilization(ownedCredits, curYear, curMonth);

  const monthItems = creditMetaList.filter(({ urgency }) => urgency.isDueThisMonth);
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

  const isCadenceMode = viewMode === 'cadence';
  const bucketMap = isCadenceMode
    ? { monthly: monthCadenceItems, quarterly: quarterCadenceItems, semiannual: halfCadenceItems, annual: yearCadenceItems, all: yearCadenceItems }
    : { monthly: monthItems, quarterly: quarterItems, semiannual: halfItems, annual: yearItems, all: yearItems };
  const displayMetaList = bucketMap[periodFilter] || (isCadenceMode ? monthCadenceItems : monthItems);

  const preparedItems = displayMetaList.map(({ item, urgency }) => {
    const stateKey = getCreditStateKey(item, curYear, curMonth);
    return {
      item,
      urgency,
      stateKey,
      isClaimed: !!appState.creditsClaimed[stateKey],
      isSkipped: isCreditSkipped(stateKey)
    };
  });

  preparedItems.sort((a, b) => {
    const aActive = !a.isClaimed && !a.isSkipped;
    const bActive = !b.isClaimed && !b.isSkipped;
    if (aActive !== bActive) return aActive ? -1 : 1;
    if (a.isClaimed !== b.isClaimed) return a.isClaimed ? 1 : -1;
    if (a.urgency.urgencyOrder !== b.urgency.urgencyOrder) {
      return a.urgency.urgencyOrder - b.urgency.urgencyOrder;
    }
    return b.item.amount - a.item.amount;
  });

  return {
    monthlyUnclaimed,
    monthlyClaimedCount,
    totalMonthlyItems,
    utilization,
    counts: {
      month: isCadenceMode ? monthCadenceItems.length : monthItems.length,
      quarter: isCadenceMode ? quarterCadenceItems.length : quarterItems.length,
      half: isCadenceMode ? halfCadenceItems.length : halfItems.length,
      year: isCadenceMode ? yearCadenceItems.length : yearItems.length
    },
    preparedItems
  };
}

const AUTO_FNC_RULES = [
  {
    cardId: 'bonvoy-brilliant',
    keyPrefix: 'auto_fnc_brilliant',
    issuer: 'Marriott',
    points: '85,000 pts',
    name: {
      en: 'Marriott 85k Free Night Award (Annual Renewal)',
      'zh-TW': '萬豪 85,000 分年度免費住宿券 (自動推算)'
    }
  },
  {
    cardId: 'ihg-premier',
    keyPrefix: 'auto_fnc_ihg',
    issuer: 'IHG',
    points: '50,000 pts',
    name: {
      en: 'IHG 50k Free Night Award (Annual Renewal)',
      'zh-TW': 'IHG 50,000 分年度免費住宿券 (自動推算)'
    }
  }
];

/** Derive annual hotel Free Night Certificates for owned co-branded hotel cards. */
export function deriveAutoFncs(curYear = selectedYear, refToday = today) {
  const curMonth = refToday.getMonth() + 1;
  const result = [];

  AUTO_FNC_RULES.forEach(rule => {
    if (!isCardOwned(rule.cardId)) return;
    const meta = appState.cardMeta?.[rule.cardId] || {};
    const renewMonth = (meta.renewMonth && meta.renewMonth !== 'No AF')
      ? Number(meta.renewMonth)
      : (meta.openedMonth ? Number(meta.openedMonth) : 6);
    const annMonthStr = String(renewMonth).padStart(2, '0');
    const grantYear = (curYear === refToday.getFullYear() && curMonth < renewMonth) ? curYear - 1 : curYear;
    const expireDate = `${grantYear + 1}-${annMonthStr}-28`;
    const autoKey = `${rule.keyPrefix}_${grantYear}`;

    result.push({
      id: autoKey,
      isAuto: true,
      cardId: rule.cardId,
      name: rule.name,
      issuer: rule.issuer,
      points: rule.points,
      grantNote: {
        en: `Issued ~Month ${renewMonth} · Valid 1 yr`,
        'zh-TW': `約每年 ${renewMonth} 月出帳入帳 · 效期 1 年`
      },
      expireDate,
      used: !!appState.fncsClaimed?.[autoKey]
    });
  });

  return result;
}

/** Calculate Chase 5/24 slot count across owned personal cards opened within the past 24 months. */
export function computeChase524Status(refToday = today) {
  const ownedPersonalCards = PRESET_CARDS.filter(c => !c.isBusiness && isCardOwned(c.id)).map(c => c.id);
  const curYear = refToday.getFullYear();
  const curMonth = refToday.getMonth() + 1;

  let cardsWithDates = 0;
  let in24Count = 0;
  const recentCards = [];

  ownedPersonalCards.forEach(id => {
    const meta = appState.cardMeta?.[id];
    if (meta && meta.openedYear && meta.openedMonth) {
      cardsWithDates++;
      const monthsElapsed = (curYear - meta.openedYear) * 12 + (curMonth - meta.openedMonth);
      if (monthsElapsed >= 0 && monthsElapsed < 24) {
        in24Count++;
        const cardObj = PRESET_CARDS.find(c => c.id === id);
        recentCards.push({
          id,
          name: cardObj ? pickText(cardObj.nickname) : id,
          date: `${meta.openedYear}/${meta.openedMonth}`,
          monthsLeft: 24 - monthsElapsed
        });
      }
    }
  });

  return {
    ownedPersonalCount: ownedPersonalCards.length,
    cardsWithDates,
    in24Count,
    isSafe: in24Count < 5,
    recentCards
  };
}

/** Select optimal wallet recommendation for an advisor category/mode, prioritizing 0% FTF overseas. */
export function resolveAdvisorRecommendation(modeData, isOverseas) {
  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;
  const candidateCards = modeData.candidateCards || [];
  const ownedInCat = candidateCards.filter(id => isCardOwned(id));

  let topCardId = ownedInCat[0] || null;
  if (isOverseas && ownedInCat.length > 0) {
    const topNoFtf = ownedInCat.find(id => {
      const c = PRESET_CARDS.find(card => card.id === id);
      return c && c.noFtf;
    });
    if (topNoFtf) topCardId = topNoFtf;
  }

  return { ownedCount, candidateCards, ownedInCat, topCardId };
}

/** Filter card catalog by ownership status, issuer, and bilingual search query. */
export function filterCatalogCards({ ownershipFilter, issuerFilter, searchText }) {
  const q = (searchText || '').toLowerCase().trim();
  return PRESET_CARDS.filter(c => {
    const isOwned = isCardOwned(c.id);
    if (ownershipFilter === 'owned' && !isOwned) return false;
    if (ownershipFilter === 'unowned' && isOwned) return false;
    if (issuerFilter !== 'all' && c.issuer !== issuerFilter) return false;
    if (!q) return true;

    const nick = pickText(c.nickname).toLowerCase();
    if (c.name.toLowerCase().includes(q) || nick.includes(q)) return true;
    const matchCat = c.categories.some(cat => pickText(cat.name).toLowerCase().includes(q) || cat.mult.toLowerCase().includes(q));
    if (matchCat) return true;
    return c.perks.some(p => pickText(p.title).toLowerCase().includes(q));
  });
}


