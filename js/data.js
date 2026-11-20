// CardFlow Preset Cards, Credits, Perk Groups & Advisor Rules

// --- 2.5 DUPLICATE PERK GROUPS (OVERLAP & PROTECTION OPTIMIZER) ---
export const DUPLICATE_PERK_GROUPS = {
  'global-entry': {
    id: 'global-entry',
    name: { en: 'Global Entry / TSA PreCheck Credit ($120)', 'zh-TW': 'Global Entry / TSA 快速安檢折抵 ($120)' },
    icon: '🛂',
    tip: {
      en: 'Each traveler only needs 1 membership every 4-5 years. Extra statement credits can pay for a spouse, child, or friend, and still trigger 100% reimbursement!',
      'zh-TW': '每人每 4~5 年僅需一份會籍。多出的額度可直接幫配偶、子女或親友刷卡付申請費，同樣能獲得帳單全額折抵！'
    }
  },
  'lounge-access': {
    id: 'lounge-access',
    name: { en: 'Airport Lounge Access & Priority Pass', 'zh-TW': '機場貴賓室與 Priority Pass' },
    icon: '🛋️',
    tip: {
      en: 'Multiple cards provide lounge access. Compare guest policies before trips: Venture X unlocks C1 Lounges; Amex Biz Plat unlocks Centurion Lounges.',
      'zh-TW': '多張卡享有機場貴賓室權益。出行前留意各家特長：Venture X 可進 C1 專屬貴賓室；Amex 商業大白可進 Centurion 貴賓室。'
    }
  },
  'primary-cdw': {
    id: 'primary-cdw',
    name: { en: 'Primary Auto Rental CDW Insurance', 'zh-TW': '租車 Primary CDW 一級車碰險' },
    icon: '🚗',
    tip: {
      en: 'Primary CDW covers vehicle damage without claiming against your personal auto insurance policy (preventing rate hikes). Always swipe a Primary CDW card when renting!',
      'zh-TW': 'Primary CDW（一級險）出險直接由信用卡賠付，完全不需報個人汽車保險、避免次年保費暴漲。租車時請務必刷 Primary CDW 卡！'
    }
  },
  'cell-protection': {
    id: 'cell-protection',
    name: { en: 'Cell Phone Protection Insurance', 'zh-TW': '手機損壞與失竊保險' },
    icon: '📱',
    tip: {
      en: 'Set mobile bill autopay to the card with the highest coverage or added perks (e.g., Amex Biz Plat offers $10/mo discount + $800 repair protection).',
      'zh-TW': '建議將每月手機電話費自動扣繳設在最優卡（如 Amex 商業大白兼享每月 $10 折抵與高達 $800 手機維修保障）。'
    }
  }
};


// --- 3. 12 CARDS PRESET DATA (2026/2027 LATEST & PERSONAL TRACKER) ---
export const PRESET_CARDS = [
  {
    id: 'bonvoy-brilliant',
    isBusiness: false,
    name: 'Marriott Bonvoy Brilliant™ American Express®',
    issuer: 'Amex',
    nickname: { en: 'Marriott Brilliant', 'zh-TW': '萬豪 Brilliant 大白金' },
    annualFee: 650,
    noFtf: true,
    ftfRate: '0%',
    metal: true,
    signupBonus: { en: 'Historical 150k Marriott Points', 'zh-TW': '開卡禮 150,000 萬豪點數' },
    useFor: {
      en: 'Marriott stays (up to 21x with Platinum), monthly $25 dining credit, annual 85k FNC, $100 Ritz-Carlton & St. Regis property credit.',
      'zh-TW': '萬豪旗下飯店住宿（疊加白金最高享 21x）、每月 $25 全球餐廳折抵、年度 85k 免費住宿券、麗思卡爾頓與瑞吉酒店 $100 奢華折抵。'
    },
    categories: [
      { name: { en: 'Marriott Hotels', 'zh-TW': '萬豪旗下飯店住宿' }, mult: '6x Points' },
      { name: { en: 'Worldwide Dining', 'zh-TW': '全球餐廳用餐與外送' }, mult: '3x Points' },
      { name: { en: 'Flights Booked Direct', 'zh-TW': '航空公司官網機票' }, mult: '3x Points' },
      { name: { en: 'Other Purchases', 'zh-TW': '其他所有一般消費' }, mult: '2x Points' }
    ],
    perks: [
      { creditId: 'bb-dining', title: { en: 'Monthly $25 Dining Credit', 'zh-TW': '每月 $25 全球餐廳帳單折抵' }, note: { en: 'Up to $300/yr worldwide restaurants statement credit', 'zh-TW': '每年最高折抵 $300 美元，全球餐廳皆適用' } },
      { fncLink: true, title: { en: 'Annual 85k Free Night Award', 'zh-TW': '年度 85,000 分免費住宿券 (FNC)' }, note: { en: 'Can be topped off with up to 15,000 points', 'zh-TW': '可再自補最高 15,000 點，兌換高達 10 萬點奢華飯店' } },
      { title: { en: 'Marriott Platinum Elite Status', 'zh-TW': '自動享有萬豪白金會籍 (Platinum)' }, note: { en: 'Complimentary breakfast, lounge access & 4pm checkout', 'zh-TW': '保證雙人免費早餐、行政酒廊禮遇、下午 4 點延遲退房' } },
      { title: { en: '25 Elite Night Credits', 'zh-TW': '每年贈送 25 晚尊貴會籍房晚 (ENC)' }, note: { en: 'Direct boost towards Titanium/Ambassador', 'zh-TW': '極大幅降低衝擊鈦金／大使會籍的門檻' } },
      { title: { en: '$100 Luxury Property Credit', 'zh-TW': '$100 麗思卡爾頓與瑞吉消費額度' }, note: { en: '$100 property credit on 2+ consecutive nights at Ritz-Carlton or St. Regis', 'zh-TW': '連續入住 2 晚以上 The Ritz-Carlton 或 St. Regis 享 $100 館內消費折抵' } },
      { group: 'lounge-access', title: { en: 'Priority Pass Select Lounge Access', 'zh-TW': 'Priority Pass 機場貴賓室會籍' }, note: { en: 'Unlimited access to 1,300+ lounges worldwide', 'zh-TW': '全球超過 1,300 間機場貴賓室不限次數免費使用' } },
      { group: 'global-entry', title: { en: '$120 Global Entry / TSA PreCheck Credit', 'zh-TW': '$120 Global Entry / TSA 申請費折抵' }, note: { en: 'Reimbursed every 4 years', 'zh-TW': '每 4 年提供 $120 美元快速通關申請費全額折抵' } }
    ]
  },
  {
    id: 'amex-biz-gold',
    isBusiness: true,
    name: 'American Express® Business Gold',
    issuer: 'Amex',
    nickname: { en: 'Amex Business Gold', 'zh-TW': 'Amex 商業金卡' },
    annualFee: 375,
    noFtf: true,
    ftfRate: '0%',
    metal: true,
    signupBonus: { en: 'Spend $15k in 3 mos → 170k MR', 'zh-TW': '3 個月刷滿 $15,000 拿 170,000 MR' },
    useFor: {
      en: 'Monthly $20 Grubhub/FedEx/Office Depot credit, monthly Walmart+ ($12.95), top 2 monthly business categories 4x MR (flights, ads, gas, restaurants).',
      'zh-TW': '每月 $20 Grubhub/FedEx/Office Depot 彈性折抵、每月 Walmart+ 會費、帳單前 2 大消費類別享 4x MR（如機票、廣告、加油、餐廳等）。'
    },
    categories: [
      { name: { en: 'Top 2 Spend Categories (up to $150k)', 'zh-TW': '每月花費前 2 高類別 (每年上限 15 萬美元)' }, mult: '4x MR' },
      { name: { en: 'Other Business Purchases', 'zh-TW': '其他商業採購消費' }, mult: '1x MR' }
    ],
    perks: [
      { creditId: 'bg-flexible', title: { en: 'Monthly $20 Flexible Business Credit', 'zh-TW': '每月 $20 彈性商業消費折抵' }, note: { en: 'Grubhub delivery, FedEx shipping, or Office Depot ($240/yr)', 'zh-TW': '適用於 Grubhub 外送、FedEx 寄件或 Office Depot 辦公用品' } },
      { creditId: 'bg-walmart', title: { en: 'Monthly Walmart+ Membership Credit', 'zh-TW': '每月 Walmart+ 會費折抵 ($12.95)' }, note: { en: '$12.95/month plus tax reimbursement with Paramount+', 'zh-TW': '免運費外送並贈送 Paramount+ 影音串流會員' } }
    ]
  },
  {
    id: 'amex-biz-plat',
    isBusiness: true,
    name: 'The Business Platinum Card® from American Express',
    issuer: 'Amex',
    nickname: { en: 'Amex Business Platinum (2026 Refreshed)', 'zh-TW': 'Amex 商業大白 (2026 最新改版)' },
    annualFee: 895, // Refreshed from $695 to $895 with $600 hotel credit
    noFtf: true,
    ftfRate: '0%',
    metal: true,
    signupBonus: { en: 'Large spend bonus (150k-250k MR)', 'zh-TW': '商業大額開卡禮 (150k-250k MR)' },
    useFor: {
      en: 'Flight bookings (AmexTravel 5x + 35% Pay with Points rebate), $600 FHR hotel credit ($300 H1/H2), $200 airline fee, $150 Dell, $120 wireless, Centurion/Delta SkyClub lounges.',
      'zh-TW': '機票預訂（AmexTravel 5x + 35% 點數回贈開票）、$600 FHR 頂級飯店折抵（每半年 $300）、$200 航空、Dell $150、電信 $120、Centurion/Delta 機場貴賓室。'
    },
    categories: [
      { name: { en: 'AmexTravel Flights & Prepaid Hotels', 'zh-TW': 'AmexTravel 預訂機票與預付飯店' }, mult: '5x MR' },
      { name: { en: 'Eligible Purchases over $5,000', 'zh-TW': '單筆大於 $5,000 美元之大額採購' }, mult: '1.5x MR' },
      { name: { en: 'Other Purchases', 'zh-TW': '其他一般消費' }, mult: '1x MR' }
    ],
    perks: [
      { creditId: 'bp-fhr', title: { en: 'NEW: $600 Prepaid Hotel Credit (FHR/THC)', 'zh-TW': '新增: $600 頂級預付飯店折抵 (FHR/THC)' }, note: { en: '$300 semi-annually (Jan-Jun & Jul-Dec) via Amex Travel', 'zh-TW': '每半年 $300 (1-6月與 7-12月)，可訂五星級飯店享受免費雙人早餐與升等' } },
      { creditId: 'bp-airline', title: { en: '$200 Annual Airline Incidental Credit', 'zh-TW': '年度指定航空公司附加費折抵 ($200)' }, note: { en: 'Checked bags, seat selection, lounge day passes', 'zh-TW': '指定 1 家美籍航空，折抵行李、選位或貴賓室單日券' } },
      { creditId: 'bp-dell', title: { en: '$150 Annual Dell Credit (Calendar Year)', 'zh-TW': 'Dell 科技硬體採購折抵 ($150/年)' }, note: { en: 'Standard $150 credit, plus $1,000 bonus if spending $5,000+', 'zh-TW': '改版為日曆年標準 $150 折抵，滿 5,000 美元再獲 $1,000 加碼' } },
      { creditId: 'bp-wireless', title: { en: '$120 Annual Wireless Credit ($10/mo)', 'zh-TW': '每月 $10 電信通訊話費折抵' }, note: { en: 'Direct mobile phone statement credits ($120/yr)', 'zh-TW': '繳納美國主要電信話費，全年累計折抵 $120' } },
      { creditId: 'bp-indeed', title: { en: 'Indeed Hiring Credit ($90/quarter)', 'zh-TW': 'Indeed 徵才廣告刊登折抵 ($90/季)' }, note: { en: '$90 per calendar quarter for recruitment advertising', 'zh-TW': '每季提供 $90 美元刊登招聘廣告折抵' } },
      { creditId: 'bp-clear', title: { en: '$189 CLEAR Plus Credit', 'zh-TW': 'CLEAR® Plus 機場快速安檢身分驗證' }, note: { en: 'Fast-track airport security lines', 'zh-TW': '全額補助年費，免排隊光速通過美國主要機場安檢查驗' } },
      { title: { en: '35% Pay with Points Flight Rebate', 'zh-TW': '點數開機票 35% 返還特權' }, note: { en: 'Selected airline or first/business class (min 5k pts)', 'zh-TW': '經由 AmexTravel 購票享 35% 點數回贈 (1pt 價值高達 1.54 美分)' } },
      { title: { en: 'Hilton Gold, Marriott Gold & Leaders Club', 'zh-TW': '自動享有希爾頓金卡、萬豪金卡與 Leaders Club' }, note: { en: 'Complimentary breakfast/F&B credits, room upgrades', 'zh-TW': '享有免費早餐／餐飲折抵金與獨立奢華飯店升等特權' } },
      { group: 'lounge-access', best: true, title: { en: 'American Express Global Lounge Collection', 'zh-TW': 'Amex 全球貴賓室網絡 (Centurion + PP)' }, note: { en: 'Centurion Lounges, Priority Pass Select, Delta SkyClub', 'zh-TW': '包含頂級 Centurion 貴賓室、Priority Pass 與搭乘達美時免費進 SkyClub' } },
      { group: 'global-entry', title: { en: '$120 Global Entry / TSA PreCheck Credit', 'zh-TW': '$120 Global Entry / TSA 申請費折抵' }, note: { en: 'Every 4 years statement credit ($120)', 'zh-TW': '每 4 年提供高達 $120 帳單折抵，全額補助申請費' } },
      { group: 'cell-protection', best: true, title: { en: '$800 Cell Phone Protection ($50 Deductible)', 'zh-TW': '$800 手機損壞保險 (自負額 $50)' }, note: { en: 'Up to $800 per claim when paying wireless bill with card', 'zh-TW': '用此卡繳納話費享最高 $800 維修賠付，疊加每月 $10 折抵最推薦！' } }
    ]
  },
  {
    id: 'venture-x',
    isBusiness: false,
    name: 'Capital One Venture X',
    issuer: 'CapitalOne',
    nickname: { en: 'C1 Venture X', 'zh-TW': 'C1 Venture X 旗艦卡' },
    annualFee: 395,
    noFtf: true,
    ftfRate: '0%',
    metal: true,
    signupBonus: { en: 'Spend $4k in 3 mos → 75k Miles', 'zh-TW': '3 個月刷滿 $4,000 拿 75,000 哩程' },
    useFor: {
      en: 'Annual $300 C1 Travel credit, 10,000 anniversary bonus miles ($100), Capital One Lounge & Priority Pass, everyday 2x catch-all everywhere (Visa, 0% FTF).',
      'zh-TW': '每年 $300 C1 Travel 旅遊折抵、續卡贈 10,000 哩（$100 旅遊價值）、C1 Lounge 與 Priority Pass 機場貴賓室、海外與日常無腦 2x 萬用刷卡（Visa 免海外手續費）。'
    },
    categories: [
      { name: { en: 'C1 Travel Hotels & Rental Cars', 'zh-TW': 'C1 Travel 預訂飯店與租車' }, mult: '10x Miles' },
      { name: { en: 'C1 Travel Flights', 'zh-TW': 'C1 Travel 預訂機票' }, mult: '5x Miles' },
      { name: { en: 'All Other Purchases (Everywhere)', 'zh-TW': '任何其他所有消費 (萬用無腦刷)' }, mult: '2x Miles' }
    ],
    perks: [
      { creditId: 'vx-travel', title: { en: '$300 Annual C1 Travel Credit', 'zh-TW': '每年 $300 Capital One Travel 旅遊折抵' }, note: { en: 'Seamless discount on flights, hotels & cars', 'zh-TW': '直接折抵機票、飯店或租車費用，輕鬆抵銷大部分年費' } },
      { creditId: 'vx-anniversary', title: { en: '10,000 Anniversary Miles ($100+)', 'zh-TW': '每年續卡贈送 10,000 哩程' }, note: { en: 'Awarded every year starting at renewal', 'zh-TW': '價值至少 $100 美元，開卡第二年起每年自動入帳' } },
      { group: 'lounge-access', title: { en: 'Cardholder Lounge Access (2026 Policy)', 'zh-TW': '主卡人貴賓室權益 (2026 最新規定)' }, note: { en: 'C1 Lounges & Priority Pass for primary; guest access now $45/visit unless spend $75k+', 'zh-TW': '主卡人仍享無限次免費進入；2026年起攜伴調整為每位 $45 (年刷滿 7.5 萬免收)' } },
      { title: { en: 'Hertz President’s Circle Status', 'zh-TW': 'Hertz President’s Circle 頂級租車會籍' }, note: { en: 'Vehicle upgrades & guaranteed choices', 'zh-TW': '可直接至專屬車位自選升等豪華車款' } },
      { group: 'global-entry', title: { en: '$120 Global Entry / TSA PreCheck Credit', 'zh-TW': '$120 Global Entry / TSA 申請費折抵' }, note: { en: 'Reimbursed up to $120 every 4 years', 'zh-TW': '每 4 年提供最高 $120 申請費折抵，全額抵免' } },
      { group: 'primary-cdw', best: true, title: { en: 'Primary Car Rental Collision Damage Waiver', 'zh-TW': '租車 Primary CDW 車碰一級險' }, note: { en: 'Top-tier coverage without filing against personal auto insurance', 'zh-TW': '全美與全球租車最省心，出險直接由 Visa Infinite 賠付' } },
      { group: 'cell-protection', title: { en: '$800 Cell Phone Protection', 'zh-TW': '$800 手機損壞與失竊保險' }, note: { en: 'Up to $800 per claim, $50 deductible when paying bill', 'zh-TW': '繳納電信話費即可享每年最高兩次、每次 $800 理賠' } }
    ]
  },
  {
    id: 'csp',
    isBusiness: false,
    name: 'Chase Sapphire Preferred (CSP)',
    issuer: 'Chase',
    nickname: { en: 'CSP Sapphire (2026 Upgraded)', 'zh-TW': 'Chase CSP 藍寶石卡 (2026 升級版)' },
    annualFee: 95,
    noFtf: true,
    ftfRate: '0%',
    metal: true,
    signupBonus: { en: 'Spend $5k in 3 mos → 100k UR', 'zh-TW': '3 個月刷滿 $5,000 拿 100,000 UR 點數 (史高)' },
    useFor: {
      en: 'Monthly $10 DoorDash non-restaurant credit ($120/yr through 2029), annual $100 hotel credit, primary car rental CDW, 3x dining & overseas, 3x gas/EV charging, UR transfer hub (Hyatt, United).',
      'zh-TW': '每月 $10 DoorDash 非餐廳外送折抵（超商/生鮮，至2029年底）、每年 $100 Chase 飯店折抵、租車 Primary CDW 車碰險、海外與用餐 3x、加油與電車 3x、UR 轉點樞紐（凱悅、美聯航）。'
    },
    categories: [
      { name: { en: 'Dining & Food Delivery', 'zh-TW': '全球餐廳用餐與外送' }, mult: '3x UR' },
      { name: { en: 'NEW: Gas & EV Charging', 'zh-TW': '新增: 加油站與電車充電' }, mult: '3x UR' },
      { name: { en: 'NEW: Vacation Rentals (Airbnb/Vrbo)', 'zh-TW': '新增: 民宿與度假屋 (Airbnb/Vrbo)' }, mult: '3x UR' },
      { name: { en: 'Online Grocery & Select Streaming', 'zh-TW': '線上超市買菜與指定影音串流' }, mult: '3x UR' },
      { name: { en: 'Travel Purchases', 'zh-TW': '一般旅遊與交通消費' }, mult: '2x UR' },
      { name: { en: 'Chase Travel Portal', 'zh-TW': 'Chase 旅遊入口預訂' }, mult: '5x UR' }
    ],
    perks: [
      { creditId: 'csp-doordash', title: { en: 'Monthly $10 DoorDash Non-Restaurant Credit', 'zh-TW': '每月 $10 DoorDash 生鮮便利超商折抵' }, note: { en: '$10/mo grocery/convenience promo code through Dec 31, 2029 ($120/yr value)', 'zh-TW': '每月提供 $10 折抵券用於便利商店、生鮮雜貨，效期至 2029/12/31（每年省 $120）' } },
      { creditId: 'csp-hotel', title: { en: 'UPGRADED: $100 Annual Hotel Credit', 'zh-TW': '翻倍升級: $100 Chase Travel 飯店折抵' }, note: { en: 'Doubled from $50 to $100 per cardmember year', 'zh-TW': '飯店折抵由原先 $50 翻倍至 $100，直接抵銷整張卡片年費' } },
      { group: 'global-entry', title: { en: 'NEW: $120 Global Entry / TSA PreCheck Credit', 'zh-TW': '新增: $120 機場快速通關申請費折抵' }, note: { en: 'Up to $120 credit every 4 years for Global Entry/NEXUS', 'zh-TW': '每 4 年提供高達 $120 美元，全額補助 Global Entry 或 TSA 費用' } },
      { title: { en: 'Transfer Partner Hub', 'zh-TW': '解鎖航空與飯店轉點樞紐' }, note: { en: 'Transfer to United, Aeroplan, Flying Blue, and Hyatt (4:3)', 'zh-TW': '可將 Ink Cash、CFU 的點數集中轉點，發揮最大商務艙價值' } },
      { group: 'primary-cdw', best: true, title: { en: 'Primary Car Rental CDW', 'zh-TW': '租車頂級 Primary 車碰險' }, note: { en: 'Top-tier comprehensive collision damage waiver', 'zh-TW': '出險免先動用個人汽車保險，在美租車最省心首選' } }
    ]
  },
  {
    id: 'ihg-premier',
    isBusiness: false,
    name: 'Chase IHG Rewards Premier',
    issuer: 'Chase',
    nickname: { en: 'Chase IHG Premier (2026/2027 Overhaul)', 'zh-TW': 'Chase IHG 洲際聯名卡 (2026/2027 改版)' },
    annualFee: 150, // Transitioning from $99 to $150
    noFtf: true,
    ftfRate: '0%',
    metal: true,
    signupBonus: { en: 'Spend $3k in 3 mos → 175k Points', 'zh-TW': '3 個月刷滿 $3,000 拿 175,000 IHG 點數' },
    useFor: {
      en: 'IHG stays (up to 26x), annual 50k Free Night Award + points top-off, quarterly $25 dining credit ($100/yr), $50 United TravelBank, 4th night free on award stays.',
      'zh-TW': 'IHG 旗下飯店住宿（綜合高達 26x）、每年 50k 免費住宿券（可自補點數）、每季 $25 飯店餐飲折抵（全年 $100）、每年 $50 美聯航 TravelBank、點數換房住四免一。'
    },
    categories: [
      { name: { en: 'IHG Hotels & Resorts', 'zh-TW': 'IHG 旗下飯店消費' }, mult: '綜合高達 26x' },
      { name: { en: 'Travel, Gas Stations & Dining', 'zh-TW': '旅行、加油站與餐廳' }, mult: '5x Points' },
      { name: { en: 'All Other Purchases', 'zh-TW': '其他一般消費' }, mult: '3x Points' }
    ],
    perks: [
      { fncLink: true, title: { en: 'UPGRADED: 50,000 pt Free Night Award', 'zh-TW': '升級: 50,000 分免費住宿券 (原 40k)' }, note: { en: 'Anniversary FNC increased to 50k points + points top-off', 'zh-TW': '房券點數上限由 40k 提升至 50k 點，可兌換更高階洲際酒店' } },
      { creditId: 'ihg-fb', title: { en: 'NEW: $100 Annual Food & Beverage Credit', 'zh-TW': '新增: $100 飯店餐飲折抵 ($25/季)' }, note: { en: '$25 per calendar quarter for dining at IHG properties', 'zh-TW': '每季 $25 美元餐飲消費折抵，入住或在旗下餐廳用餐直接扣抵' } },
      { creditId: 'ihg-air', title: { en: 'NEW: $100 Annual Airline Statement Credit', 'zh-TW': '新增: $100 航空公司購票折抵' }, note: { en: '$100 back on $250+ qualifying direct airline bookings', 'zh-TW': '購買單筆 $250 以上機票，享 $100 帳單直接折抵' } },
      { title: { en: '4th Night Free on Award Stays', 'zh-TW': '點數換房住四晚免一晚 (住四免一)' }, note: { en: 'Redeem 3 nights, 4th night costs 0 points', 'zh-TW': '兌換連續 4 晚僅需支付 3 晚點數，長期度假極划算' } },
      { creditId: 'ihg-tb', title: { en: '$50 United TravelBank Cash ($25 H1, $25 H2)', 'zh-TW': '每年 $50 聯合航空 TravelBank 購票金' }, note: { en: 'Direct discount on United flights', 'zh-TW': '每年 1 月與 7 月各入帳 $25，買美聯航機票現抵' } },
      { title: { en: 'Elite Status (Platinum through 2027)', 'zh-TW': '精英會籍 (持卡人享白金待遇至 2027 底)' }, note: { en: 'Existing holders grandfathered in Platinum through 2027', 'zh-TW': '現有持卡人至 2027 年底前維持白金權益（房型升等與加成）' } },
      { group: 'global-entry', title: { en: '$120 Global Entry / TSA PreCheck / NEXUS Credit', 'zh-TW': '$120 Global Entry / TSA / NEXUS 申請費折抵' }, note: { en: 'Reimbursed every 4 years', 'zh-TW': '每 4 年提供 $120 美元申請費折抵' } },
      { group: 'cell-protection', title: { en: '$800 Cell Phone Protection', 'zh-TW': '$800 手機損壞保險' }, note: { en: 'Up to $800 coverage with $50 deductible', 'zh-TW': '支付手機帳單享最高 $800 損壞賠付' } }
    ]
  },
  {
    id: 'cfu',
    isBusiness: false,
    name: 'Chase Freedom Unlimited (CFU)',
    issuer: 'Chase',
    nickname: { en: 'Chase CFU', 'zh-TW': 'Chase Freedom 自由卡' },
    annualFee: 0,
    noFtf: false,
    ftfRate: '3.0%',
    metal: false,
    renewMonth: { en: 'No AF', 'zh-TW': '免年費卡' },
    signupBonus: { en: 'Spend $500 → $200 (20k UR)', 'zh-TW': '刷滿 $500 贈 $200 (20k UR)' },
    useFor: {
      en: 'Personal non-category everyday spend 1.5x UR, drugstores 3x, dining 3x. (⚠️ Do NOT swipe abroad: 3.0% FTF). Combine points with CSP!',
      'zh-TW': '個人日常非類別 1.5x UR、連鎖藥妝店 3x、餐廳外送 3x。（⚠️ 海外禁刷：收取 3% 手續費）。點數合併轉入 CSP 解鎖高價值轉點！'
    },
    categories: [
      { name: { en: 'Dining & Drugstores', 'zh-TW': '餐廳外送與藥局消費' }, mult: '3x UR' },
      { name: { en: 'All Other Everyday Spend', 'zh-TW': '個人其他所有非類別日常' }, mult: '1.5x UR' }
    ],
    perks: [
      { title: { en: 'Personal Catch-all 1.5x UR', 'zh-TW': '免年費個人無腦 1.5x 點數' }, note: { en: 'Combine with CSP for high-value partner transfers', 'zh-TW': '搭配 CSP 即可將 1.5x 回饋轉化為高價值航空哩程或凱悅點數' } }
    ]
  },
  {
    id: 'cic',
    isBusiness: true,
    name: 'Chase Ink Business Cash (CIC)',
    issuer: 'Chase',
    nickname: { en: 'Chase Ink Cash', 'zh-TW': 'Chase Ink Cash 商業墨水現金' },
    annualFee: 0,
    noFtf: false,
    ftfRate: '3.0%',
    metal: false,
    signupBonus: { en: '0% APR 12m + Spend $6k in 3m → 90k UR ($900)', 'zh-TW': '0% APR 12個月 + 3個月刷 $6,000 拿 90,000 UR ($900)' },
    useFor: {
      en: 'Staples / Office Depot 5x UR, phone/internet 5x UR. Staples gift card trick for Amazon & groceries. (⚠️ Do NOT swipe abroad: 3.0% FTF).',
      'zh-TW': 'Staples / Office Depot 辦公用品 5x UR、手機電話與網路費 5x UR。文具店購買 Amazon、餐廳禮品卡同享 5x UR 神技。（⚠️ 海外禁刷：收取 3% 手續費）。'
    },
    categories: [
      { name: { en: 'Office Supply, Telecom & Internet', 'zh-TW': '辦公文具店、手機電話與網路費' }, mult: '5% / 5x UR (每年上限 $25k)' },
      { name: { en: 'Gas Stations & Restaurants', 'zh-TW': '加油站與餐廳消費' }, mult: '2% / 2x UR' }
    ],
    perks: [
      { title: { en: 'Office Supply 5x Gift Card Trick', 'zh-TW': '辦公文具店 5x 禮品卡神技' }, note: { en: 'Buy Amazon, grocery, or dining gift cards at Staples for 5x UR', 'zh-TW': '在 Staples 購買 Amazon、餐廳或生鮮禮物卡同享 5x UR 回饋！' } }
    ]
  },
  {
    id: 'bbp',
    isBusiness: true,
    name: 'Blue Business® Plus Credit Card (BBP)',
    issuer: 'Amex',
    nickname: { en: 'Amex BBP', 'zh-TW': 'Amex BBP 藍商業 Plus' },
    annualFee: 0,
    noFtf: false,
    ftfRate: '2.7%',
    metal: false,
    signupBonus: { en: '0% APR 12m + Spend $3k in 3m → 15k MR', 'zh-TW': '0% APR 12個月 + 3個月刷 $3,000 拿 15,000 MR' },
    useFor: {
      en: 'First $50k/yr non-category business spend 2x MR (primary US catch-all card), zero annual fee to keep MR points alive forever. (⚠️ Do NOT swipe abroad: 2.7% FTF).',
      'zh-TW': '全美最強無腦萬用卡：每年首 5 萬美元商業非類別消費享 2x MR 點數、免年費永久鎖定 MR 點數庫不失效。（⚠️ 海外禁刷：收取 2.7% 手續費）。'
    },
    categories: [
      { name: { en: 'All Business Purchases (up to $50k/yr)', 'zh-TW': '商業所有非類別消費 (每年首 5 萬美元)' }, mult: '2x MR 點數' },
      { name: { en: 'After $50k limit', 'zh-TW': '超過 5 萬美元之後' }, mult: '1x MR 點數' }
    ],
    perks: [
      { title: { en: 'Free MR Anchor Card', 'zh-TW': '零年費永久鎖定 MR 點數神卡' }, note: { en: 'Preserves all Membership Rewards points forever with $0 annual fee', 'zh-TW': '若停用年費卡，只要留著 BBP，數十萬 MR 點數永久不過期' } }
    ]
  },
  {
    id: 'amex-ed',
    isBusiness: false,
    name: 'Amex EveryDay® Credit Card',
    issuer: 'Amex',
    nickname: { en: 'Amex EveryDay (ED)', 'zh-TW': 'Amex EveryDay 個人卡' },
    annualFee: 0,
    noFtf: false,
    ftfRate: '2.7%',
    metal: false,
    renewMonth: { en: 'No AF', 'zh-TW': '免年費卡' },
    signupBonus: { en: 'Spend $1k in 3m → 10k MR', 'zh-TW': '刷滿 $1,000 贈 10,000 MR' },
    useFor: {
      en: 'US physical supermarkets 2x MR (boosted to 2.4x with 20+ swipes/month), personal $0 AF card keeping personal MR active. (⚠️ Do NOT swipe abroad: 2.7% FTF).',
      'zh-TW': '美國實體生鮮超市 2x MR（每月刷滿 20 筆加贈 20% 升至 2.4x MR）、個人版免年費維持 MR 點數永久有效。（⚠️ 海外禁刷：收取 2.7% 手續費）。'
    },
    categories: [
      { name: { en: 'US Supermarkets (up to $6k/yr)', 'zh-TW': '美國實體生鮮超市 (每年上限 $6,000)' }, mult: '2x MR' },
      { name: { en: '20+ Transactions in Billing Period', 'zh-TW': '每月刷滿 20 筆額外加贈 20%' }, mult: '升級為 2.4x / 1.2x' }
    ],
    perks: [
      { title: { en: 'Personal Zero-Fee MR Keeper', 'zh-TW': '個人版零年費保點卡' }, note: { en: 'Keeps personal MR accounts alive with no fee', 'zh-TW': '維持個人 MR 帳戶活絡，避免點數過期失效' } }
    ]
  },
  {
    id: 'bbc',
    isBusiness: true,
    name: 'Blue Business Cash™ Card (BBC)',
    issuer: 'Amex',
    nickname: { en: 'Amex BBC', 'zh-TW': 'Amex BBC 商業現金卡' },
    annualFee: 0,
    noFtf: false,
    ftfRate: '2.7%',
    metal: false,
    signupBonus: { en: '0% APR 12m + Spend $15k in 5m → $500 statement credit', 'zh-TW': '0% APR 12個月 + 5個月刷 $15,000 拿 $500 現金折抵' },
    useFor: {
      en: 'Hassle-free 2% automatic cash back statement credits on first $50k/yr business spend, 0% intro APR financing. (⚠️ Do NOT swipe abroad: 2.7% FTF).',
      'zh-TW': '免煩惱點數估值：每年首 5 萬美元商業採購自動直接折抵 2% 現金到次月帳單、0% 初始利率靈活週轉。（⚠️ 海外禁刷：收取 2.7% 手續費）。'
    },
    categories: [
      { name: { en: 'All Business Purchases (up to $50k/yr)', 'zh-TW': '所有商業採購 (每年上限 5 萬美元)' }, mult: '2% 自動帳單折抵' }
    ],
    perks: [
      { title: { en: 'Hassle-free 2% Cash Back', 'zh-TW': '無腦 2% 純現金回饋流' }, note: { en: 'Automatically credited directly to your statement', 'zh-TW': '不需煩惱哩程估值與兌換，回饋金自動直接折抵次月帳單' } }
    ]
  },
  {
    id: 'ciu',
    isBusiness: true,
    name: 'Chase Ink Business Unlimited (CIU)',
    issuer: 'Chase',
    nickname: { en: 'Chase Ink Unlimited', 'zh-TW': 'Chase Ink Unlimited 商業墨水' },
    annualFee: 0,
    noFtf: false,
    ftfRate: '3.0%',
    metal: false,
    signupBonus: { en: '0% APR 12m + Spend $6k in 3m → 75k UR ($750)', 'zh-TW': '0% APR 12個月 + 3個月刷 $6,000 拿 75,000 UR ($750)' },
    useFor: {
      en: 'Unlimited 1.5x UR on all business spend with no cap (fallback workhorse once BBP $50k cap is maxed). (⚠️ Do NOT swipe abroad: 3.0% FTF).',
      'zh-TW': '商業採購無上限 1.5x UR（當 BBP 5 萬美元 2x 額度刷滿後的最佳大額接力卡，0% APR 支援）。（⚠️ 海外禁刷：收取 3% 手續費）。'
    },
    categories: [
      { name: { en: 'All Business Purchases (Unlimited)', 'zh-TW': '所有商業採購消費 (無上限)' }, mult: '1.5% / 1.5x UR' }
    ],
    perks: [
      { title: { en: 'High-limit Business Catch-all', 'zh-TW': '商業大額消費主力' }, note: { en: 'Great fallback once 5x and 2x caps are maximized', 'zh-TW': '當 BBP 刷滿 5 萬美元限額時，轉用 CIU 繼續吃滿 1.5x UR' } }
    ]
  }
];

// --- 4. PRESET STATEMENT CREDITS (2026/2027 ENHANCED) ---
export const PRESET_CREDITS = [
  // Monthly
  {
    id: 'bb-dining',
    cardId: 'bonvoy-brilliant',
    period: 'monthly',
    card: { en: 'Marriott Brilliant', 'zh-TW': '萬豪 Brilliant' },
    title: { en: 'Monthly $25 Worldwide Dining Credit', 'zh-TW': '每月 $25 全球餐廳帳單折抵' },
    amount: 25.0,
    cat: 'dining',
    tip: { en: 'Dine anywhere, UberEats, or restaurant takeout', 'zh-TW': '全球實體餐廳、外送、UberEats 刷卡即可自動折抵' }
  },
  {
    id: 'bg-flexible',
    cardId: 'amex-biz-gold',
    period: 'monthly',
    card: { en: 'Amex Business Gold', 'zh-TW': 'Amex 商業金卡' },
    title: { en: 'Monthly $20 Flexible Business Spend', 'zh-TW': '每月 $20 彈性商業消費折抵' },
    amount: 20.0,
    cat: 'office',
    tip: { en: 'Grubhub delivery, FedEx shipping, or Office Depot', 'zh-TW': '適用於 Grubhub 外送、FedEx 寄件或 Office Depot 辦公文具' }
  },
  {
    id: 'bg-walmart',
    cardId: 'amex-biz-gold',
    period: 'monthly',
    card: { en: 'Amex Business Gold', 'zh-TW': 'Amex 商業金卡' },
    title: { en: 'Monthly Walmart+ Membership ($12.95)', 'zh-TW': '每月 Walmart+ 會費實報實銷 ($12.95)' },
    amount: 12.95,
    cat: 'subs',
    tip: { en: 'Free shipping & Paramount+ streaming', 'zh-TW': '享有免運費特權與 Paramount+ 影音串流會員' }
  },
  {
    id: 'bp-wireless',
    cardId: 'amex-biz-plat',
    period: 'monthly',
    card: { en: 'Amex Business Platinum', 'zh-TW': 'Amex 商業大白' },
    title: { en: 'Monthly $10 Wireless Telephone Credit', 'zh-TW': '每月 $10 電信通訊話費折抵' },
    amount: 10.0,
    cat: 'telecom',
    tip: { en: 'Pay AT&T, Verizon, T-Mobile or prepaid carrier', 'zh-TW': '繳納 AT&T、Verizon、T-Mobile 或預付卡帳單' }
  },
  {
    id: 'csp-doordash',
    cardId: 'csp',
    period: 'monthly',
    card: { en: 'Chase Sapphire Preferred', 'zh-TW': 'CSP 藍寶石卡' },
    title: { en: 'Monthly $10 DoorDash Non-Restaurant Promo', 'zh-TW': '每月 $10 DoorDash 生鮮超商折抵' },
    amount: 10.0,
    cat: 'subs',
    tip: { en: 'Valid on grocery, convenience & retail orders through Dec 31, 2029 ($120/yr)', 'zh-TW': '適用於便利商店、生鮮雜貨外送，每月自動提供代碼，活動至 2029/12/31（每年折抵 $120）' }
  },

  // Semi-Annual & Quarterly (Updated with 2026 Credits)
  {
    id: 'bp-fhr',
    cardId: 'amex-biz-plat',
    period: 'semiannual',
    card: { en: 'Amex Business Platinum', 'zh-TW': 'Amex 商業大白' },
    title: { en: 'NEW: FHR/THC Hotel Credit ($300 Semi-annual)', 'zh-TW': '新增: 頂級飯店預付折抵 ($300 每半年)' },
    amount: 300.0,
    cat: 'travel',
    tip: { en: 'H1 (Jan-Jun) $300 / H2 (Jul-Dec) $300 for Fine Hotels + Resorts ($600/yr total)', 'zh-TW': '上半年 $300 / 下半年 $300，透過 AmexTravel 預訂 FHR 或 THC 飯店享 $600/年' }
  },
  {
    id: 'ihg-fb',
    cardId: 'ihg-premier',
    period: 'quarterly',
    card: { en: 'Chase IHG Premier', 'zh-TW': 'IHG 洲際聯名卡' },
    title: { en: 'NEW: $25 Quarterly Food & Beverage Credit', 'zh-TW': '新增: 每季 $25 飯店餐飲消費折抵' },
    amount: 25.0,
    cat: 'dining',
    tip: { en: '$25 each quarter for dining at IHG properties ($100/yr)', 'zh-TW': '每季 $25 美元於 IHG 旗下飯店餐廳用餐直接折抵，全年共 $100' }
  },
  {
    id: 'ihg-tb',
    cardId: 'ihg-premier',
    period: 'semiannual',
    card: { en: 'Chase IHG Premier', 'zh-TW': 'IHG 洲際聯名卡' },
    title: { en: 'United TravelBank $25 Cash', 'zh-TW': '聯合航空 United TravelBank 儲值金 ($25)' },
    amount: 25.0,
    cat: 'airline',
    tip: { en: 'H1 deposited Jan, H2 deposited Jul. Use for flights.', 'zh-TW': '每年 1 月與 7 月各發放 $25，購票時可直接折抵機票款' }
  },
  {
    id: 'bp-indeed',
    cardId: 'amex-biz-plat',
    period: 'quarterly',
    card: { en: 'Amex Business Platinum', 'zh-TW': 'Amex 商業大白' },
    title: { en: 'Indeed Hiring Credit ($90/quarter)', 'zh-TW': 'Indeed 徵才廣告刊登折抵 ($90/季)' },
    amount: 90.0,
    cat: 'office',
    tip: { en: 'Quarterly statement credit for job postings', 'zh-TW': '每季度 $90 美元，全年最高可折抵 $360' }
  },

  // Annual (Updated with 2026 Overhauls)
  {
    id: 'csp-hotel',
    cardId: 'csp',
    period: 'annual',
    cycleType: 'anniversary',
    card: { en: 'Chase Sapphire Preferred', 'zh-TW': 'CSP 藍寶石卡' },
    title: { en: 'UPGRADED: Chase Travel $100 Hotel Credit', 'zh-TW': '升級: Chase Travel $100 年度飯店折抵' },
    amount: 100.0,
    cat: 'travel',
    tip: { en: 'Doubled from $50 to $100 per cardmember year', 'zh-TW': '由原 $50 翻倍升級至 $100，直接抵消整張卡片年費' }
  },
  {
    id: 'vx-travel',
    cardId: 'venture-x',
    period: 'annual',
    cycleType: 'anniversary',
    card: { en: 'Capital One Venture X', 'zh-TW': 'C1 Venture X' },
    title: { en: 'Capital One Travel $300 Credit', 'zh-TW': 'Capital One Travel 旅遊折抵額度 ($300)' },
    amount: 300.0,
    cat: 'travel',
    tip: { en: 'Direct booking for flights, hotels, or rental cars', 'zh-TW': '於 C1 Travel 入口網站預訂機票、飯店或租車立折 $300' }
  },
  {
    id: 'vx-anniversary',
    cardId: 'venture-x',
    period: 'annual',
    cycleType: 'anniversary',
    card: { en: 'Capital One Venture X', 'zh-TW': 'C1 Venture X' },
    title: { en: '10,000 Anniversary Miles ($100 Value)', 'zh-TW': '每年續卡贈送 10,000 哩 ($100 旅遊金)' },
    amount: 100.0,
    cat: 'travel',
    tip: { en: 'Deposited every year starting at renewal, redeem for $100 against travel', 'zh-TW': '續卡後自動入帳 10,000 哩，在 C1 Travel 或帳單抵扣等同 $100 美元價值' }
  },
  {
    id: 'bp-airline',
    cardId: 'amex-biz-plat',
    period: 'annual',
    card: { en: 'Amex Business Platinum', 'zh-TW': 'Amex 商業大白' },
    title: { en: 'Airline Incidental Fee Credit ($200)', 'zh-TW': '年度指定航空公司附加費用折抵 ($200)' },
    amount: 200.0,
    cat: 'airline',
    tip: { en: 'Choose 1 airline: baggage, seat choice, lounge passes', 'zh-TW': '指定 1 家美籍航空，折抵行李託運、選位費或貴賓室單日券' }
  },
  {
    id: 'bp-dell',
    cardId: 'amex-biz-plat',
    period: 'annual',
    card: { en: 'Amex Business Platinum', 'zh-TW': 'Amex 商業大白' },
    title: { en: 'UPDATED: Dell Technologies $150 Calendar Credit', 'zh-TW': '改版: Dell 科技硬體折抵 ($150/年)' },
    amount: 150.0,
    cat: 'tech',
    tip: { en: 'Standard $150 per calendar year, plus $1,000 bonus if spending $5k+', 'zh-TW': '2026改為日曆年標準 $150 折抵（滿 5,000 美元再獲 $1,000 加碼）' }
  },
  {
    id: 'ihg-air',
    cardId: 'ihg-premier',
    period: 'annual',
    card: { en: 'Chase IHG Premier', 'zh-TW': 'IHG 洲際聯名卡' },
    title: { en: 'NEW: $100 Direct Airline Booking Credit', 'zh-TW': '新增: $100 航空公司購票折抵' },
    amount: 100.0,
    cat: 'airline',
    tip: { en: 'Get $100 back on $250+ direct airline ticket purchases', 'zh-TW': '購買單筆 $250 以上機票，享 $100 帳單直接折抵' }
  },
  {
    id: 'bp-clear',
    cardId: 'amex-biz-plat',
    period: 'annual',
    card: { en: 'Amex Business Platinum', 'zh-TW': 'Amex 商業大白' },
    title: { en: 'CLEAR® Plus Airport Fast Track ($189)', 'zh-TW': 'CLEAR® Plus 機場快速安檢會員折抵 ($189)' },
    amount: 189.0,
    cat: 'travel',
    tip: { en: 'Expedite airport security identification', 'zh-TW': '全額補助年費，免排隊光速通過美國各主要機場身分查驗' }
  }
];


export const ADVISOR_RULES = {
  dining: {
    title: { en: '🍽️ Dining & Takeout Delivery', 'zh-TW': '🍽️ 全球餐廳 / 外送用餐' },
    winner: 'Amex Business Gold (4x MR) / CSP (3x UR + $10 DoorDash) / Brilliant (3x + $25/mo)',
    candidateCards: ['amex-biz-gold', 'csp', 'bonvoy-brilliant'],
    cards: {
      'amex-biz-gold': {
        mult: '4x MR',
        badge: { en: 'Top Multiplier', 'zh-TW': '最高倍率' },
        note: {
          en: 'Amex Business Gold: 4x MR when dining is one of your top 2 billing cycle spend categories (up to $150k/yr).',
          'zh-TW': 'Amex 商業金卡: 若餐廳為該期帳單前二大花費類別，享 4x MR 點數累積（每年上限 15 萬美元）。'
        }
      },
      'csp': {
        mult: '3x UR',
        badge: { en: 'Best for Delivery & DashPass', 'zh-TW': '外送與生鮮首選' },
        note: {
          en: 'Chase Sapphire Preferred: 3x UR on dining, complimentary DashPass & $10/mo DoorDash grocery credit.',
          'zh-TW': 'Chase Sapphire Preferred: 餐廳 3x UR，附贈免費 DashPass 會籍與每月 $10 DoorDash 生鮮折抵。'
        }
      },
      'bonvoy-brilliant': {
        mult: '3x + $25/mo',
        badge: { en: 'Monthly Habit', 'zh-TW': '每月必刷' },
        note: {
          en: 'Marriott Bonvoy Brilliant: Swipe for your first $25 dining spend each calendar month to capture $300/yr credits.',
          'zh-TW': 'Marriott Brilliant: 每個月第一筆 $25 用餐請務必刷萬豪 Brilliant 直接現抵，每年穩賺 $300 報銷！'
        }
      }
    },
    domestic: {
      winner: 'Amex Business Gold (4x MR) / CSP (3x UR + $10 DoorDash) / Brilliant (3x + $25/mo)',
      candidateCards: ['amex-biz-gold', 'csp', 'bonvoy-brilliant'],
      cards: {
        'amex-biz-gold': {
          mult: '4x MR',
          badge: { en: 'Top Multiplier', 'zh-TW': '最高倍率' },
          note: {
            en: 'Amex Business Gold: 4x MR when dining is one of your top 2 billing cycle spend categories (up to $150k/yr).',
            'zh-TW': 'Amex 商業金卡: 若餐廳為該期帳單前二大花費類別，享 4x MR 點數累積（每年上限 15 萬美元）。'
          }
        },
        'csp': {
          mult: '3x UR',
          badge: { en: 'Best for Delivery & DashPass', 'zh-TW': '外送與生鮮首選' },
          note: {
            en: 'Chase Sapphire Preferred: 3x UR on dining, complimentary DashPass & $10/mo DoorDash grocery credit.',
            'zh-TW': 'Chase Sapphire Preferred: 餐廳 3x UR，附贈免費 DashPass 會籍與每月 $10 DoorDash 生鮮折抵。'
          }
        },
        'bonvoy-brilliant': {
          mult: '3x + $25/mo',
          badge: { en: 'Monthly Habit', 'zh-TW': '每月必刷' },
          note: {
            en: 'Marriott Bonvoy Brilliant: Swipe for your first $25 dining spend each calendar month to capture $300/yr credits.',
            'zh-TW': 'Marriott Brilliant: 每個月第一筆 $25 用餐請務必刷萬豪 Brilliant 直接現抵，每年穩賺 $300 報銷！'
          }
        }
      }
    },
    overseas: {
      winner: 'CSP (3x UR / 0% FTF / Visa 全球通) / Venture X (2x / 0% FTF) / Brilliant (3x + $25/mo)',
      candidateCards: ['csp', 'venture-x', 'bonvoy-brilliant', 'amex-biz-gold'],
      cards: {
        'csp': {
          mult: '3x UR · 0% FTF',
          badge: { en: 'Top Overseas Dining (Visa)', 'zh-TW': '海外用餐唯一首選 (Visa)' },
          note: {
            en: 'Chase Sapphire Preferred: 3x UR worldwide on dining, 0% FTF, and Visa acceptance everywhere even when Amex is not accepted.',
            'zh-TW': 'Chase Sapphire Preferred: 全球餐廳一律 3x UR、0% FTF，Visa 在海外餐廳接受度遠勝 Amex，出國用餐無腦首選！'
          }
        },
        'venture-x': {
          mult: '2x Miles · 0% FTF',
          badge: { en: 'Universal Fallback', 'zh-TW': '海外全能備援 (Visa)' },
          note: {
            en: 'Capital One Venture X: 2x miles everywhere with 0% FTF. Excellent fallback if you do not carry a dining card.',
            'zh-TW': 'Capital One Venture X: 0% FTF，任何海外消費 2x 哩程累積。若手邊無專屬餐飲卡時的萬用首選。'
          }
        },
        'bonvoy-brilliant': {
          mult: '3x + $25/mo · 0% FTF',
          badge: { en: 'Worldwide Credit', 'zh-TW': '全球餐廳皆可折抵' },
          note: {
            en: 'Marriott Bonvoy Brilliant: 0% FTF, 3x points worldwide, and your monthly $25 dining credit works at overseas restaurants too!',
            'zh-TW': 'Marriott Brilliant: 0% FTF、全球餐廳 3x 萬豪點數，且每月 $25 餐飲額度在國外實體餐廳消費一樣能全額報銷！'
          }
        },
        'amex-biz-gold': {
          mult: '4x MR · 0% FTF',
          badge: { en: 'Highest If Amex Accepted', 'zh-TW': '最高倍率 (若店家收 Amex)' },
          note: {
            en: 'Amex Business Gold: 4x MR on dining worldwide with 0% FTF, but check if the overseas restaurant accepts American Express.',
            'zh-TW': 'Amex 商業金卡: 全球餐廳享有 4x MR 與 0% FTF，但海外中小型餐廳 Amex 接受度較低，建議結帳前先確認。'
          }
        }
      },
      ftfTraps: [
        { id: 'cfu', rate: '3.0% FTF' },
        { id: 'cic', rate: '3.0% FTF' },
        { id: 'bbp', rate: '2.7% FTF' }
      ]
    }
  },
  flights: {
    title: { en: '✈️ Flight Bookings', 'zh-TW': '✈️ 機票預訂' },
    winner: 'The Business Platinum (5x MR) / Capital One Venture X (5x / $300 Credit)',
    candidateCards: ['amex-biz-plat', 'venture-x', 'csp'],
    cards: {
      'amex-biz-plat': {
        mult: '5x MR',
        badge: { en: 'Top Air Protection', 'zh-TW': '頂級延誤保障' },
        note: {
          en: 'Amex Business Platinum: 5x MR via AmexTravel with industry-leading 6-hour flight delay insurance and baggage protection.',
          'zh-TW': 'Amex 商業大白: 透過 AmexTravel 享 5x MR，享有全美最頂級的 6 小時班機延誤險與行李遺失保障。'
        }
      },
      'venture-x': {
        mult: '5x / $300 Credit',
        badge: { en: 'Top Portal Cashback', 'zh-TW': '旅遊額度首選' },
        note: {
          en: 'Capital One Venture X: 5x Miles via C1 Travel portal. Use your $300 annual portal credit first!',
          'zh-TW': 'Capital One Venture X: 透過 C1 Travel 訂票享 5x 哩程，優先折抵每年 $300 入口網站機票額度！'
        }
      },
      'csp': {
        mult: '2x Travel',
        badge: { en: 'Solid Travel Insurance', 'zh-TW': '優質旅遊保障' },
        note: {
          en: 'Chase Sapphire Preferred: 2x UR on flights, with primary trip cancellation & baggage delay protection.',
          'zh-TW': 'Chase Sapphire Preferred: 購買機票享 2x UR，附帶完善的行程取消險與行李延誤保障。'
        }
      }
    },
    domestic: {
      winner: 'The Business Platinum (5x MR) / Capital One Venture X (5x / $300 Credit)',
      candidateCards: ['amex-biz-plat', 'venture-x', 'csp'],
      cards: {
        'amex-biz-plat': {
          mult: '5x MR',
          badge: { en: 'Top Air Protection', 'zh-TW': '頂級延誤保障' },
          note: {
            en: 'Amex Business Platinum: 5x MR via AmexTravel with industry-leading 6-hour flight delay insurance and baggage protection.',
            'zh-TW': 'Amex 商業大白: 透過 AmexTravel 享 5x MR，享有全美最頂級的 6 小時班機延誤險與行李遺失保障。'
          }
        },
        'venture-x': {
          mult: '5x / $300 Credit',
          badge: { en: 'Top Portal Cashback', 'zh-TW': '旅遊額度首選' },
          note: {
            en: 'Capital One Venture X: 5x Miles via C1 Travel portal. Use your $300 annual portal credit first!',
            'zh-TW': 'Capital One Venture X: 透過 C1 Travel 訂票享 5x 哩程，優先折抵每年 $300 入口網站機票額度！'
          }
        },
        'csp': {
          mult: '2x Travel',
          badge: { en: 'Solid Travel Insurance', 'zh-TW': '優質旅遊保障' },
          note: {
            en: 'Chase Sapphire Preferred: 2x UR on flights, with primary trip cancellation & baggage delay protection.',
            'zh-TW': 'Chase Sapphire Preferred: 購買機票享 2x UR，附帶完善的行程取消險與行李延誤保障。'
          }
        }
      }
    },
    overseas: {
      winner: 'The Business Platinum (5x MR / 0% FTF) / Venture X (5x / 0% FTF) / CSP (2x Travel / 0% FTF)',
      candidateCards: ['amex-biz-plat', 'venture-x', 'csp'],
      cards: {
        'amex-biz-plat': {
          mult: '5x MR · 0% FTF',
          badge: { en: 'Top Air Protection', 'zh-TW': '頂級延誤保障 (0% FTF)' },
          note: {
            en: 'Amex Business Platinum: 5x MR via AmexTravel with industry-leading 6-hour delay insurance & baggage protection, 0% FTF.',
            'zh-TW': 'Amex 商業大白: 0% FTF，透過 AmexTravel 享 5x MR，享有全美最頂級的 6 小時班機延誤險與行李遺失保障。'
          }
        },
        'venture-x': {
          mult: '5x / $300 Credit · 0% FTF',
          badge: { en: 'Top Portal Cashback', 'zh-TW': '旅遊額度首選 (0% FTF)' },
          note: {
            en: 'Capital One Venture X: 5x Miles via C1 Travel portal. Use your $300 annual portal credit first, 0% FTF.',
            'zh-TW': 'Capital One Venture X: 0% FTF，透過 C1 Travel 訂票享 5x 哩程，優先折抵每年 $300 入口網站機票額度！'
          }
        },
        'csp': {
          mult: '2x Travel · 0% FTF',
          badge: { en: 'Foreign Airline Direct', 'zh-TW': '外籍航空官網購票' },
          note: {
            en: 'Chase Sapphire Preferred: 2x UR when booking directly with international airlines, 0% FTF + trip cancellation & delay protection.',
            'zh-TW': 'Chase Sapphire Preferred: 直接向海外航空公司官網購票享 2x UR、0% FTF，並附帶優秀的旅遊取消與延誤險。'
          }
        }
      },
      ftfTraps: [
        { id: 'cfu', rate: '3.0% FTF' },
        { id: 'bbp', rate: '2.7% FTF' },
        { id: 'cic', rate: '3.0% FTF' }
      ]
    }
  },
  hotels: {
    title: { en: '🏨 Hotel Stays (2026 Updated)', 'zh-TW': '🏨 飯店住宿預訂 (2026 最新攻略)' },
    winner: 'Amex Biz Plat ($600 FHR Credit) / Marriott Brilliant (6x) / IHG Premier (26x)',
    candidateCards: ['amex-biz-plat', 'bonvoy-brilliant', 'ihg-premier', 'venture-x'],
    cards: {
      'amex-biz-plat': {
        mult: '$600 FHR Credit',
        badge: { en: '2026 Top Hotel Credit', 'zh-TW': '頂級奢華飯店' },
        note: {
          en: 'Amex Business Platinum: $300 per half-year on Fine Hotels + Resorts (FHR) or THC bookings with guaranteed 4pm checkout & breakfast.',
          'zh-TW': 'Amex 商業大白: 每半年 $300 預訂 FHR 奢華飯店，享有保證下午 4 點延遲退房與雙人免費早餐。'
        }
      },
      'bonvoy-brilliant': {
        mult: '6x Marriott Points',
        badge: { en: 'Marriott Elite', 'zh-TW': '萬豪集團首選' },
        note: {
          en: 'Marriott Bonvoy Brilliant: 6x points at Marriott hotels. Combined with Platinum Elite yields up to 21x total Marriott points.',
          'zh-TW': 'Marriott Brilliant: 萬豪集團消費 6x 點數，疊加卡片自帶的白金會籍綜合累積高達 21x 萬豪點數！'
        }
      },
      'ihg-premier': {
        mult: 'Up to 26x Points',
        badge: { en: 'IHG Group Top Pick', 'zh-TW': 'IHG 集團首選' },
        note: {
          en: 'Chase IHG Premier: Up to 26x total at IHG hotels, Platinum Elite status, 4th night free award redemption, and $25/qtr dining.',
          'zh-TW': 'Chase IHG Premier: 於 IHG 旗下消費高達 26x 綜合點數，附帶白金會籍、住四免一與每季 $25 折抵。'
        }
      },
      'venture-x': {
        mult: '10x Miles via Portal',
        badge: { en: 'C1 Travel Portal 10x', 'zh-TW': '入口網站 10x 哩程' },
        note: {
          en: 'Capital One Venture X: 10x miles on hotels booked via C1 Travel portal with $300 annual credit and 0% FTF.',
          'zh-TW': 'Capital One Venture X: 透過 C1 Travel 預訂全球飯店享 10x 哩程，可折抵每年 $300 旅遊額度，0% FTF。'
        }
      }
    },
    domestic: {
      winner: 'Amex Biz Plat ($600 FHR Credit) / Marriott Brilliant (6x) / IHG Premier (26x)',
      candidateCards: ['amex-biz-plat', 'bonvoy-brilliant', 'ihg-premier', 'venture-x'],
      cards: {
        'amex-biz-plat': {
          mult: '$600 FHR Credit',
          badge: { en: '2026 Top Hotel Credit', 'zh-TW': '頂級奢華飯店' },
          note: {
            en: 'Amex Business Platinum: $300 per half-year on Fine Hotels + Resorts (FHR) or THC bookings with guaranteed 4pm checkout & breakfast.',
            'zh-TW': 'Amex 商業大白: 每半年 $300 預訂 FHR 奢華飯店，享有保證下午 4 點延遲退房與雙人免費早餐。'
          }
        },
        'bonvoy-brilliant': {
          mult: '6x Marriott Points',
          badge: { en: 'Marriott Elite', 'zh-TW': '萬豪集團首選' },
          note: {
            en: 'Marriott Bonvoy Brilliant: 6x points at Marriott hotels. Combined with Platinum Elite yields up to 21x total Marriott points.',
            'zh-TW': 'Marriott Brilliant: 萬豪集團消費 6x 點數，疊加卡片自帶的白金會籍綜合累積高達 21x 萬豪點數！'
          }
        },
        'ihg-premier': {
          mult: 'Up to 26x Points',
          badge: { en: 'IHG Group Top Pick', 'zh-TW': 'IHG 集團首選' },
          note: {
            en: 'Chase IHG Premier: Up to 26x total at IHG hotels, Platinum Elite status, 4th night free award redemption, and $25/qtr dining.',
            'zh-TW': 'Chase IHG Premier: 於 IHG 旗下消費高達 26x 綜合點數，附帶白金會籍、住四免一與每季 $25 折抵。'
          }
        },
        'venture-x': {
          mult: '10x Miles via Portal',
          badge: { en: 'C1 Travel Portal 10x', 'zh-TW': '入口網站 10x 哩程' },
          note: {
            en: 'Capital One Venture X: 10x miles on hotels booked via C1 Travel portal with $300 annual credit and 0% FTF.',
            'zh-TW': 'Capital One Venture X: 透過 C1 Travel 預訂全球飯店享 10x 哩程，可折抵每年 $300 旅遊額度，0% FTF。'
          }
        }
      }
    },
    overseas: {
      winner: 'Amex Biz Plat ($600 FHR 全球奢華飯店) / Marriott Brilliant (6x / 0% FTF) / IHG Premier (26x / 0% FTF)',
      candidateCards: ['amex-biz-plat', 'bonvoy-brilliant', 'ihg-premier', 'venture-x'],
      cards: {
        'amex-biz-plat': {
          mult: '$600 FHR Credit · 0% FTF',
          badge: { en: 'Global Luxury Resorts', 'zh-TW': '全球 FHR 奢華飯店' },
          note: {
            en: 'Amex Business Platinum: $300 per half-year on FHR/THC worldwide with 4pm checkout, breakfast & $100 property credit, 0% FTF.',
            'zh-TW': 'Amex 商業大白: 0% FTF，每半年 $300 預訂全球 FHR 頂級奢華飯店，享下午 4 點延遲退房、免費早餐與 $100 體驗額度。'
          }
        },
        'bonvoy-brilliant': {
          mult: '6x Points · 0% FTF',
          badge: { en: 'Worldwide Marriott Elite', 'zh-TW': '全球萬豪白金尊爵' },
          note: {
            en: 'Marriott Bonvoy Brilliant: 6x points at Marriott worldwide, 0% FTF. Automatic Platinum Elite unlocks free breakfast & lounge access across Asia & Europe!',
            'zh-TW': 'Marriott Brilliant: 全球萬豪集團 6x 點數，0% FTF。自帶白金會籍在亞洲與歐洲飯店享有免費行政酒廊與豐盛早餐！'
          }
        },
        'ihg-premier': {
          mult: 'Up to 26x · 0% FTF',
          badge: { en: 'IHG Worldwide Stays', 'zh-TW': '全球洲際 IHG 必刷' },
          note: {
            en: 'Chase IHG Premier: Up to 26x total points at IHG hotels worldwide, 0% FTF, Platinum Elite status and 4th night free award stays.',
            'zh-TW': 'Chase IHG Premier: 全球 IHG 旗下消費高達 26x 綜合點數，0% FTF，附帶白金會籍與點數兌換住四免一。'
          }
        },
        'venture-x': {
          mult: '10x Portal · 0% FTF',
          badge: { en: 'C1 Travel Portal 10x', 'zh-TW': '入口網站 10x 哩程' },
          note: {
            en: 'Capital One Venture X: 10x miles on hotels booked via C1 Travel portal with $300 annual credit and 0% FTF.',
            'zh-TW': 'Capital One Venture X: 透過 C1 Travel 預訂全球飯店享 10x 哩程，可折抵每年 $300 旅遊額度，0% FTF。'
          }
        }
      },
      ftfTraps: [
        { id: 'cfu', rate: '3.0% FTF' },
        { id: 'cic', rate: '3.0% FTF' },
        { id: 'bbp', rate: '2.7% FTF' }
      ]
    }
  },
  office: {
    title: { en: '📦 Office Supplies & Internet/Phone', 'zh-TW': '📦 辦公文具與電信網路' },
    winner: 'Chase Ink Business Cash (5% / 5x UR)',
    candidateCards: ['cic'],
    cards: {
      'cic': {
        mult: '5x UR / 5%',
        badge: { en: 'The Undisputed 5x King', 'zh-TW': '全美最強辦公神卡' },
        note: {
          en: 'Chase Ink Cash: Earns 5x at office supply stores, cell phone, internet & cable (up to $25k/yr). Buy Amazon or restaurant gift cards at Staples for 5x UR!',
          'zh-TW': 'Chase Ink Cash: 於 Staples、Office Depot 辦公文具店與電話網路費享 5x UR（每年上限 2.5 萬美元）。在 Staples 買禮品卡亦享 5x！'
        }
      }
    },
    domestic: {
      winner: 'Chase Ink Business Cash (5% / 5x UR)',
      candidateCards: ['cic'],
      cards: {
        'cic': {
          mult: '5x UR / 5%',
          badge: { en: 'The Undisputed 5x King', 'zh-TW': '全美最強辦公神卡' },
          note: {
            en: 'Chase Ink Cash: Earns 5x at office supply stores, cell phone, internet & cable (up to $25k/yr). Buy Amazon or restaurant gift cards at Staples for 5x UR!',
            'zh-TW': 'Chase Ink Cash: 於 Staples、Office Depot 辦公文具店與電話網路費享 5x UR（每年上限 2.5 萬美元）。在 Staples 買禮品卡亦享 5x！'
          }
        }
      }
    },
    overseas: {
      winner: 'Capital One Venture X (2x Miles / 0% FTF) / CSP (0% FTF)',
      candidateCards: ['venture-x', 'csp'],
      cards: {
        'venture-x': {
          mult: '2x Miles · 0% FTF',
          badge: { en: 'Safe for Foreign Telco/eSIM', 'zh-TW': '外幣電信/eSIM 首選' },
          note: {
            en: 'Capital One Venture X: 2x miles on overseas co-working, local SIM / foreign eSIM providers with 0% FTF.',
            'zh-TW': 'Capital One Venture X: 購買海外當地電信漫遊、外國 eSIM 或境外辦公空間享 2x 哩程，0% FTF。'
          }
        },
        'csp': {
          mult: '1x UR · 0% FTF',
          badge: { en: 'Zero Fee Fallback', 'zh-TW': '免手續費備援' },
          note: {
            en: 'Chase Sapphire Preferred: 0% FTF when paying foreign currency office or connectivity bills.',
            'zh-TW': 'Chase Sapphire Preferred: 0% FTF，刷非美金之電信或辦公帳單安全無手續費。'
          }
        }
      },
      ftfTraps: [
        { id: 'cic', rate: '3.0% FTF' },
        { id: 'cfu', rate: '3.0% FTF' },
        { id: 'bbp', rate: '2.7% FTF' }
      ]
    }
  },
  grocery: {
    title: { en: '🛒 Supermarkets & Groceries', 'zh-TW': '🛒 超市生鮮採買' },
    winner: 'Amex EveryDay (up to 2.4x MR) / CSP Online Grocery (3x UR)',
    candidateCards: ['amex-ed', 'csp'],
    cards: {
      'amex-ed': {
        mult: '2.0x - 2.4x MR',
        badge: { en: 'Physical Supermarkets', 'zh-TW': '實體超市採買' },
        note: {
          en: 'Amex EveryDay: 2x at US supermarkets up to $6k/yr; 20+ transactions in billing period boosts points by 20% to 2.4x MR.',
          'zh-TW': 'Amex EveryDay: 超市 2x（每年上限 6,000 美元），當期帳單刷滿 20 筆加贈 20%（相當於 2.4x MR）。'
        }
      },
      'csp': {
        mult: '3x UR',
        badge: { en: 'Online Groceries', 'zh-TW': '線上生鮮外送' },
        note: {
          en: 'Chase Sapphire Preferred: 3x UR on online grocery delivery (Instacart, Kroger, etc., excluding Target & Walmart).',
          'zh-TW': 'Chase Sapphire Preferred: 線上生鮮採買與外送（如 Instacart 等各類線上生鮮平台）享有 3x UR。'
        }
      }
    },
    domestic: {
      winner: 'Amex EveryDay (up to 2.4x MR) / CSP Online Grocery (3x UR)',
      candidateCards: ['amex-ed', 'csp'],
      cards: {
        'amex-ed': {
          mult: '2.0x - 2.4x MR',
          badge: { en: 'Physical Supermarkets', 'zh-TW': '實體超市採買' },
          note: {
            en: 'Amex EveryDay: 2x at US supermarkets up to $6k/yr; 20+ transactions in billing period boosts points by 20% to 2.4x MR.',
            'zh-TW': 'Amex EveryDay: 超市 2x（每年上限 6,000 美元），當期帳單刷滿 20 筆加贈 20%（相當於 2.4x MR）。'
          }
        },
        'csp': {
          mult: '3x UR',
          badge: { en: 'Online Groceries', 'zh-TW': '線上生鮮外送' },
          note: {
            en: 'Chase Sapphire Preferred: 3x UR on online grocery delivery (Instacart, Kroger, etc., excluding Target & Walmart).',
            'zh-TW': 'Chase Sapphire Preferred: 線上生鮮採買與外送（如 Instacart 等各類線上生鮮平台）享有 3x UR。'
          }
        }
      }
    },
    overseas: {
      winner: 'Capital One Venture X (2x Miles / 0% FTF / 全球 Visa) / CSP (0% FTF)',
      candidateCards: ['venture-x', 'csp'],
      cards: {
        'venture-x': {
          mult: '2x Miles · 0% FTF',
          badge: { en: 'Overseas Supermarket King', 'zh-TW': '海外超市首選 (Visa)' },
          note: {
            en: 'Capital One Venture X: Global Visa acceptance, 0% FTF, and unlimited 2x miles at foreign supermarkets & convenience stores.',
            'zh-TW': 'Capital One Venture X: Visa 全球通用性極高，0% FTF，國外實體超市、唐吉訶德、量販超商一律享有 2x 哩程！'
          }
        },
        'csp': {
          mult: '1x UR · 0% FTF',
          badge: { en: 'Zero Fee Backup', 'zh-TW': '免手續費備用' },
          note: {
            en: 'Chase Sapphire Preferred: 0% FTF and 1x UR catch-all. Safe fallback with no foreign fees.',
            'zh-TW': 'Chase Sapphire Preferred: 免海外手續費 (0% FTF) 且 Visa 通用，出國買生鮮安全不被扣手續費。'
          }
        }
      },
      ftfTraps: [
        { id: 'amex-ed', rate: '2.7% FTF' },
        { id: 'cfu', rate: '3.0% FTF' },
        { id: 'cic', rate: '3.0% FTF' },
        { id: 'bbp', rate: '2.7% FTF' }
      ]
    }
  },
  gas: {
    title: { en: '⛽ Gas & EV Charging (2026 Upgraded)', 'zh-TW': '⛽ 加油與交通 (2026 升級)' },
    winner: 'Amex Business Gold (4x MR) / Chase Sapphire Preferred (3x UR)',
    candidateCards: ['amex-biz-gold', 'csp'],
    cards: {
      'amex-biz-gold': {
        mult: '4x MR',
        badge: { en: 'Top Multiplier', 'zh-TW': '首選商業卡' },
        note: {
          en: 'Amex Business Gold: 4x MR on US gas stations when gas is in your top 2 business spend categories for the billing cycle.',
          'zh-TW': 'Amex 商業金卡: 若加油為當期前二大花費類別，自動享有 4x MR 點數。'
        }
      },
      'csp': {
        mult: '3x UR',
        badge: { en: '2026 Overhaul', 'zh-TW': '2026 新升級' },
        note: {
          en: 'Chase Sapphire Preferred: 2026 upgrade permanently added 3x points on gas station purchases and EV charging stations!',
          'zh-TW': 'Chase Sapphire Preferred: 2026 全面升級新增加油站與電動車 (EV) 充電樁 3x UR 點數回饋！'
        }
      }
    },
    domestic: {
      winner: 'Amex Business Gold (4x MR) / Chase Sapphire Preferred (3x UR)',
      candidateCards: ['amex-biz-gold', 'csp'],
      cards: {
        'amex-biz-gold': {
          mult: '4x MR',
          badge: { en: 'Top Multiplier', 'zh-TW': '首選商業卡' },
          note: {
            en: 'Amex Business Gold: 4x MR on US gas stations when gas is in your top 2 business spend categories for the billing cycle.',
            'zh-TW': 'Amex 商業金卡: 若加油為當期前二大花費類別，自動享有 4x MR 點數。'
          }
        },
        'csp': {
          mult: '3x UR',
          badge: { en: '2026 Overhaul', 'zh-TW': '2026 新升級' },
          note: {
            en: 'Chase Sapphire Preferred: 2026 upgrade permanently added 3x points on gas station purchases and EV charging stations!',
            'zh-TW': 'Chase Sapphire Preferred: 2026 全面升級新增加油站與電動車 (EV) 充電樁 3x UR 點數回饋！'
          }
        }
      }
    },
    overseas: {
      winner: 'CSP (3x 加油充電 / 2x 海外交通地鐵 JR / Primary CDW 租車險 / 0% FTF) / Venture X (2x / 0% FTF)',
      candidateCards: ['csp', 'venture-x'],
      cards: {
        'csp': {
          mult: '3x Gas / 2x Transit · 0% FTF',
          badge: { en: 'Overseas Transit & Car Rental King', 'zh-TW': '海外交通自駕租車之王' },
          note: {
            en: 'Chase Sapphire Preferred: 3x on gas/EV charging, 2x on international transit (trains, subways, JR, taxis, Uber), 0% FTF, and Primary Auto CDW rental coverage worldwide.',
            'zh-TW': 'Chase Sapphire Preferred: 加油充電 3x，海外大眾交通（日本 JR、地鐵、計程車、Uber）2x UR，0% FTF，並提供頂級海外租車 Primary CDW 車碰險！'
          }
        },
        'venture-x': {
          mult: '2x Miles · 0% FTF',
          badge: { en: 'Universal 2x + Primary CDW', 'zh-TW': '全能 2x + 租車一級險' },
          note: {
            en: 'Capital One Venture X: Unlimited 2x miles on foreign gas stations & transit, 0% FTF, with built-in Primary CDW car rental coverage.',
            'zh-TW': 'Capital One Venture X: 海外加油與交通一律 2x 哩程，0% FTF，且同樣自帶 Primary CDW 海外租車一級保險。'
          }
        }
      },
      ftfTraps: [
        { id: 'amex-biz-gold', rate: '⚠️ 僅限美境內 4x' },
        { id: 'bbp', rate: '2.7% FTF' },
        { id: 'cfu', rate: '3.0% FTF' }
      ]
    }
  },
  catchall: {
    title: { en: '⚡ Non-Category / Everyday Catch-all', 'zh-TW': '⚡ 一般日常消費 (萬用無腦 2x)' },
    winner: 'Amex Blue Business Plus (2x MR) / Capital One Venture X (2x Miles)',
    candidateCards: ['bbp', 'venture-x'],
    cards: {
      'bbp': {
        mult: '2x MR',
        badge: { en: 'Top Overall Value', 'zh-TW': '全美最強萬用卡' },
        note: {
          en: 'Amex Blue Business Plus: 2x MR on first $50,000 spend per calendar year (estimated ~3.2%+ value).',
          'zh-TW': 'Amex BBP: 每年首 5 萬美元所有非類別消費享 2x MR（估值約 3.2%+）。'
        }
      },
      'venture-x': {
        mult: '2x Miles',
        badge: { en: 'No Limit & Visa Everywhere', 'zh-TW': '無上限 Visa 全球通' },
        note: {
          en: 'Capital One Venture X: Unlimited 2x miles per dollar everywhere; ideal when Amex is not accepted or spend exceeds $50k.',
          'zh-TW': 'Capital One Venture X: 超過 5 萬限額或店家不收 Amex 時的首選，無上限 2x 哩程累積。'
        }
      }
    },
    domestic: {
      winner: 'Amex Blue Business Plus (2x MR) / Capital One Venture X (2x Miles)',
      candidateCards: ['bbp', 'venture-x'],
      cards: {
        'bbp': {
          mult: '2x MR',
          badge: { en: 'Top Overall Value', 'zh-TW': '全美最強萬用卡' },
          note: {
            en: 'Amex Blue Business Plus: 2x MR on first $50,000 spend per calendar year (estimated ~3.2%+ value).',
            'zh-TW': 'Amex BBP: 每年首 5 萬美元所有非類別消費享 2x MR（估值約 3.2%+）。'
          }
        },
        'venture-x': {
          mult: '2x Miles',
          badge: { en: 'No Limit & Visa Everywhere', 'zh-TW': '無上限 Visa 全球通' },
          note: {
            en: 'Capital One Venture X: Unlimited 2x miles per dollar everywhere; ideal when Amex is not accepted or spend exceeds $50k.',
            'zh-TW': 'Capital One Venture X: 超過 5 萬限額或店家不收 Amex 時的首選，無上限 2x 哩程累積。'
          }
        }
      }
    },
    overseas: {
      winner: 'Capital One Venture X (2x Miles / 0% FTF / 全球 Visa 通用王)',
      candidateCards: ['venture-x', 'csp', 'bonvoy-brilliant'],
      cards: {
        'venture-x': {
          mult: '2x Miles · 0% FTF',
          badge: { en: 'Undisputed Overseas King', 'zh-TW': '全美最強海外萬用神卡' },
          note: {
            en: 'Capital One Venture X: Unlimited 2x miles on every purchase worldwide, 0% FTF, and Visa acceptance across 200+ countries.',
            'zh-TW': 'Capital One Venture X: 全球任何非類別消費無上限 2x 哩程，0% FTF，Visa 在全世界超過 200 國暢行無阻！'
          }
        },
        'csp': {
          mult: '1x UR · 0% FTF',
          badge: { en: 'Reliable Visa Everywhere', 'zh-TW': '可靠 Visa 萬用通道' },
          note: {
            en: 'Chase Sapphire Preferred: 0% FTF, 1x UR catch-all. Safe fallback for any purchase abroad.',
            'zh-TW': 'Chase Sapphire Preferred: 0% FTF，海外萬用 1x UR，出國刷卡安全無手續費。'
          }
        },
        'bonvoy-brilliant': {
          mult: '2x Points · 0% FTF',
          badge: { en: 'Marriott Points Catch-all', 'zh-TW': '萬豪點數累積' },
          note: {
            en: 'Marriott Bonvoy Brilliant: 2x Marriott Bonvoy points on all non-category spend with 0% FTF.',
            'zh-TW': 'Marriott Brilliant: 所有日常非類別消費享 2x 萬豪點數，0% FTF。'
          }
        }
      },
      ftfTraps: [
        { id: 'bbp', rate: '2.7% FTF' },
        { id: 'bbc', rate: '2.7% FTF' },
        { id: 'cfu', rate: '3.0% FTF' },
        { id: 'ciu', rate: '3.0% FTF' },
        { id: 'cic', rate: '3.0% FTF' },
        { id: 'amex-ed', rate: '2.7% FTF' }
      ]
    }
  },
  foreign: {
    title: { en: '🌍 Overseas / No Foreign Transaction Fees (0% FTF)', 'zh-TW': '🌍 海外實體 / 免海外手續費 (0% FTF 攻略)' },
    winner: 'Capital One Venture X (2x Everywhere, 0% FTF) / CSP (3x Dining, 0% FTF)',
    candidateCards: ['venture-x', 'csp'],
    cards: {
      'venture-x': {
        mult: '2x Miles / 0% FTF',
        badge: { en: 'Universal Non-Category', 'zh-TW': '海外旅遊全方位首選' },
        note: {
          en: 'Capital One Venture X: Global Visa acceptance, zero foreign transaction fees, 2x miles on every purchase worldwide.',
          'zh-TW': 'Capital One Venture X: Visa 全球通用性極高，免海外交易手續費，任何海外消費一律享 2x 哩程回饋。'
        }
      },
      'csp': {
        mult: '3x Dining / 0% FTF',
        badge: { en: 'Dining & Car Rental', 'zh-TW': '海外用餐與自駕租車' },
        note: {
          en: 'Chase Sapphire Preferred: 3x UR points on international restaurants + top-tier Primary Auto Rental CDW coverage.',
          'zh-TW': 'Chase Sapphire Preferred: 全球餐廳 3x UR、0% FTF，且提供海外自駕最安心的 Primary CDW 租車車碰險。'
        }
      }
    },
    ftfTraps: [
      { id: 'cfu', rate: '3.0% FTF' },
      { id: 'cic', rate: '3.0% FTF' },
      { id: 'ciu', rate: '3.0% FTF' },
      { id: 'bbp', rate: '2.7% FTF' },
      { id: 'bbc', rate: '2.7% FTF' },
      { id: 'amex-ed', rate: '2.7% FTF' }
    ]
  }
};

