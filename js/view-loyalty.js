// CardFlow Loyalty Subview: FNC Tracker, Loyalty Statuses & Transfer Cheat Sheet

import { t, pickText } from './i18n.js';
import {
  today, selectedYear, appState, saveState,
  escapeHtml, parseLocalYmd, isCardOwned
} from './state.js';
import { deriveAutoFncs } from './logic.js';

export function renderFncs() {
  const container = document.getElementById('fnc-cards-container');
  if (!container) return;
  container.innerHTML = '';

  const allFncs = [...deriveAutoFncs(selectedYear, today), ...(appState.fncs || [])];

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

    const nameText = escapeHtml(pickText(fnc.name));
    const grantText = fnc.grantNote ? escapeHtml(pickText(fnc.grantNote)) : null;
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
        <button data-action="toggle-fnc-status" data-fnc-id="${safeIdAttr}" class="px-2 py-1 rounded-lg border text-[10px] font-bold transition ${fnc.used ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500'}">
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
    const statusName = pickText(s.name);
    const statusDesc = pickText(s.desc);
    const badgeText = isUnlocked
      ? pickText(s.badge)
      : t('cardRequiredBadge');
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

const TRANSFER_PARTNER_GUIDES = [
  {
    boxClass: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40',
    titleClass: 'text-blue-700 dark:text-blue-300',
    pillClass: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    tipClass: 'text-indigo-600 dark:text-indigo-400',
    title: { 'zh-TW': 'Chase Ultimate Rewards (UR 點數)', en: 'Chase Ultimate Rewards (UR)' },
    cards: { 'zh-TW': 'CSP + CFU + CIC + CIU', en: 'CSP + CFU + CIC + CIU' },
    partnersLabel: { 'zh-TW': '推薦兌換夥伴:', en: 'Top Redemptions:' },
    partners: {
      'zh-TW': '聯合航空 United、加拿大航空 Aeroplan、法荷航 Flying Blue、凱悅 World of Hyatt（現行比率 4:3）。',
      en: 'United Airlines, Air Canada Aeroplan, Flying Blue, World of Hyatt (4:3 ratio).'
    },
    tipLabel: { 'zh-TW': '💡 歸戶技巧:', en: '💡 Combine Points:' },
    tip: {
      'zh-TW': '在轉點前，務必先將免年費卡（Ink Cash、CFU、CIU）累積的 UR 點數合併至升級後的 CSP 藍寶石卡，即可解鎖 1:1 航空哩程轉點特權！',
      en: 'Move all UR points from Ink Cash & CFU to CSP before initiating 1:1 partner transfers!'
    }
  },
  {
    boxClass: 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/60 dark:border-sky-900/40',
    titleClass: 'text-sky-700 dark:text-sky-300',
    pillClass: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
    tipClass: 'text-sky-600 dark:text-sky-400',
    title: { 'zh-TW': 'Amex Membership Rewards (MR 點數)', en: 'Amex Membership Rewards (MR)' },
    cards: { 'zh-TW': '商業大白 + 商業金卡 + BBP + ED', en: 'Biz Plat + Biz Gold + BBP + ED' },
    partnersLabel: { 'zh-TW': '推薦兌換夥伴:', en: 'Top Redemptions:' },
    partners: {
      'zh-TW': '全日空 ANA（美日往返商務艙神卡）、加拿大航空 Aeroplan、維珍航空 Virgin Atlantic、國泰亞洲萬里通。',
      en: 'All Nippon Airways (ANA) roundtrip business, Aeroplan, Virgin Atlantic, Delta.'
    },
    tipLabel: { 'zh-TW': '💡 35% 點數回饋開票:', en: '💡 35% Pay with Points:' },
    tip: {
      'zh-TW': '商業大白享有「Pay with Points」開機票退還 35% 點數特權（滿 5,000 點起觸發，1 點價值高達 1.54 美分）！免年費的 BBP 更是永久保留手頭 MR 點數的無敵防線。',
      en: 'Biz Plat unlocks 35% points back on Amex Travel flights (min 5k pts, 1pt = 1.54¢)! BBP preserves MR points with $0 annual fee.'
    }
  },
  {
    boxClass: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40',
    titleClass: 'text-emerald-700 dark:text-emerald-300',
    pillClass: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    tipClass: 'text-emerald-600 dark:text-emerald-400',
    title: { 'zh-TW': 'Capital One 哩程', en: 'Capital One Miles' },
    cards: { 'zh-TW': 'Venture X', en: 'Venture X' },
    partnersLabel: { 'zh-TW': '推薦兌換夥伴:', en: 'Top Redemptions:' },
    partners: {
      'zh-TW': '土耳其航空 Miles&Smiles（換夏威夷極佳）、哥倫比亞航空 Avianca LifeMiles（星空聯盟免手續費）、英國航空 Avios。',
      en: 'Turkish Airlines Miles&Smiles, Avianca LifeMiles, British Airways Avios, Singapore Airlines.'
    },
    tipLabel: { 'zh-TW': '💡 旅遊消費一鍵抵扣:', en: '💡 Purchase Eraser:' },
    tip: {
      'zh-TW': '過去 90 天內的任何機票、火車或飯店消費，均能以 1 哩 = 1 美分的比例直接折抵帳單，毫無使用限制！',
      en: 'Instantly redeem at 1.0 ¢/mile against any travel purchase made within the last 90 days.'
    }
  }
];

export function renderTransferCheatSheet() {
  const container = document.getElementById('transfer-cheat-list');
  if (!container) return;

  container.innerHTML = TRANSFER_PARTNER_GUIDES.map(g => `
    <div class="p-3.5 rounded-2xl border ${g.boxClass}">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs font-bold ${g.titleClass}">${pickText(g.title)}</span>
        <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold ${g.pillClass}">${pickText(g.cards)}</span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <strong>${pickText(g.partnersLabel)}</strong> ${pickText(g.partners)}<br>
        <span class="font-medium ${g.tipClass}">${pickText(g.tipLabel)}</span> ${pickText(g.tip)}
      </p>
    </div>
  `).join('');
}
