// CardFlow - Smart Credit Card & Loyalty Tracker
// Updated with 2026/2027 Latest Card Benefits, Credits & Tiers

const STATE_KEY = 'cardflow_state_v1';
const THEME_KEY = 'cardflow_theme_v1';
const PALETTE_KEY = 'cardflow_palette_v1';
const LANG_KEY = 'cardflow_lang_v1';
const BANNER_KEY = 'cardflow_banner_dismissed_v1';

// --- 1. MORANDI COLOR PALETTES ---
const MORANDI_PALETTES = {
  sage: {
    id: 'sage',
    name: { en: 'Mint & Peach Sage', 'zh-TW': '薄荷粉綠 (主打)' },
    primary: '#4EB896',
    primaryDark: '#3DA080',
    primaryRgb: '78 184 150',
    primaryDarkRgb: '61 160 128',
    income: '#3BBF8F',
    expense: '#F47B89',
    bgLight: '#F3F7F5',
    bgDark: '#17201D',
    cardDark: '#202B27'
  },
  ocean: {
    id: 'ocean',
    name: { en: 'Ocean Breeze Teal', 'zh-TW': '海風霧藍' },
    primary: '#4A90E2',
    primaryDark: '#357ABD',
    primaryRgb: '74 144 226',
    primaryDarkRgb: '53 122 189',
    income: '#36B37E',
    expense: '#E06C75',
    bgLight: '#F0F4F8',
    bgDark: '#141E28',
    cardDark: '#1C2834'
  },
  terracotta: {
    id: 'terracotta',
    name: { en: 'Warm Terracotta', 'zh-TW': '陶土暮棕' },
    primary: '#D97768',
    primaryDark: '#B85E50',
    primaryRgb: '217 119 104',
    primaryDarkRgb: '184 94 80',
    income: '#48A999',
    expense: '#D97768',
    bgLight: '#FDF6F4',
    bgDark: '#261C1B',
    cardDark: '#332625'
  },
  lilac: {
    id: 'lilac',
    name: { en: 'Lilac Mist', 'zh-TW': '暮光灰紫' },
    primary: '#8A79B9',
    primaryDark: '#6E5699',
    primaryRgb: '138 121 185',
    primaryDarkRgb: '110 86 153',
    income: '#4DAA8A',
    expense: '#D16D86',
    bgLight: '#F6F4F9',
    bgDark: '#1D1924',
    cardDark: '#272230'
  },
  oat: {
    id: 'oat',
    name: { en: 'Warm Oat Latte', 'zh-TW': '燕麥奶杏' },
    primary: '#B58D67',
    primaryDark: '#99704C',
    primaryRgb: '181 141 103',
    primaryDarkRgb: '153 112 76',
    income: '#4F9D7E',
    expense: '#CF6D63',
    bgLight: '#FAF7F2',
    bgDark: '#221E1A',
    cardDark: '#2C2622'
  },
  olive: {
    id: 'olive',
    name: { en: 'Vintage Olive', 'zh-TW': '復古橄欖' },
    primary: '#5C8374',
    primaryDark: '#436357',
    primaryRgb: '92 131 116',
    primaryDarkRgb: '67 99 87',
    income: '#3AA37B',
    expense: '#DC756D',
    bgLight: '#F2F6F4',
    bgDark: '#151E1A',
    cardDark: '#1E2823'
  }
};

// --- 2. BILINGUAL LOCALIZATION (i18n) ---
const I18N = {
  en: {
    appTitle: 'CardFlow - Smart Credit Card & Loyalty Tracker (2026/2027 Updated)',
    appSubtitle: 'Credit Card & Loyalty Tracker',
    screenModeDual: 'Unfolded Mode (Tablet)',
    screenModeSingle: 'Folded Mode (Phone)',
    
    // Banner
    demoBannerTag: '2026/2027 Updated',
    demoBannerText: '✨ Preloaded with 2026/2027 perks demo: Biz Plat $600 hotel, CSP $10 DoorDash + $100 hotel, VX 10k miles, IHG 50k FNC & 0% FTF warnings.',
    bannerResetMonth: '🔄 Reset Month',
    
    // Balance Card
    monthlyCreditsTitle: 'Monthly Statement Credits Due',
    balanceHealthy: 'All Claimed ✨',
    balanceAction: 'Action Needed ⏳',
    monthlyDueLabel: 'due this month',
    monthlyProgressTitle: 'Monthly Claimed',
    annualValueTitle: 'Annual Unlocked',
    usedUnit: 'used',
    perYearUnit: '/yr',
    itemsUnit: 'items',
    annualBreakdownBadge: 'Breakdown ↗',
    annualModalTitle: 'Annual Value Structure & Breakdown',
    annualModalSub: 'Total annualized statement credits across currently owned cards (Monthly×12 + Qtr×4 + Semi×2 + Annual×1).',
    annualModalTotalDesc: 'Total Annual Statement Credits',
    annualModalCloseBtn: 'Got it / Close',
    annualModalNoCardsDesc: 'No owned cards currently configured. Select your cards to calculate your personalized annual value.',
    periodQuarterly: 'Quarterly',
    barTitleMonthly: 'Monthly Perks',
    barTitleSemi: 'Semi-Annual & Quarterly Perks',
    barTitleAnnual: 'Annual Perks',
    shareUnit: 'share',
    formulaLabel: 'Formula',
    viewThisPeriodPerks: 'View this period in feed ➔',
    
    // Donut
    breakdownTitle: 'Credit Breakdown by Category',
    donutCenterTitle: 'Total Perks',
    donutCenterSub: 'Annual Value',
    cardsCountBadge: '12 Cards',
    
    // Loyalty Card
    loyaltyCardTitle: 'Active Hotel & Rental Tiers',
    noStaysNeeded: 'No Stays Needed',
    
    // Tabs
    tabCredits: 'Credits Due',
    tabCards: 'My Cards',
    tabLoyalty: 'Loyalty & FNC',
    tabAdvisor: 'Best Card & Stats',
    
    // Periods
    periodAll: 'All',
    periodMonthly: 'Monthly',
    periodSemiAnnual: 'Semi-Annual & Qtr',
    periodAnnual: 'Annual',
    
    // FNC Section
    fncSectionTitle: 'Annual Free Night Awards (FNC)',
    fncSectionDesc: 'Track expiration deadlines to ensure full redemption value (IHG upgraded to 50k!).',
    addFncBtn: 'Add FNC',
    daysLeft: 'days left',
    expired: 'Expired',
    markRedeemed: 'Mark as Redeemed',
    markUnused: 'Mark as Available',
    
    // Advisor
    advisorHeading: '"Which Card Should I Swipe?" Decision Engine',
    advisorSubheading: 'Select your spending category to discover the highest multiplier & protection policy.',
    catDining: 'Dining & Delivery',
    catFlights: 'Flights',
    catHotels: 'Hotels',
    catOffice: 'Office & Telco',
    catGrocery: 'Supermarkets',
    catGas: 'Gas & EV Charging',
    catForeign: 'Overseas / No FTF',
    catCatchall: 'Everyday Catch-all (2x)',
    
    // Modals
    modalAddFnc: 'Add Free Night Certificate',
    modalEditFnc: 'Edit Certificate',
    settingsTitle: 'Settings & Data Management',
    paletteLabel: 'Morandi Theme Palette',
    backupLabel: 'Backup & Restore',
    backupDesc: 'CardFlow is 100% private and client-side. Export your data as a JSON file to transfer between devices.',
    exportJson: 'Export JSON',
    importJson: 'Import JSON',
    resetFactory: '⚠️ Clear All Data & Reset to Defaults',
    
    // Credits Item Status
    claimedThisMonth: 'Claimed this month',
    readyToClaim: 'Ready to claim',
    saveCert: 'Save Certificate',
    cancel: 'Cancel',
    certName: 'Certificate Name',
    program: 'Program',
    capValue: 'Cap Value',
    expireDate: 'Expiration Date',

    // Card details
    metalBadge: 'Metal',
    noFtfBadge: 'No FTF',
    annualFeeLabel: 'Annual Fee',
    noAnnualFeeLabel: '$0 No AF',
    cardsSearchPlaceholder: 'Search cards, multipliers, perks...',
    renewMonthLabel: 'Renewal Month',
    openedYearLabel: 'Member Since',
    signupBonusLabel: 'Sign-up Bonus',
    useForLabel: 'Best Used For (Use for)',
    noFtfLabel: 'No FTF (0%)',
    ftfFeeLabel: 'FTF Fee',

    // Card Ownership & Batch Selection
    cardOwned: 'Owned',
    cardNotOwned: 'Not Owned',
    filterAllCards: 'All',
    filterOwned: 'Owned',
    filterUnowned: 'Unowned',
    noOwnedCardsTitle: 'No Active Cards in Wallet',
    noOwnedCardsDesc: 'Tap "Manage Cards" to pick the cards in your wallet, or switch to "All" to browse the 12 preset library.',
    btnBrowseAllCards: 'Browse All 12 Cards →',
    manageCardsBtnLabel: 'Manage Cards',
    manageCardsModalTitle: 'Select Owned Cards',
    manageCardsModalSub: 'Check the cards in your wallet. Benefits and chart will recalculate dynamically.',
    donutNoCredits: 'No statement credits available for currently owned cards.',
    donutNoCreditsSub: 'No credits',
    donutCenterPct: 'share',
    cardsCountBadgeSuffix: 'Owned',
    noCreditsDue: 'No statement credits due for currently owned cards in this period.',
    noCreditsDueSub: 'Go to the Cards tab or click above to customize your card portfolio.',

    // Google Drive
    gdriveSectionTitle: 'Google Drive Cloud Sync',
    gdriveStatusDisconnected: 'Disconnected',
    gdriveStatusConnected: 'Connected',
    gdriveSectionDesc: 'Securely sync your card portfolio & statement credits to your personal Google Drive for multi-device access.',
    gdriveClientIdLabel: 'Google OAuth Client ID',
    gdriveSaveClientIdBtn: 'Save',
    gdriveHelpBtn: 'How to get ID?',
    gdriveBackupLabel: 'Backup to Drive',
    gdriveRestoreLabel: 'Restore from Drive',
    gdriveAutoSyncLabel: 'Auto-sync to Drive on change',
    gdriveLastSyncLabel: 'Never synced',
    gdriveToggleConfig: 'Google Client ID Settings',
    gdriveSignoutBtn: 'Sign out Google Account',
    gdriveHelpTitle: 'Google Drive Sync Setup Guide',
    confirmGdriveHelpBtn: 'Got it',
    gdriveBackupSuccess: 'Successfully backed up to Google Drive!',
    gdriveRestoreSuccess: 'Successfully restored from Google Drive!',
    gdriveNoClientIdPrompt: 'Please enter your Google OAuth Client ID first.',
    gdriveNoBackupFound: 'No cardflow_backup.json found on your Google Drive.',

    // PWA Auto Update
    pwaUpdateText: 'New version ready! Tap to update',
    pwaUpdateBtn: 'Update Now',

    // Onboarding & Default Unowned State
    balanceNoCards: 'No Cards Active',
    onboardingTitle: 'Build Your Personal Credit Card Portfolio',
    onboardingDesc: 'Select the cards you currently hold from our preset vault to unlock automated monthly credits, elite hotel & rental tiers, and free night award tracking.',
    btnSelectCards: 'Select My Cards',
    btnLoadDemoPack: 'Load Sample Pack (CSP + CFU + Brilliant)',
    btnDemoPack: '⚡ Demo Pack',
    onboardingFeature1: '100% Local Storage',
    onboardingFeature2: 'Zero Backend Privacy',
    onboardingFeature3: 'Optional Google Drive Backup',
    bannerTagEmpty: '💡 Get Started',
    bannerTextEmpty: 'No cards active yet. Tap "Select My Cards" to start tracking credits, benefits, and renewal deadlines.',
    bannerTagActive: 'Cards Active',
    bannerTextActivePrefix: 'Tracking benefits for',
    bannerTextActiveSuffix: 'cards in your personal wallet. 100% stored on device.',
    toastDemoLoaded: 'Sample card pack loaded (CSP + CFU + Marriott Brilliant)!',

    // Card Membership Dates & Renewal Settings
    cardDateModalTitle: 'Set Card Membership Dates (Optional)',
    cardDateYearLabel: 'Member Since / Opening Year (Optional)',
    cardDateMonthLabel: 'Opening Month (Optional)',
    cardDateRenewLabel: 'Annual Fee Renewal Month (Optional)',
    cardDateYearSelectDefault: 'Not set (Optional)',
    cardDateMonthSelectDefault: 'Not set (Optional)',
    cardDateRenewSelectDefault: 'Same as opening month (Default)',
    cardDateRenewNoAf: 'No Annual Fee ($0 AF)',
    cardDateHintTitle: 'Smart Benefits & FNC Prediction',
    cardDateHintDesc: 'By setting the opening year & month, CardFlow automatically predicts Free Night Award (FNC) issuance & expiry dates, cardmember-year credit resets (e.g. CSP $50 hotel, VX $300 portal), and reminds you before annual fees post so you can request retention offers.',
    btnClear: 'Clear',
    btnCancel: 'Cancel',
    btnSave: 'Save Dates',
    btnSetDates: 'Set Dates (Optional)',
    btnEditDates: 'Edit Dates',
    toastDateSaved: 'Card dates saved successfully.',
    toastDateCleared: 'Card dates cleared.',
    renewDueThisMonth: 'Annual Fee Due This Month',
    renewDueNextMonth: 'Annual Fee Due Next Month',
    retentionReminder: 'Consider asking for retention offer or product change',
    monthUnit: 'Mo',

    // Free Night Awards (FNC)
    fncAutoDerived: 'Auto-derived from card',
    fncNoCertificates: 'No Hotel Free Night Awards Active',
    fncNoCertificatesSub: 'Add hotel cards (e.g. Marriott Bonvoy Brilliant 85k, IHG Premier 50k) in "My Cards" to automatically track your annual anniversary certificates, or add custom awards manually.',

    // Chase 5/24 Tracker
    chase524Title: 'Chase 5/24 Rule Status',
    chase524Desc: 'Tracks personal cards opened within the last 24 months. Chase typically auto-denies applications if you have opened 5 or more personal cards in 24 months.',
    chase524Safe: 'Safe to Apply',
    chase524Warning: '5/24 Limit Reached',
    chase524Unset: 'No card opening dates configured yet. Set opening dates on your personal cards to activate automated Chase 5/24 tracking.',
    chase524SafeDesc: 'You opened {n} personal cards in the last 24 months. Remaining slots before reaching 5/24: {rem}.',
    chase524WarningDesc: 'You opened {n} personal cards in the last 24 months (>= 5). Recommend waiting until older cards cross 24 months before applying for Chase cards.',
    monthsUntilDrop: 'm until drop',
    anniversaryResetPrefix: 'Resets annually in Month',
    anniversaryResetSuffix: '(Anniversary)',

    // Card Advisor & Ownership Awareness
    advisorSubheadingEmpty: 'Select a spending category to discover optimal cards & protection policies (no cards owned yet).',
    advisorSubheadingOwned: 'Personalized recommendations based on your {n} active cards in wallet.',
    advisorWalletPick: 'Best in Your Wallet',
    advisorNoOwnedInCat: 'No specialized card for this category in your wallet. Consider using your everyday 2x catch-all card, or browse top recommendations below.',
    advisorNoCardsBannerTitle: 'No Owned Cards Configured',
    advisorNoCardsBannerDesc: 'Select the cards in your wallet to unlock personalized swipe recommendations, or browse the complete 12-card library below.',
    advisorAllLibraryGuide: 'Full Card Library Benchmark',
    chase524NoPersonalCards: 'No personal cards added yet. Manage cards above to start tracking your Chase 5/24 status.'
  },
  'zh-TW': {
    appTitle: 'CardFlow - 智慧信用卡與常客權益管家 (2026/2027 最新版)',
    appSubtitle: '美卡與常旅客權益追蹤',
    screenModeDual: '展開模式 (Unfolded)',
    screenModeSingle: '折疊模式 (Folded)',
    
    // Banner
    demoBannerTag: '2026/2027 最新權益',
    demoBannerText: '✨ 預載 2026/2027 卡片權益展示範例：商業大白 $600 飯店折抵、CSP $10 DoorDash + $100 飯店、Venture X 續卡 1 萬哩、IHG 50k 房券與海外手續費防坑提醒。',
    bannerResetMonth: '🔄 重置本月狀態',
    
    // Balance Card
    monthlyCreditsTitle: '本月待用折抵額度',
    balanceHealthy: '全部用罄 ✨',
    balanceAction: '尚有待領 ⏳',
    monthlyDueLabel: '本月尚未折抵',
    monthlyProgressTitle: '本月折抵進度',
    annualValueTitle: '年度解鎖價值',
    usedUnit: '項已折抵',
    perYearUnit: '/年',
    itemsUnit: '項折抵',
    annualBreakdownBadge: '明細 ↗',
    annualModalTitle: '年度解鎖價值結構分析',
    annualModalSub: '所有已持有卡片之每年可折抵額度總和（每月×12 + 每季×4 + 半年×2 + 年度×1）。',
    annualModalTotalDesc: '已持有卡片全年權益折抵總和',
    annualModalCloseBtn: '我知道了 / 關閉',
    annualModalNoCardsDesc: '尚未設定持有卡片，請先點選「快速勾選持卡」即可自動計算您的年度專屬回饋價值。',
    periodQuarterly: '每季',
    barTitleMonthly: '每月折抵',
    barTitleSemi: '半年與每季折抵',
    barTitleAnnual: '年度折抵',
    shareUnit: '佔比',
    formulaLabel: '換算公式',
    viewThisPeriodPerks: '查看此週期折抵 ➔',
    
    // Donut
    breakdownTitle: '折抵額度類別分佈',
    donutCenterTitle: '年度總權益',
    donutCenterSub: '折抵價值',
    cardsCountBadge: '12 張卡片',
    
    // Loyalty Card
    loyaltyCardTitle: '信用卡自帶高階會籍',
    noStaysNeeded: '持卡即享免保級',
    
    // Tabs
    tabCredits: '待用權益',
    tabCards: '我的卡片',
    tabLoyalty: '會籍與房券',
    tabAdvisor: '刷卡指南 & 統計',
    
    // Periods
    periodAll: '全部',
    periodMonthly: '每月',
    periodSemiAnnual: '半年期與每季',
    periodAnnual: '年度',
    
    // FNC Section
    fncSectionTitle: '年度免費住宿券 (FNC) 到期追蹤',
    fncSectionDesc: '掌握過期倒數（IHG 住宿券已升級為 50,000 點上限！）。',
    addFncBtn: '新增住宿券',
    daysLeft: '天後到期',
    expired: '已過期',
    markRedeemed: '標記已兌換',
    markUnused: '標為未使用',
    
    // Advisor
    advisorHeading: '「這筆消費刷哪張？」最佳決策推薦',
    advisorSubheading: '選擇消費類別，系統將自動比對 12 張卡的最高點數倍率與保險權益。',
    catDining: '餐廳與外送',
    catFlights: '機票預訂',
    catHotels: '飯店住宿',
    catOffice: '辦公文具與電信',
    catGrocery: '超市生鮮採買',
    catGas: '加油與電車充電 (3x)',
    catForeign: '海外實體 / 免手續費',
    catCatchall: '一般日常消費 (萬用 2x)',
    
    // Modals
    modalAddFnc: '新增免費住宿券 (FNC)',
    modalEditFnc: '編輯住宿券',
    settingsTitle: '設定與資料管理',
    paletteLabel: '莫蘭迪風格色盤',
    backupLabel: '本機 JSON 備份與還原',
    backupDesc: 'CardFlow 具備 100% 隱私性與本機端儲存。匯出 JSON 備份檔即可隨時轉移至其他裝置。',
    exportJson: '匯出 JSON 備份',
    importJson: '匯入 JSON 還原',
    resetFactory: '⚠️ 清除所有資料並重設為初始狀態',
    
    // Credits Item Status
    claimedThisMonth: '本月已折抵',
    readyToClaim: '本月待折抵',
    saveCert: '儲存住宿券',
    cancel: '取消',
    certName: '住宿券名稱',
    program: '常客計畫',
    capValue: '最高折抵點數',
    expireDate: '到期日期',

    // Card details
    metalBadge: '金屬卡',
    noFtfBadge: '免海外手續費',
    annualFeeLabel: '年費',
    noAnnualFeeLabel: '免年費 $0',
    cardsSearchPlaceholder: '搜尋卡片名稱、回饋倍率、權益...',
    renewMonthLabel: '續卡月份',
    openedYearLabel: '持卡自',
    signupBonusLabel: '開卡禮回饋',
    useForLabel: '最佳使用場景 (Use for)',
    noFtfLabel: '免海外手續費 (0%)',
    ftfFeeLabel: '海外手續費',

    // Card Ownership & Batch Selection
    cardOwned: '已持有',
    cardNotOwned: '未持有',
    filterAllCards: '全部',
    filterOwned: '已持有',
    filterUnowned: '未持有',
    noOwnedCardsTitle: '目前尚未新增任何已持有卡片',
    noOwnedCardsDesc: '點擊下方「快速勾選持卡」自選您的皮夾卡片，或切換至「全部」瀏覽 12 張美卡庫。',
    btnBrowseAllCards: '瀏覽全部卡庫 (12) →',
    manageCardsBtnLabel: '快速勾選持卡',
    manageCardsModalTitle: '自選持有的信用卡清單',
    manageCardsModalSub: '勾選您目前擁有的卡片，折抵進度與圓餅圖將自動即時重算。',
    donutNoCredits: '目前持有的卡片無年度折抵項目',
    donutNoCreditsSub: '無折抵項目',
    donutCenterPct: '佔比',
    cardsCountBadgeSuffix: '張已持有',
    noCreditsDue: '目前持有的卡片本期無折抵項目',
    noCreditsDueSub: '可至「卡片庫」分頁自選或啟用您持有的卡片',

    // Google Drive
    gdriveSectionTitle: 'Google Drive 雲端備份與同步',
    gdriveStatusDisconnected: '未連線',
    gdriveStatusConnected: '已連線',
    gdriveSectionDesc: '透過 Google Drive 官方 API 將卡片與折抵進度安全儲存在個人雲端硬碟，支援多裝置跨端同步。',
    gdriveClientIdLabel: 'Google OAuth Client ID',
    gdriveSaveClientIdBtn: '儲存',
    gdriveHelpBtn: '如何取得？',
    gdriveBackupLabel: '立即備份至 Drive',
    gdriveRestoreLabel: '自 Drive 雲端還原',
    gdriveAutoSyncLabel: '變更時自動同步至 Drive',
    gdriveLastSyncLabel: '尚未同步',
    gdriveToggleConfig: 'Google Client ID 設定',
    gdriveSignoutBtn: '登出 Google 帳號',
    gdriveHelpTitle: 'Google Drive 同步設定說明',
    confirmGdriveHelpBtn: '我知道了',
    gdriveBackupSuccess: '成功備份至 Google Drive！',
    gdriveRestoreSuccess: '成功自 Google Drive 還原卡片與折抵資料！',
    gdriveNoClientIdPrompt: '請先輸入 Google OAuth Client ID。',
    gdriveNoBackupFound: '在您的 Google Drive 中未找到 cardflow_backup.json 備份檔案。',

    // PWA Auto Update
    pwaUpdateText: '發現新版本！點擊立即載入最新功能',
    pwaUpdateBtn: '立即更新',

    // Onboarding & Default Unowned State
    balanceNoCards: '尚無持卡',
    onboardingTitle: '開始打造您的美卡專屬福利庫',
    onboardingDesc: '從 12 張頂級美卡庫中勾選您目前持有的卡片，CardFlow 將自動為您計算每月報銷、解鎖常客會籍並追蹤房券效期。',
    btnSelectCards: '挑選我持有的卡片',
    btnLoadDemoPack: '載入示範卡包 (CSP + CFU + 萬豪)',
    btnDemoPack: '⚡ 示範卡包',
    onboardingFeature1: '100% 本機儲存',
    onboardingFeature2: '零後端隱私保護',
    onboardingFeature3: '可選 Google Drive 備份',
    bannerTagEmpty: '💡 快速上手',
    bannerTextEmpty: '尚未加入持有卡片。請點選「挑選我持有的卡片」以開始追蹤專屬福利與到期提醒。',
    bannerTagActive: '張卡片追蹤中',
    bannerTextActivePrefix: '已為您彙整',
    bannerTextActiveSuffix: '張持卡之折抵額度與權益。所有資料安全存於本機。',
    toastDemoLoaded: '已為您載入熱門示範卡包 (CSP + CFU + 萬豪大白金)！',

    // Card Membership Dates & Renewal Settings
    cardDateModalTitle: '設定持卡時間 (選填)',
    cardDateYearLabel: '持卡年份 / Opening Year (選填)',
    cardDateMonthLabel: '開卡月份 / Opening Month (選填)',
    cardDateRenewLabel: '年費續卡月份 / Renewal Month (選填)',
    cardDateYearSelectDefault: '未設定 (選填)',
    cardDateMonthSelectDefault: '未設定 (選填)',
    cardDateRenewSelectDefault: '自動與開卡月相同 (預設)',
    cardDateRenewNoAf: '免年費卡 ($0 AF)',
    cardDateHintTitle: '智慧週期與房券自動推算',
    cardDateHintDesc: '設定開卡年月後，系統將自動推算酒店免費住宿券 (FNC) 發放與到期日、週年制旅行折抵重置時間（如 CSP $50、VX $300），並在年費出帳前提醒評估化緣 (Retention Offer) 或轉卡。',
    btnClear: '清除設定',
    btnCancel: '取消',
    btnSave: '儲存設定',
    btnSetDates: '設定開卡年月 (選填)',
    btnEditDates: '編輯持卡日期',
    toastDateSaved: '持卡日期已儲存。',
    toastDateCleared: '已清除持卡日期。',
    renewDueThisMonth: '年費本月出帳',
    renewDueNextMonth: '年費下月出帳',
    retentionReminder: '建議致電客服化緣 (Retention Offer) 或評估轉卡',
    monthUnit: '月',

    // Free Night Awards (FNC)
    fncAutoDerived: '依開卡月自動推算',
    fncNoCertificates: '目前尚無生效之年度免費住宿券',
    fncNoCertificatesSub: '在「我的卡片」啟用萬豪 Brilliant (85k) 或 IHG Premier (50k) 並填寫開卡年月，系統將自動推算每年房券入帳與到期日；您也可以點擊右上角手動新增房券。',

    // Chase 5/24 Tracker
    chase524Title: 'Chase 5/24 申請狀態追蹤',
    chase524Desc: '統計過去 24 個月開立之個人卡數量。Chase 通常會自動拒絕 24 個月內開卡已達 5 張的申請人。',
    chase524Safe: '安全綠燈',
    chase524Warning: '已達上限',
    chase524Unset: '尚未設定個人卡片開卡日期。可在「我的卡片」設定開卡年月，系統將自動計算 5/24 額度！',
    chase524SafeDesc: '過去 24 個月開立 {n} 張個人卡，距離 5/24 上限尚有 {rem} 張額度，可繼續申辦 Chase 信用卡。',
    chase524WarningDesc: '過去 24 個月開立 {n} 張個人卡，已觸發 Chase 5/24 限制。建議等候卡片屆滿 24 個月出 5/24 後再申請。',
    monthsUntilDrop: '個月後出 5/24',
    anniversaryResetPrefix: '每年',
    anniversaryResetSuffix: '月週年重置',

    // Card Advisor & Ownership Awareness
    advisorSubheadingEmpty: '選擇消費類別，系統將自動比對全卡庫最佳點數倍率與保險權益（尚未設定持有卡片）。',
    advisorSubheadingOwned: '根據您目前持有的 {n} 張卡片，為您推薦皮夾中最佳刷卡策略與權益。',
    advisorWalletPick: '👑 您的皮夾首選推薦',
    advisorNoOwnedInCat: '您的皮夾中尚無此類別的特化高倍率卡。建議刷日常萬用卡（如 2x / 1.5x 卡），或參考下方全卡庫推薦搭配：',
    advisorNoCardsBannerTitle: '目前尚未選取持有的卡片',
    advisorNoCardsBannerDesc: '自選您擁有的信用卡即可獲得專屬的皮夾刷卡決策建議；下方目前展示全卡庫 12 張卡之完整配置指南。',
    advisorAllLibraryGuide: '全卡庫完整配置指南',
    chase524NoPersonalCards: '目前尚未加入任何個人卡。點擊上方「快速勾選持卡」加入個人卡，即可開始追蹤 Chase 5/24。'
  }
};

// --- 3. 12 CARDS PRESET DATA (2026/2027 LATEST & PERSONAL TRACKER) ---
const PRESET_CARDS = [
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
      { title: { en: 'Monthly $25 Dining Credit', 'zh-TW': '每月 $25 全球餐廳帳單折抵' }, note: { en: 'Up to $300/yr worldwide restaurants statement credit', 'zh-TW': '每年最高折抵 $300 美元，全球餐廳皆適用' } },
      { title: { en: 'Annual 85k Free Night Award', 'zh-TW': '年度 85,000 分免費住宿券 (FNC)' }, note: { en: 'Can be topped off with up to 15,000 points', 'zh-TW': '可再自補最高 15,000 點，兌換高達 10 萬點奢華飯店' } },
      { title: { en: 'Marriott Platinum Elite Status', 'zh-TW': '自動享有萬豪白金會籍 (Platinum)' }, note: { en: 'Complimentary breakfast, lounge access & 4pm checkout', 'zh-TW': '保證雙人免費早餐、行政酒廊禮遇、下午 4 點延遲退房' } },
      { title: { en: '25 Elite Night Credits', 'zh-TW': '每年贈送 25 晚尊貴會籍房晚 (ENC)' }, note: { en: 'Direct boost towards Titanium/Ambassador', 'zh-TW': '極大幅降低衝擊鈦金／大使會籍的門檻' } },
      { title: { en: '$100 Luxury Property Credit', 'zh-TW': '$100 麗思卡爾頓與瑞吉消費額度' }, note: { en: '$100 property credit on 2+ consecutive nights at Ritz-Carlton or St. Regis', 'zh-TW': '連續入住 2 晚以上 The Ritz-Carlton 或 St. Regis 享 $100 館內消費折抵' } }
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
      { title: { en: 'Monthly $20 Flexible Business Credit', 'zh-TW': '每月 $20 彈性商業消費折抵' }, note: { en: 'Grubhub delivery, FedEx shipping, or Office Depot ($240/yr)', 'zh-TW': '適用於 Grubhub 外送、FedEx 寄件或 Office Depot 辦公用品' } },
      { title: { en: 'Monthly Walmart+ Membership Credit', 'zh-TW': '每月 Walmart+ 會費折抵 ($12.95)' }, note: { en: '$12.95/month plus tax reimbursement with Paramount+', 'zh-TW': '免運費外送並贈送 Paramount+ 影音串流會員' } }
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
      { title: { en: 'NEW: $600 Prepaid Hotel Credit (FHR/THC)', 'zh-TW': '新增: $600 頂級預付飯店折抵 (FHR/THC)' }, note: { en: '$300 semi-annually (Jan-Jun & Jul-Dec) via Amex Travel', 'zh-TW': '每半年 $300 (1-6月與 7-12月)，可訂五星級飯店享受免費雙人早餐與升等' } },
      { title: { en: '$200 Annual Airline Incidental Credit', 'zh-TW': '年度指定航空公司附加費折抵 ($200)' }, note: { en: 'Checked bags, seat selection, lounge day passes', 'zh-TW': '指定 1 家美籍航空，折抵行李、選位或貴賓室單日券' } },
      { title: { en: '$150 Annual Dell Credit (Calendar Year)', 'zh-TW': 'Dell 科技硬體採購折抵 ($150/年)' }, note: { en: 'Standard $150 credit, plus $1,000 bonus if spending $5,000+', 'zh-TW': '改版為日曆年標準 $150 折抵，滿 5,000 美元再獲 $1,000 加碼' } },
      { title: { en: '$120 Annual Wireless Credit ($10/mo)', 'zh-TW': '每月 $10 電信通訊話費折抵' }, note: { en: 'Direct mobile phone statement credits ($120/yr)', 'zh-TW': '繳納美國主要電信話費，全年累計折抵 $120' } },
      { title: { en: '$189 CLEAR Plus Credit', 'zh-TW': 'CLEAR® Plus 機場快速安檢身分驗證' }, note: { en: 'Fast-track airport security lines', 'zh-TW': '全額補助年費，免排隊光速通過美國主要機場安檢查驗' } },
      { title: { en: '35% Pay with Points Flight Rebate', 'zh-TW': '點數開機票 35% 返還特權' }, note: { en: 'Selected airline or first/business class (min 5k pts)', 'zh-TW': '經由 AmexTravel 購票享 35% 點數回贈 (1pt 價值高達 1.54 美分)' } },
      { title: { en: 'Hilton Gold, Marriott Gold & Leaders Club', 'zh-TW': '自動享有希爾頓金卡、萬豪金卡與 Leaders Club' }, note: { en: 'Complimentary breakfast/F&B credits, room upgrades', 'zh-TW': '享有免費早餐／餐飲折抵金與獨立奢華飯店升等特權' } }
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
      { title: { en: '$300 Annual C1 Travel Credit', 'zh-TW': '每年 $300 Capital One Travel 旅遊折抵' }, note: { en: 'Seamless discount on flights, hotels & cars', 'zh-TW': '直接折抵機票、飯店或租車費用，輕鬆抵銷大部分年費' } },
      { title: { en: '10,000 Anniversary Miles ($100+)', 'zh-TW': '每年續卡贈送 10,000 哩程' }, note: { en: 'Awarded every year starting at renewal', 'zh-TW': '價值至少 $100 美元，開卡第二年起每年自動入帳' } },
      { title: { en: 'Cardholder Lounge Access (2026 Policy)', 'zh-TW': '主卡人貴賓室權益 (2026 最新規定)' }, note: { en: 'C1 Lounges & Priority Pass for primary; guest access now $45/visit unless spend $75k+', 'zh-TW': '主卡人仍享無限次免費進入；2026年起攜伴調整為每位 $45 (年刷滿 7.5 萬免收)' } },
      { title: { en: 'Hertz President’s Circle Status', 'zh-TW': 'Hertz President’s Circle 頂級租車會籍' }, note: { en: 'Vehicle upgrades & guaranteed choices', 'zh-TW': '可直接至專屬車位自選升等豪華車款' } }
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
      { title: { en: 'Monthly $10 DoorDash Non-Restaurant Credit', 'zh-TW': '每月 $10 DoorDash 生鮮便利超商折抵' }, note: { en: '$10/mo grocery/convenience promo code through Dec 31, 2029 ($120/yr value)', 'zh-TW': '每月提供 $10 折抵券用於便利商店、生鮮雜貨，效期至 2029/12/31（每年省 $120）' } },
      { title: { en: 'UPGRADED: $100 Annual Hotel Credit', 'zh-TW': '翻倍升級: $100 Chase Travel 飯店折抵' }, note: { en: 'Doubled from $50 to $100 per cardmember year', 'zh-TW': '飯店折抵由原先 $50 翻倍至 $100，直接抵銷整張卡片年費' } },
      { title: { en: 'NEW: $120 Global Entry / TSA PreCheck Credit', 'zh-TW': '新增: $120 機場快速通關申請費折抵' }, note: { en: 'Up to $120 credit every 4 years for Global Entry/NEXUS', 'zh-TW': '每 4 年提供高達 $120 美元，全額補助 Global Entry 或 TSA 費用' } },
      { title: { en: 'Transfer Partner Hub', 'zh-TW': '解鎖航空與飯店轉點樞紐' }, note: { en: 'Transfer to United, Aeroplan, Flying Blue, and Hyatt (4:3)', 'zh-TW': '可將 Ink Cash、CFU 的點數集中轉點，發揮最大商務艙價值' } },
      { title: { en: 'Primary Car Rental CDW', 'zh-TW': '租車頂級 Primary 車碰險' }, note: { en: 'Top-tier comprehensive collision damage waiver', 'zh-TW': '出險免先動用個人汽車保險，在美租車最省心首選' } }
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
      { title: { en: 'UPGRADED: 50,000 pt Free Night Award', 'zh-TW': '升級: 50,000 分免費住宿券 (原 40k)' }, note: { en: 'Anniversary FNC increased to 50k points + points top-off', 'zh-TW': '房券點數上限由 40k 提升至 50k 點，可兌換更高階洲際酒店' } },
      { title: { en: 'NEW: $100 Annual Food & Beverage Credit', 'zh-TW': '新增: $100 飯店餐飲折抵 ($25/季)' }, note: { en: '$25 per calendar quarter for dining at IHG properties', 'zh-TW': '每季 $25 美元餐飲消費折抵，入住或在旗下餐廳用餐直接扣抵' } },
      { title: { en: 'NEW: $100 Annual Airline Statement Credit', 'zh-TW': '新增: $100 航空公司購票折抵' }, note: { en: '$100 back on $250+ qualifying direct airline bookings', 'zh-TW': '購買單筆 $250 以上機票，享 $100 帳單直接折抵' } },
      { title: { en: '4th Night Free on Award Stays', 'zh-TW': '點數換房住四晚免一晚 (住四免一)' }, note: { en: 'Redeem 3 nights, 4th night costs 0 points', 'zh-TW': '兌換連續 4 晚僅需支付 3 晚點數，長期度假極划算' } },
      { title: { en: '$50 United TravelBank Cash ($25 H1, $25 H2)', 'zh-TW': '每年 $50 聯合航空 TravelBank 購票金' }, note: { en: 'Direct discount on United flights', 'zh-TW': '每年 1 月與 7 月各入帳 $25，買美聯航機票現抵' } },
      { title: { en: 'Elite Status (Platinum through 2027)', 'zh-TW': '精英會籍 (持卡人享白金待遇至 2027 底)' }, note: { en: 'Existing holders grandfathered in Platinum through 2027', 'zh-TW': '現有持卡人至 2027 年底前維持白金權益（房型升等與加成）' } }
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
const PRESET_CREDITS = [
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

// --- Category Metadata for Donut Chart ---
const CREDIT_CATEGORY_META = {
  travel: { name: { en: 'Hotels & Portals', 'zh-TW': '飯店與旅遊折抵' }, color: '#4EB896' },
  dining: { name: { en: 'Dining & Food', 'zh-TW': '餐廳外送與餐飲' }, color: '#F47B89' },
  airline: { name: { en: 'Airlines & TravelBank', 'zh-TW': '航空與機票折抵' }, color: '#5A9FE6' },
  office: { name: { en: 'Business & Office', 'zh-TW': '商業採購與徵才' }, color: '#F7C343' },
  tech: { name: { en: 'Technology & Hardware', 'zh-TW': '科技硬體採購' }, color: '#8B7EB8' },
  telecom: { name: { en: 'Wireless & Telecom', 'zh-TW': '電信通訊話費' }, color: '#48B5C4' },
  subs: { name: { en: 'Memberships & Streaming', 'zh-TW': '影音與生活會員' }, color: '#E07A5F' }
};

// SVG Arc Math Helpers (PocketFlow algorithm)
function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = angleInDegrees * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
}

function describeDonutArc(cx, cy, r_in, r_out, startAngle, endAngle) {
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

// --- 5. INITIAL STATE & PERSISTENCE ---
let currentLang = localStorage.getItem(LANG_KEY) || 'zh-TW';
let currentTheme = localStorage.getItem(THEME_KEY) || 'light';
let currentPalette = localStorage.getItem(PALETTE_KEY) || 'sage';

const today = new Date();
let selectedYear = today.getFullYear();
let selectedMonth = today.getMonth() + 1; // 1-12

let appState = {
  ownedCards: {}, // cardId: boolean (default false: cards are unowned until user selects)
  cardMeta: {},   // cardId: { openedYear: null, openedMonth: null, renewMonth: null }
  creditsClaimed: {},
  fncs: [],
  fncsClaimed: {}
};

function loadState() {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appState = Object.assign(appState, parsed);
    } catch (e) {
      console.error('Failed to parse appState:', e);
    }
  }
  if (!appState.ownedCards || typeof appState.ownedCards !== 'object') {
    appState.ownedCards = {};
  }
  if (!appState.cardMeta || typeof appState.cardMeta !== 'object') {
    appState.cardMeta = {};
  }
  if (!Array.isArray(appState.fncs)) {
    appState.fncs = [];
  }
  if (!appState.fncsClaimed || typeof appState.fncsClaimed !== 'object') {
    appState.fncsClaimed = {};
  }
}

function saveState(skipAutoSync = false) {
  if (!appState.ownedCards || typeof appState.ownedCards !== 'object') appState.ownedCards = {};
  if (!appState.cardMeta || typeof appState.cardMeta !== 'object') appState.cardMeta = {};
  if (!Array.isArray(appState.fncs)) appState.fncs = [];
  if (!appState.fncsClaimed || typeof appState.fncsClaimed !== 'object') appState.fncsClaimed = {};
  localStorage.setItem(STATE_KEY, JSON.stringify(appState));
  if (!skipAutoSync) {
    handleDriveAutoSync();
  }
}

// Card Ownership Helper Functions
function isCardOwned(cardId) {
  if (!appState.ownedCards) return false;
  return !!appState.ownedCards[cardId];
}

function setCardOwnership(cardId, isOwned) {
  if (!appState.ownedCards) {
    appState.ownedCards = {};
  }
  appState.ownedCards[cardId] = !!isOwned;
  saveState();
  renderAllViews();
}

function toggleCardOwnership(cardId) {
  setCardOwnership(cardId, !isCardOwned(cardId));
}

function selectAllCards(owned) {
  if (!appState.ownedCards) appState.ownedCards = {};
  PRESET_CARDS.forEach(c => {
    appState.ownedCards[c.id] = owned;
  });
  saveState();
  renderAllViews();
}

function loadDemoStarterPack() {
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

function showToast(message) {
  const toast = document.getElementById('toast-message');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.remove('opacity-0');
  if (typeof setTimeout === 'function') {
    setTimeout(() => {
      toast.classList.add('opacity-0');
    }, 2500);
  }
}

function updateBannerText() {
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

// Card Date Modal Logic
let activeCardDateId = null;

function openCardDateModal(cardId) {
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

  modal.classList.remove('hidden');
}

function closeCardDateModal() {
  const modal = document.getElementById('card-date-modal');
  if (modal) modal.classList.add('hidden');
  activeCardDateId = null;
}

function saveCardDate() {
  if (!activeCardDateId) return;
  if (!appState.cardMeta) appState.cardMeta = {};

  const yearVal = document.getElementById('card-date-year-select')?.value;
  const monthVal = document.getElementById('card-date-month-select')?.value;
  const renewVal = document.getElementById('card-date-renew-select')?.value;

  const openedYear = yearVal ? parseInt(yearVal, 10) : null;
  const openedMonth = monthVal ? parseInt(monthVal, 10) : null;
  let renewMonth = null;
  if (renewVal !== '') {
    renewMonth = renewVal === '0' ? 'No AF' : parseInt(renewVal, 10);
  }

  appState.cardMeta[activeCardDateId] = {
    openedYear,
    openedMonth,
    renewMonth
  };

  if (!appState.ownedCards) appState.ownedCards = {};
  appState.ownedCards[activeCardDateId] = true;

  saveState();
  closeCardDateModal();
  renderAllViews();
  showToast(t('toastDateSaved'));
}

function clearCardDate() {
  if (!activeCardDateId) return;
  if (appState.cardMeta && appState.cardMeta[activeCardDateId]) {
    delete appState.cardMeta[activeCardDateId];
    saveState();
  }
  closeCardDateModal();
  renderAllViews();
  showToast(t('toastDateCleared'));
}

function renderAllViews() {
  renderCredits();
  renderCards();
  renderFncs();
  renderDonutChart();
  renderLoyaltyStatusCards();
  renderChase524();
  selectAdvisorCategory(currentAdvisorCat);
  renderManageCardsChecklist();
  updateBannerText();
}

function openManageCardsModal() {
  const modal = document.getElementById('manage-cards-modal');
  if (modal) {
    renderManageCardsChecklist();
    modal.classList.remove('hidden');
  }
}

function closeManageCardsModal() {
  const modal = document.getElementById('manage-cards-modal');
  if (modal) modal.classList.add('hidden');
}

function openAnnualBreakdownModal() {
  const modal = document.getElementById('annual-breakdown-modal');
  if (modal) {
    renderAnnualBreakdownModal();
    modal.classList.remove('hidden');
  }
}

function closeAnnualBreakdownModal() {
  const modal = document.getElementById('annual-breakdown-modal');
  if (modal) modal.classList.add('hidden');
}

function switchPeriodFromModal(p) {
  closeAnnualBreakdownModal();
  setPeriodFilter(p);
  const feed = document.getElementById('credits-feed-container');
  if (feed) {
    feed.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderAnnualBreakdownModal() {
  const container = document.getElementById('annual-breakdown-content');
  const totalAmountEl = document.getElementById('annual-modal-total-amount');
  const cardsCountEl = document.getElementById('annual-modal-cards-count');
  if (!container) return;

  const ownedCredits = PRESET_CREDITS.filter(item => isCardOwned(item.cardId));
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
      filterTarget: 'semiannual'
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

  container.innerHTML = sections.map(sec => {
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
      <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
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

function renderManageCardsChecklist() {
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
      <div onclick="toggleCardOwnership('${card.id}')"
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
function updateThemeColor(theme) {
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

function applyTheme(theme) {
  currentTheme = theme;
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

function applyPalette(palKey) {
  const pal = MORANDI_PALETTES[palKey] || MORANDI_PALETTES.sage;
  currentPalette = pal.id;
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

function renderPalettePicker() {
  const container = document.getElementById('palettes-picker-container');
  if (!container) return;
  container.innerHTML = '';

  Object.values(MORANDI_PALETTES).forEach(p => {
    const isSel = p.id === currentPalette;
    const btn = document.createElement('button');
    btn.className = `palette-btn p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${isSel ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`;
    btn.onclick = () => applyPalette(p.id);
    btn.innerHTML = `
      <span class="w-5 h-5 rounded-full shadow-xs" style="background-color: ${p.primary}"></span>
      <span class="text-[11px] font-bold text-slate-700 dark:text-slate-200">${p.name[currentLang] || p.name['zh-TW']}</span>
    `;
    container.appendChild(btn);
  });
}

// --- 7. BILINGUAL TRANSLATION (i18n) ---
function t(key) {
  const dict = I18N[currentLang] || I18N['zh-TW'];
  return dict[key] || I18N['zh-TW'][key] || I18N.en[key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

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
    'period-semiannual-btn': 'periodSemiAnnual',
    'fnc-section-title': 'fncSectionTitle',
    'fnc-section-desc': 'fncSectionDesc',
    'add-fnc-btn-label': 'addFncBtn',
    'advisor-heading': 'advisorHeading',
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
    'confirm-annual-modal-btn': 'annualModalCloseBtn'
  };

  Object.entries(map).forEach(([id, i18nKey]) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerText = t(i18nKey);
    }
  });

  const searchInput = document.getElementById('cards-search-input');
  if (searchInput) searchInput.placeholder = t('cardsSearchPlaceholder');

  renderAllViews();
  renderPalettePicker();
  renderTransferCheatSheet();
  updateDriveUI();
}

// --- 8. MONTH CALCULATIONS & HELPERS ---
function getMonthKey() {
  return `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
}

// --- 9. RENDER DUE CREDITS ---
let currentPeriodFilter = 'all';

function setPeriodFilter(p) {
  currentPeriodFilter = p;
  document.querySelectorAll('.period-filter-btn').forEach(b => {
    b.className = 'period-filter-btn px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 shrink-0 cursor-pointer';
  });
  const btn = document.getElementById(`period-${p}-btn`);
  if (btn) {
    btn.className = 'period-filter-btn px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-xs shrink-0 cursor-pointer';
  }
  renderCredits();
}

function renderCredits() {
  const container = document.getElementById('credits-feed-container');
  if (!container) return;
  container.innerHTML = '';

  const mKey = getMonthKey();
  let monthlyUnclaimed = 0;
  let monthlyClaimedCount = 0;
  let totalMonthlyItems = 0;

  // Filter credits to owned cards only
  const ownedCredits = PRESET_CREDITS.filter(item => isCardOwned(item.cardId));

  const items = ownedCredits.filter(item => {
    if (currentPeriodFilter === 'all') return true;
    if (currentPeriodFilter === 'monthly') return item.period === 'monthly';
    if (currentPeriodFilter === 'semiannual') return item.period === 'semiannual' || item.period === 'quarterly';
    if (currentPeriodFilter === 'annual') return item.period === 'annual';
    return true;
  });

  // Calculate monthly stats from all owned monthly credits
  ownedCredits.forEach(item => {
    if (item.period === 'monthly') {
      totalMonthlyItems++;
      const stateKey = `${item.id}_${mKey}`;
      const isClaimed = !!appState.creditsClaimed[stateKey];
      if (isClaimed) {
        monthlyClaimedCount++;
      } else {
        monthlyUnclaimed += item.amount;
      }
    }
  });

  const ownedCount = PRESET_CARDS.filter(c => isCardOwned(c.id)).length;

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
          <button onclick="loadDemoStarterPack()" class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
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
  } else if (items.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <div class="text-3xl mb-2">💳</div>
        <div class="text-xs font-bold text-slate-700 dark:text-slate-200">${t('noCreditsDue')}</div>
        <div class="text-[11px] text-slate-400 mt-1">${t('noCreditsDueSub')}</div>
      </div>
    `;
  } else {
    items.forEach(item => {
      let stateKey = '';
      if (item.period === 'monthly') {
        stateKey = `${item.id}_${mKey}`;
      } else if (item.period === 'semiannual') {
        const half = selectedMonth <= 6 ? 'H1' : 'H2';
        stateKey = `${item.id}_${selectedYear}_${half}`;
      } else if (item.period === 'quarterly') {
        const q = Math.ceil(selectedMonth / 3);
        stateKey = `${item.id}_${selectedYear}_Q${q}`;
      } else {
        stateKey = `${item.id}_${selectedYear}`;
      }

      const isClaimed = !!appState.creditsClaimed[stateKey];
      const titleText = typeof item.title === 'object' ? (item.title[currentLang] || item.title['zh-TW']) : item.title;
      const cardText = typeof item.card === 'object' ? (item.card[currentLang] || item.card['zh-TW']) : item.card;
      const tipText = typeof item.tip === 'object' ? (item.tip[currentLang] || item.tip['zh-TW']) : item.tip;

      const cardMeta = appState.cardMeta?.[item.cardId];
      let cycleNoteHtml = '';
      if (item.period === 'annual' && cardMeta && cardMeta.openedMonth) {
        cycleNoteHtml = `<span class="px-1.5 py-0.5 rounded-md text-[9.5px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 shrink-0">📅 ${t('anniversaryResetPrefix')} ${cardMeta.openedMonth} ${t('anniversaryResetSuffix')}</span>`;
      }

      const cardEl = document.createElement('div');
      cardEl.className = `p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${isClaimed ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60' : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800'}`;
      
      cardEl.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <button onclick="toggleCreditClaim('${stateKey}')" class="w-6 h-6 rounded-xl border flex items-center justify-center transition shrink-0 ${isClaimed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-500'}">
            ${isClaimed ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
          </button>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 ${isClaimed ? 'line-through text-slate-400 dark:text-slate-500' : ''}">${titleText}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">${cardText}</span>
              ${cycleNoteHtml}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5 truncate">${tipText}</div>
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="text-xs sm:text-sm font-extrabold ${isClaimed ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'}">+$${item.amount.toFixed(2)}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${isClaimed ? t('claimedThisMonth') : t('readyToClaim')}</div>
        </div>
      `;
      container.appendChild(cardEl);
    });
  }

  // Update Hero Card Metrics
  const valEl = document.getElementById('monthly-remaining-val');
  if (valEl) valEl.innerText = monthlyUnclaimed.toFixed(2);

  const dueLabel = document.getElementById('monthly-due-label');
  if (dueLabel) dueLabel.innerText = t('monthlyDueLabel');

  const ratioEl = document.getElementById('monthly-claimed-ratio');
  if (ratioEl) ratioEl.innerText = `${monthlyClaimedCount} / ${totalMonthlyItems || 0}`;

  const unitLabel = document.getElementById('monthly-unit-label');
  if (unitLabel) unitLabel.innerText = t('usedUnit');

  // Dynamic annual total value & breakdowns from all owned credits
  const monthlyCredits = ownedCredits.filter(c => c.period === 'monthly');
  const qtrCredits = ownedCredits.filter(c => c.period === 'quarterly');
  const semiCredits = ownedCredits.filter(c => c.period === 'semiannual');
  const annualCredits = ownedCredits.filter(c => c.period === 'annual');

  const monthlyFaceSum = monthlyCredits.reduce((acc, c) => acc + c.amount, 0);
  const monthlyAnnualSum = monthlyFaceSum * 12;

  const qtrFaceSum = qtrCredits.reduce((acc, c) => acc + c.amount, 0);
  const qtrAnnualSum = qtrFaceSum * 4;

  const semiFaceSum = semiCredits.reduce((acc, c) => acc + c.amount, 0);
  const semiAnnualSum = semiFaceSum * 2;

  const periodicAnnualSum = semiAnnualSum + qtrAnnualSum;

  const annualFaceSum = annualCredits.reduce((acc, c) => acc + c.amount, 0);
  const annualTotalSum = annualFaceSum;

  const totalAnnualPerks = monthlyAnnualSum + periodicAnnualSum + annualTotalSum;

  const annualAmount = document.getElementById('annual-value-amount');
  if (annualAmount) annualAmount.innerText = Math.round(totalAnnualPerks).toLocaleString();

  const annualUnit = document.getElementById('annual-unit-label');
  if (annualUnit) annualUnit.innerText = t('perYearUnit');

  // Mini segmented bar calculation on the hero card chip
  const segMonthly = document.getElementById('bar-segment-monthly');
  const segSemi = document.getElementById('bar-segment-semi');
  const segAnnual = document.getElementById('bar-segment-annual');

  if (segMonthly && segSemi && segAnnual) {
    if (totalAnnualPerks > 0) {
      const mPct = (monthlyAnnualSum / totalAnnualPerks) * 100;
      const sPct = (periodicAnnualSum / totalAnnualPerks) * 100;
      const aPct = (annualTotalSum / totalAnnualPerks) * 100;

      segMonthly.style.width = `${mPct}%`;
      segSemi.style.width = `${sPct}%`;
      segAnnual.style.width = `${aPct}%`;

      segMonthly.title = `${t('barTitleMonthly')}: $${Math.round(monthlyAnnualSum).toLocaleString()} (${mPct.toFixed(0)}%)`;
      segSemi.title = `${t('barTitleSemi')}: $${Math.round(periodicAnnualSum).toLocaleString()} (${sPct.toFixed(0)}%)`;
      segAnnual.title = `${t('barTitleAnnual')}: $${Math.round(annualTotalSum).toLocaleString()} (${aPct.toFixed(0)}%)`;
    } else {
      segMonthly.style.width = '0%';
      segSemi.style.width = '0%';
      segAnnual.style.width = '0%';
    }
  }

  const badgeEl = document.getElementById('balance-badge');
  if (badgeEl) {
    if (ownedCount === 0) {
      badgeEl.innerText = t('balanceNoCards');
      badgeEl.className = 'px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-sm';
    } else if (totalMonthlyItems === 0 || monthlyUnclaimed === 0) {
      badgeEl.innerText = t('balanceHealthy');
      badgeEl.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-bold backdrop-blur-sm';
    } else {
      badgeEl.innerText = t('balanceAction');
      badgeEl.className = 'px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[11px] font-bold backdrop-blur-sm';
    }
  }

  const donutBadge = document.getElementById('donut-cards-count-badge');
  if (donutBadge) {
    donutBadge.innerText = `${ownedCount} / ${PRESET_CARDS.length} ${t('cardsCountBadgeSuffix')}`;
  }

  // Dynamic period filter button amounts based on owned credits
  const allFormatted = totalAnnualPerks > 0 ? `$${Math.round(totalAnnualPerks).toLocaleString()}` : '$0';
  const monthlyFaceFormatted = monthlyFaceSum > 0 ? (monthlyFaceSum % 1 === 0 ? `$${monthlyFaceSum}` : `$${monthlyFaceSum.toFixed(2)}`) : '$0';
  const monthlyAnnualFormatted = monthlyAnnualSum > 0 ? `$${Math.round(monthlyAnnualSum).toLocaleString()}` : '$0';
  const periodicAnnualFormatted = periodicAnnualSum > 0 ? `$${Math.round(periodicAnnualSum).toLocaleString()}` : '$0';
  const annualFormatted = annualTotalSum > 0 ? `$${Math.round(annualTotalSum).toLocaleString()}` : '$0';

  const allBtn = document.getElementById('period-all-btn');
  if (allBtn) {
    allBtn.innerText = `${t('periodAll')} (${allFormatted}${totalAnnualPerks > 0 ? t('perYearUnit') : ''})`;
  }

  const monthlyBtn = document.getElementById('period-monthly-btn');
  if (monthlyBtn) {
    if (monthlyFaceSum > 0) {
      monthlyBtn.innerText = currentLang === 'zh-TW'
        ? `${t('periodMonthly')} (${monthlyFaceFormatted}/月 · 年${monthlyAnnualFormatted})`
        : `${t('periodMonthly')} (${monthlyFaceFormatted}/mo · ${monthlyAnnualFormatted}/yr)`;
    } else {
      monthlyBtn.innerText = `${t('periodMonthly')} ($0)`;
    }
  }

  const semiBtn = document.getElementById('period-semiannual-btn');
  if (semiBtn) {
    if (periodicAnnualSum > 0) {
      semiBtn.innerText = currentLang === 'zh-TW'
        ? `${t('periodSemiAnnual')} (年${periodicAnnualFormatted})`
        : `${t('periodSemiAnnual')} (${periodicAnnualFormatted}/yr)`;
    } else {
      semiBtn.innerText = `${t('periodSemiAnnual')} ($0)`;
    }
  }

  const annualBtn = document.getElementById('period-annual-btn');
  if (annualBtn) {
    if (annualTotalSum > 0) {
      annualBtn.innerText = `${t('periodAnnual')} (${annualFormatted}${t('perYearUnit')})`;
    } else {
      annualBtn.innerText = `${t('periodAnnual')} ($0)`;
    }
  }

  const countLabel = document.getElementById('credits-count-label');
  if (countLabel) {
    if (currentPeriodFilter === 'monthly') {
      countLabel.innerText = `${items.length} ${t('itemsUnit')} · ${monthlyFaceFormatted}${currentLang === 'zh-TW' ? '/月 (年折抵 ' : '/mo ('}${monthlyAnnualFormatted}${currentLang === 'zh-TW' ? ')' : '/yr)'}`;
    } else if (currentPeriodFilter === 'semiannual') {
      countLabel.innerText = `${items.length} ${t('itemsUnit')} · ${currentLang === 'zh-TW' ? '年折抵 ' : 'Yearly '}${periodicAnnualFormatted}${currentLang === 'zh-TW' ? '' : '/yr'}`;
    } else if (currentPeriodFilter === 'annual') {
      countLabel.innerText = `${items.length} ${t('itemsUnit')} · ${currentLang === 'zh-TW' ? '年折抵 ' : 'Yearly '}${annualFormatted}${currentLang === 'zh-TW' ? '' : '/yr'}`;
    } else {
      countLabel.innerText = `${items.length} ${t('itemsUnit')} · ${currentLang === 'zh-TW' ? '全年解鎖 ' : 'Annual '}${allFormatted}${currentLang === 'zh-TW' ? '' : '/yr'}`;
    }
  }
}

function toggleCreditClaim(key) {
  appState.creditsClaimed[key] = !appState.creditsClaimed[key];
  saveState();
  renderCredits();
}

function resetCurrentMonth() {
  if (confirm(currentLang === 'zh-TW' ? '確定要重置本月份的所有折抵狀態嗎？' : 'Reset all claimed credits for the active month?')) {
    const mKey = getMonthKey();
    Object.keys(appState.creditsClaimed).forEach(k => {
      if (k.includes(mKey)) delete appState.creditsClaimed[k];
    });
    saveState();
    renderCredits();
  }
}

// --- 10. RENDER CARDS GRID ---
let currentIssuerFilter = 'all';
let currentOwnershipFilter = 'owned'; // 'owned' by default for intuitive wallet view, or 'all', 'unowned'

function setOwnershipFilter(mode) {
  currentOwnershipFilter = mode;
  renderCards();
}

function renderCards() {
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
            <button onclick="loadDemoStarterPack()" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-750 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
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
    const openedYearVal = meta?.openedYear || card.openedYear || null;

    let renewalAlertHtml = '';
    const curM = today.getMonth() + 1;
    const numRenewM = (meta && meta.renewMonth && meta.renewMonth !== 'No AF') ? Number(meta.renewMonth) : (meta?.openedMonth ? Number(meta.openedMonth) : null);
    if (isOwned && card.annualFee > 0 && numRenewM) {
      if (numRenewM === curM) {
        renewalAlertHtml = `
          <div class="mt-2 px-2.5 py-1.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/50 text-[10.5px] text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
            <span>⏳</span>
            <span><strong>${t('renewDueThisMonth')}:</strong> $${card.annualFee} · ${t('retentionReminder')}</span>
          </div>
        `;
      } else if (numRenewM === (curM % 12) + 1) {
        renewalAlertHtml = `
          <div class="mt-2 px-2.5 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 text-[10.5px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <span>⏳</span>
            <span><strong>${t('renewDueNextMonth')}:</strong> $${card.annualFee}</span>
          </div>
        `;
      }
    }

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
      return `
        <li class="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1">
          <span class="text-indigo-500 font-bold">·</span>
          <span><strong>${title}</strong>: ${note}</span>
        </li>
      `;
    }).join('');

    const issuerBg = card.issuer === 'Amex' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/40' :
                     card.issuer === 'Chase' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/40' :
                     'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';

    const ftfBadge = card.noFtf
      ? `<span class="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">${t('noFtfLabel')}</span>`
      : `<span class="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">⚠️ ${t('ftfFeeLabel')} ${card.ftfRate}</span>`;

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

    el.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${issuerBg} border">
              ${card.issuer}
            </span>
            ${card.metal ? `<span class="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">${t('metalBadge')}</span>` : ''}
            ${ftfBadge}
          </div>

          <button onclick="toggleCardOwnership('${card.id}')"
                  class="px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs ${isOwned ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300'}">
            ${isOwned ? '<span>✓</span> <span>' + t('cardOwned') + '</span>' : '<span>+</span> <span>' + t('cardNotOwned') + '</span>'}
          </button>
        </div>

        <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">${card.name}</h4>
        <div class="text-[11px] text-slate-400 mt-0.5">${nick}</div>

        <div class="my-2.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
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
          <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
            ${renewMonth ? `<span>📅 ${t('renewMonthLabel')}: <strong class="text-slate-700 dark:text-slate-200">${renewMonth}</strong></span>` : ''}
            ${openedYearVal ? `<span class="text-slate-300 dark:text-slate-600">|</span><span>${t('openedYearLabel')} <strong class="text-slate-700 dark:text-slate-200">${openedYearVal}</strong></span>` : ''}
          </div>
        </div>

        ${renewalAlertHtml}

        ${bonusHtml}

        <div class="space-y-1 my-2.5">
          ${catList}
        </div>

        ${useForHtml}
      </div>

      <div class="pt-2 mt-3 border-t border-slate-100 dark:border-slate-800/80">
        <ul class="space-y-1">
          ${perkList}
        </ul>
      </div>
    `;
    container.appendChild(el);
  });
}

// --- 11. RENDER FNC AWARDS ---
function renderFncs() {
  const container = document.getElementById('fnc-cards-container');
  if (!container) return;
  container.innerHTML = '';

  const ownedBrilliant = isCardOwned('bonvoy-brilliant');
  const ownedIhg = isCardOwned('ihg-premier');

  // Build combined list of FNCs:
  // 1. Auto-derived from owned hotel cards
  const autoFncs = [];
  if (ownedBrilliant) {
    const meta = appState.cardMeta?.['bonvoy-brilliant'] || {};
    const renewMonth = meta.renewMonth && meta.renewMonth !== 'No AF' ? Number(meta.renewMonth) : (meta.openedMonth ? Number(meta.openedMonth) : 6);
    const annMonthStr = String(renewMonth).padStart(2, '0');
    const grantYear = selectedYear;
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
    const grantYear = selectedYear;
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

  allFncs.forEach(fnc => {
    const expDate = new Date(fnc.expireDate);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    const isUrgent = diffDays <= 60 && !fnc.used;

    const nameText = typeof fnc.name === 'object' ? (fnc.name[currentLang] || fnc.name['zh-TW']) : fnc.name;
    const grantText = fnc.grantNote ? (typeof fnc.grantNote === 'object' ? (fnc.grantNote[currentLang] || fnc.grantNote['zh-TW']) : fnc.grantNote) : null;

    const el = document.createElement('div');
    el.className = `p-3.5 rounded-2xl border transition ${fnc.used ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60' : isUrgent ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60' : 'bg-slate-50/70 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800'}`;
    
    el.innerHTML = `
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${fnc.issuer === 'Marriott' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'}">
            ${fnc.issuer}
          </span>
          ${fnc.isAuto ? `<span class="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">✨ ${t('fncAutoDerived')}</span>` : ''}
        </div>
        <span class="text-xs font-black text-amber-600 dark:text-amber-400">${fnc.points}</span>
      </div>
      <div class="text-xs font-bold text-slate-800 dark:text-slate-100 ${fnc.used ? 'line-through text-slate-400' : ''}">${nameText}</div>
      ${grantText ? `<div class="text-[10px] text-slate-400 mt-0.5">${grantText}</div>` : ''}
      <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span>${fnc.expireDate}</span>
          ${!fnc.used ? `<span class="ml-1 font-bold ${isUrgent ? 'text-amber-600 dark:text-amber-400 animate-pulse' : ''}">(${diffDays > 0 ? diffDays + ' ' + t('daysLeft') : t('expired')})</span>` : ''}
        </div>
        <button onclick="toggleFncStatus('${fnc.id}')" class="px-2 py-1 rounded-lg border text-[10px] font-bold transition ${fnc.used ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-500'}">
          ${fnc.used ? t('markUnused') : t('markRedeemed')}
        </button>
      </div>
    `;
    container.appendChild(el);
  });
}

function toggleFncStatus(id) {
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
function renderLoyaltyStatusCards() {
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
function renderTransferCheatSheet() {
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
function renderDonutChart() {
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
    if (!isCardOwned(cr.cardId)) return;
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
let currentAdvisorCat = 'dining';

const ADVISOR_RULES = {
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
        mult: '3x UR / 0% FTF',
        badge: { en: 'Best for Overseas & Delivery', 'zh-TW': '海外用餐與外送首選' },
        note: {
          en: 'Chase Sapphire Preferred: 3x UR worldwide, zero FTF, plus complimentary DashPass & $10/mo DoorDash non-restaurant grocery credit.',
          'zh-TW': 'Chase Sapphire Preferred: 全球餐廳 3x UR、0% FTF Visa 萬用通道。附贈 DashPass 與每月 $10 DoorDash 生鮮折抵。'
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
  flights: {
    title: { en: '✈️ Flight Bookings', 'zh-TW': '✈️ 機票預訂' },
    winner: 'The Business Platinum (5x MR) / Capital One Venture X (5x / $300 Credit)',
    candidateCards: ['amex-biz-plat', 'venture-x'],
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
      }
    }
  },
  hotels: {
    title: { en: '🏨 Hotel Stays (2026 Updated)', 'zh-TW': '🏨 飯店住宿預訂 (2026 最新攻略)' },
    winner: 'Amex Biz Plat ($600 FHR Credit) / Marriott Brilliant (6x) / IHG Premier (26x)',
    candidateCards: ['amex-biz-plat', 'bonvoy-brilliant', 'ihg-premier'],
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
      }
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
    }
  },
  gas: {
    title: { en: '⛽ Gas & EV Charging (2026 Upgraded)', 'zh-TW': '⛽ 加油與電車充電 (2026 升級)' },
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
    }
  }
};

function renderChase524() {
  const box = document.getElementById('chase-524-box');
  const badge = document.getElementById('chase-524-badge');
  const detail = document.getElementById('chase-524-detail');
  if (!box || !badge || !detail) return;

  const personalCardIds = ['bonvoy-brilliant', 'venture-x', 'csp', 'ihg-premier', 'cfu', 'amex-ed'];
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

function selectAdvisorCategory(cat) {
  currentAdvisorCat = cat;
  document.querySelectorAll('.adv-cat-btn').forEach(btn => {
    btn.className = 'adv-cat-btn p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-center transition bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100';
  });

  const activeBtn = document.getElementById(`adv-${cat}-btn`);
  if (activeBtn) {
    activeBtn.className = 'adv-cat-btn p-3 rounded-2xl border text-center transition bg-indigo-50 border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800/60 shadow-xs';
  }

  const data = ADVISOR_RULES[cat];
  const box = document.getElementById('advisor-result-box');
  if (!box || !data) return;

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

  const candidateCards = data.candidateCards || [];
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
          <button onclick="loadDemoStarterPack()" class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-750 active:scale-95 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700/80 text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1">
            <span>⚡</span>
            <span>${t('btnLoadDemoPack')}</span>
          </button>
        </div>
      </div>
    `;
  } else if (ownedInCat.length > 0) {
    const topCardId = ownedInCat[0];
    const topMeta = data.cards[topCardId];
    const cardObj = PRESET_CARDS.find(c => c.id === topCardId);
    const topNick = cardObj ? (typeof cardObj.nickname === 'object' ? (cardObj.nickname[currentLang] || cardObj.nickname['zh-TW']) : cardObj.nickname) : topCardId;
    headerBannerHtml = `
      <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 mb-3 space-y-1 shadow-xs">
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
            <span class="text-sm">👑</span>
            <span>${t('advisorWalletPick')}: <strong>${topNick}</strong></span>
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-600 text-white shadow-xs">
            ${topMeta.mult}
          </span>
        </div>
        <p class="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
          ${topMeta.note[currentLang] || topMeta.note['zh-TW']}
        </p>
      </div>
    `;
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
    const cMeta = data.cards[cId];
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
  if (data.ftfTraps) {
    const trapCardsHtml = data.ftfTraps.map(trap => {
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

  box.innerHTML = `
    <div class="border-b border-slate-200 dark:border-slate-700/60 pb-2.5 mb-2.5">
      <div class="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">${t('advisorHeading')}</div>
      <h4 class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">${data.title[currentLang] || data.title['zh-TW']}</h4>
      <div class="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
        🏆 ${t('advisorAllLibraryGuide')}: ${data.winner}
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
const VALID_SUBVIEWS = ['credits', 'cards', 'loyalty', 'advisor'];
const ACTIVE_TAB_KEY = 'cardflow_active_subview_v1';

function getActiveTab() {
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

function switchSubView(viewId, updateHash = true) {
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

  // Instantly scroll to top so mobile view immediately reflects the active tab!
  if (typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// --- 17. FOLDABLE OBSERVER (Pixel 10 Pro Fold) ---
function initFoldScreenObserver() {
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

// --- 18. GOOGLE DRIVE CLOUD SYNC MODULE ---
// Out-of-the-box Default Client ID (same authorized origin as PocketFlow)
const DEFAULT_GDRIVE_CLIENT_ID = '592001205133-6f41prs5p41s92e61pae5eb34rs05as2.apps.googleusercontent.com';
const GDRIVE_FILE_NAME = 'cardflow_backup.json';
const GDRIVE_CLIENT_ID_KEY = 'cardflow_gdrive_client_id_v1';
const GDRIVE_TOKEN_KEY = 'cardflow_gdrive_token_v1';
const GDRIVE_TOKEN_EXPIRES_KEY = 'cardflow_gdrive_token_expires_v1';
const GDRIVE_USER_EMAIL_KEY = 'cardflow_gdrive_user_email_v1';
const GDRIVE_CONNECTED_KEY = 'cardflow_gdrive_connected_v1';
const GDRIVE_AUTO_SYNC_KEY = 'cardflow_gdrive_auto_sync_v1';
const GDRIVE_LAST_SYNC_KEY = 'cardflow_gdrive_last_sync_v1';

let gdriveToken = localStorage.getItem(GDRIVE_TOKEN_KEY) || null;
let gdriveTokenExpiresAt = parseInt(localStorage.getItem(GDRIVE_TOKEN_EXPIRES_KEY) || '0', 10);
let gdriveTokenClient = null;

function getGoogleClientId() {
  const custom = (localStorage.getItem(GDRIVE_CLIENT_ID_KEY) || '').trim();
  return custom || DEFAULT_GDRIVE_CLIENT_ID;
}

async function fetchGoogleDriveUserInfo(token) {
  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress)', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user && data.user.emailAddress) {
        localStorage.setItem(GDRIVE_USER_EMAIL_KEY, data.user.emailAddress);
        updateDriveUI();
      }
    }
  } catch (e) {
    console.log('Failed to fetch Drive user info:', e);
  }
}

function updateDriveUI() {
  const badge = document.getElementById('gdrive-status-badge');
  const lastSyncEl = document.getElementById('gdrive-last-sync-label');
  const inputEl = document.getElementById('gdrive-client-id-input');
  const autoSyncCheck = document.getElementById('gdrive-auto-sync-check');
  const signoutRow = document.getElementById('gdrive-signout-row');

  if (inputEl && document.activeElement !== inputEl) {
    inputEl.value = localStorage.getItem(GDRIVE_CLIENT_ID_KEY) || '';
    inputEl.placeholder = DEFAULT_GDRIVE_CLIENT_ID;
  }

  const isConnected = localStorage.getItem(GDRIVE_CONNECTED_KEY) === 'true';
  const userEmail = localStorage.getItem(GDRIVE_USER_EMAIL_KEY);
  const hasActiveToken = Boolean(gdriveToken && Date.now() < gdriveTokenExpiresAt - 10000);

  if (badge) {
    if (hasActiveToken || isConnected) {
      const emailDisplay = userEmail ? ` (${userEmail})` : '';
      badge.innerText = `${t('gdriveStatusConnected')}${emailDisplay}`;
      badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
    } else {
      badge.innerText = t('gdriveStatusDisconnected');
      badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700';
    }
  }

  if (signoutRow) {
    if (hasActiveToken || isConnected) signoutRow.classList.remove('hidden');
    else signoutRow.classList.add('hidden');
  }

  const lastSync = localStorage.getItem(GDRIVE_LAST_SYNC_KEY);
  if (lastSyncEl) {
    if (lastSync) {
      lastSyncEl.innerText = `${currentLang === 'zh-TW' ? '最後同步' : 'Last sync'}: ${lastSync}`;
    } else {
      lastSyncEl.innerText = t('gdriveLastSyncLabel');
    }
  }

  if (autoSyncCheck) {
    autoSyncCheck.checked = localStorage.getItem(GDRIVE_AUTO_SYNC_KEY) === 'true';
  }
}

function requestGoogleDriveToken(onSuccess) {
  const clientId = getGoogleClientId();
  if (!clientId) {
    alert(t('gdriveNoClientIdPrompt'));
    const input = document.getElementById('gdrive-client-id-input');
    if (input) input.focus();
    return;
  }

  if (gdriveToken && Date.now() < gdriveTokenExpiresAt - 30000) {
    onSuccess(gdriveToken);
    return;
  }

  if (typeof window === 'undefined' || typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.oauth2) {
    alert(currentLang === 'zh-TW' ? 'Google 服務腳本尚未載入完成，請檢查網路連線或重新整理頁面。' : 'Google Identity Services library not yet loaded. Please check your internet connection.');
    return;
  }

  try {
    gdriveTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (resp) => {
        if (resp && resp.access_token) {
          gdriveToken = resp.access_token;
          const expiresInSec = parseInt(resp.expires_in, 10) || 3599;
          gdriveTokenExpiresAt = Date.now() + expiresInSec * 1000;
          localStorage.setItem(GDRIVE_TOKEN_KEY, gdriveToken);
          localStorage.setItem(GDRIVE_TOKEN_EXPIRES_KEY, String(gdriveTokenExpiresAt));
          localStorage.setItem(GDRIVE_CONNECTED_KEY, 'true');
          fetchGoogleDriveUserInfo(gdriveToken);
          updateDriveUI();
          onSuccess(gdriveToken);
        } else if (resp && resp.error) {
          console.error('Google OAuth error:', resp);
          if (resp.error !== 'popup_closed_by_user') {
            alert((currentLang === 'zh-TW' ? 'Google 登入失敗: ' : 'Google Sign-in failed: ') + (resp.error_description || resp.error));
          }
        }
      }
    });

    gdriveTokenClient.requestAccessToken({ prompt: '' });
  } catch (err) {
    console.error('Token Client init failed:', err);
    alert((currentLang === 'zh-TW' ? '初始化 Google 登入失敗: ' : 'Failed to init Google Sign-in: ') + err.message);
  }
}

async function backupToGoogleDrive(isSilent = false) {
  const backupBtn = document.getElementById('gdrive-backup-btn');
  if (backupBtn && !isSilent) backupBtn.disabled = true;

  requestGoogleDriveToken(async (token) => {
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${GDRIVE_FILE_NAME}' and trashed=false&fields=files(id,name,modifiedTime)`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const searchData = await searchRes.json();
      const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

      const fileData = JSON.stringify(appState, null, 2);

      if (existingFile) {
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: fileData
        });
      } else {
        const metadata = {
          name: GDRIVE_FILE_NAME,
          mimeType: 'application/json',
          description: 'CardFlow Credit Card & Loyalty Tracker Backup'
        };
        const boundary = '-------cardflow_boundary_' + Date.now();
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          fileData +
          close_delim;

        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartRequestBody
        });
      }

      const now = new Date();
      const nowStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      localStorage.setItem(GDRIVE_LAST_SYNC_KEY, nowStr);
      updateDriveUI();

      if (!isSilent) {
        alert(t('gdriveBackupSuccess'));
      }
    } catch (err) {
      console.error('Drive backup error:', err);
      if (!isSilent) {
        alert((currentLang === 'zh-TW' ? '備份至 Google Drive 失敗: ' : 'Backup to Google Drive failed: ') + err.message);
      }
    } finally {
      if (backupBtn && !isSilent) backupBtn.disabled = false;
    }
  });
}

async function restoreFromGoogleDrive() {
  const restoreBtn = document.getElementById('gdrive-restore-btn');
  if (restoreBtn) restoreBtn.disabled = true;

  requestGoogleDriveToken(async (token) => {
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${GDRIVE_FILE_NAME}' and trashed=false&fields=files(id,name,modifiedTime)`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const searchData = await searchRes.json();
      const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

      if (!existingFile) {
        alert(t('gdriveNoBackupFound'));
        return;
      }

      const downloadRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const parsed = await downloadRes.json();

      if (parsed && typeof parsed === 'object') {
        const modTimeStr = existingFile.modifiedTime ? new Date(existingFile.modifiedTime).toLocaleString() : '未知';
        const confirmMsg = currentLang === 'zh-TW'
          ? `找到雲端備份（更新時間: ${modTimeStr}），確定要還原覆蓋目前資料嗎？`
          : `Found cloud backup (modified: ${modTimeStr}). Restore and overwrite current state?`;

        if (confirm(confirmMsg)) {
          appState = parsed;
          saveState(true);
          applyLanguage(currentLang);
          alert(t('gdriveRestoreSuccess'));
          document.getElementById('settings-modal')?.classList.add('hidden');
        }
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (err) {
      console.error('Drive restore error:', err);
      alert((currentLang === 'zh-TW' ? '從 Google Drive 還原失敗: ' : 'Restore from Google Drive failed: ') + err.message);
    } finally {
      if (restoreBtn) restoreBtn.disabled = false;
    }
  });
}

function handleDriveAutoSync() {
  if (localStorage.getItem(GDRIVE_AUTO_SYNC_KEY) === 'true' && gdriveToken && Date.now() < gdriveTokenExpiresAt) {
    backupToGoogleDrive(true);
  }
}

// --- 19. MODAL & BACKUP LOGIC ---
function setupModals() {
  const fncModal = document.getElementById('fnc-modal');
  const openFncBtn = document.getElementById('open-add-fnc-btn');
  const closeFncBtn = document.getElementById('close-fnc-modal-btn');
  const cancelFncBtn = document.getElementById('cancel-fnc-btn');
  const fncForm = document.getElementById('fnc-form');

  if (openFncBtn) openFncBtn.onclick = () => fncModal.classList.remove('hidden');
  if (closeFncBtn) closeFncBtn.onclick = () => fncModal.classList.add('hidden');
  if (cancelFncBtn) cancelFncBtn.onclick = () => fncModal.classList.add('hidden');

  const fab = document.getElementById('floating-add-btn');
  if (fab) fab.onclick = () => fncModal.classList.remove('hidden');

  if (fncForm) {
    fncForm.onsubmit = e => {
      e.preventDefault();
      const name = document.getElementById('fnc-name-input').value;
      const issuer = document.getElementById('fnc-issuer-input').value;
      const points = document.getElementById('fnc-points-input').value;
      const expire = document.getElementById('fnc-expire-input').value;

      appState.fncs.push({
        id: 'fnc-' + Date.now(),
        name: name,
        issuer: issuer,
        points: points,
        expireDate: expire,
        used: false
      });
      saveState();
      renderFncs();
      fncModal.classList.add('hidden');
      fncForm.reset();
    };
  }

  const settingsModal = document.getElementById('settings-modal');
  const openSettingsBtn = document.getElementById('open-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');

  if (openSettingsBtn) openSettingsBtn.onclick = () => settingsModal.classList.remove('hidden');
  if (closeSettingsBtn) closeSettingsBtn.onclick = () => settingsModal.classList.add('hidden');

  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.onclick = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `cardflow_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
  }

  const importBtn = document.getElementById('import-json-btn');
  const fileInput = document.getElementById('import-file-input');
  if (importBtn && fileInput) {
    importBtn.onclick = () => fileInput.click();
    fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target.result);
          appState = parsed;
          saveState();
          applyLanguage(currentLang);
          alert(currentLang === 'zh-TW' ? '備份資料還原成功！' : 'Data restored successfully!');
          settingsModal.classList.add('hidden');
        } catch (err) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    };
  }

  const resetBtn = document.getElementById('reset-factory-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      const confirmMsg = currentLang === 'zh-TW'
        ? '確定要清除所有本機資料（已選卡片、折抵進度與房券），重設為初始狀態嗎？此動作無法復原。'
        : 'Are you sure you want to clear all data (cards, claimed credits, and awards) and reset to initial state? This cannot be undone.';
      if (confirm(confirmMsg)) {
        localStorage.removeItem(STATE_KEY);
        appState = {
          ownedCards: {},
          cardMeta: {},
          creditsClaimed: {},
          fncs: [],
          fncsClaimed: {}
        };
        saveState();
        renderAllViews();
        settingsModal.classList.add('hidden');
        showToast(currentLang === 'zh-TW' ? '已成功清除資料並恢復初始狀態' : 'All data reset to initial state');
      }
    };
  }

  // Manage Owned Cards Modal Bindings
  const openManageCardsBtn = document.getElementById('open-manage-cards-btn');
  const closeManageCardsBtn = document.getElementById('close-manage-cards-btn');
  const saveManageCardsBtn = document.getElementById('save-manage-cards-btn');
  const selectAllCardsBtn = document.getElementById('select-all-cards-btn');
  const deselectAllCardsBtn = document.getElementById('deselect-all-cards-btn');
  const manageCardsDemoBtn = document.getElementById('manage-cards-demo-btn');
  const donutBadge = document.getElementById('donut-cards-count-badge');

  if (openManageCardsBtn) openManageCardsBtn.onclick = openManageCardsModal;
  if (donutBadge) donutBadge.onclick = openManageCardsModal;
  if (closeManageCardsBtn) closeManageCardsBtn.onclick = closeManageCardsModal;
  if (saveManageCardsBtn) saveManageCardsBtn.onclick = closeManageCardsModal;
  if (selectAllCardsBtn) selectAllCardsBtn.onclick = () => selectAllCards(true);
  if (deselectAllCardsBtn) deselectAllCardsBtn.onclick = () => selectAllCards(false);
  if (manageCardsDemoBtn) {
    manageCardsDemoBtn.onclick = () => {
      loadDemoStarterPack();
      closeManageCardsModal();
    };
  }

  // Annual Value Breakdown Modal Bindings
  const annualModal = document.getElementById('annual-breakdown-modal');
  const openAnnualBtn = document.getElementById('open-annual-breakdown-btn');
  const closeAnnualBtn = document.getElementById('close-annual-modal-btn');
  const confirmAnnualBtn = document.getElementById('confirm-annual-modal-btn');

  if (openAnnualBtn) openAnnualBtn.onclick = openAnnualBreakdownModal;
  if (closeAnnualBtn) closeAnnualBtn.onclick = closeAnnualBreakdownModal;
  if (confirmAnnualBtn) confirmAnnualBtn.onclick = closeAnnualBreakdownModal;
  if (annualModal) {
    annualModal.addEventListener('click', (e) => {
      if (e.target === annualModal) closeAnnualBreakdownModal();
    });
  }

  // Card Date Modal Bindings
  const cardDateModal = document.getElementById('card-date-modal');
  const closeCardDateBtn = document.getElementById('close-card-date-btn');
  const cancelCardDateBtn = document.getElementById('cancel-card-date-btn');
  const clearCardDateBtn = document.getElementById('clear-card-date-btn');
  const saveCardDateBtn = document.getElementById('save-card-date-btn');

  if (closeCardDateBtn) closeCardDateBtn.onclick = closeCardDateModal;
  if (cancelCardDateBtn) cancelCardDateBtn.onclick = closeCardDateModal;
  if (clearCardDateBtn) clearCardDateBtn.onclick = clearCardDate;
  if (saveCardDateBtn) saveCardDateBtn.onclick = saveCardDate;
  if (cardDateModal) {
    cardDateModal.addEventListener('click', (e) => {
      if (e.target === cardDateModal) closeCardDateModal();
    });
  }

  // Card ownership filter buttons
  ['all', 'owned', 'unowned'].forEach(mode => {
    const btn = document.getElementById(`card-filter-${mode}-btn`);
    if (btn) {
      btn.onclick = () => {
        currentOwnershipFilter = mode;
        renderCards();
      };
    }
  });

  // Google Drive Cloud Sync Bindings
  const gdriveHelpModal = document.getElementById('gdrive-help-modal');
  const gdriveHelpBtn = document.getElementById('gdrive-help-btn');
  const closeGdriveHelpBtn = document.getElementById('close-gdrive-help-btn');
  const confirmGdriveHelpBtn = document.getElementById('confirm-gdrive-help-btn');

  if (gdriveHelpBtn && gdriveHelpModal) gdriveHelpBtn.onclick = () => gdriveHelpModal.classList.remove('hidden');
  if (closeGdriveHelpBtn && gdriveHelpModal) closeGdriveHelpBtn.onclick = () => gdriveHelpModal.classList.add('hidden');
  if (confirmGdriveHelpBtn && gdriveHelpModal) confirmGdriveHelpBtn.onclick = () => gdriveHelpModal.classList.add('hidden');

  const toggleConfigBtn = document.getElementById('gdrive-toggle-config-btn');
  const configBox = document.getElementById('gdrive-client-id-box');
  if (toggleConfigBtn && configBox) {
    toggleConfigBtn.onclick = () => configBox.classList.toggle('hidden');
  }

  const saveClientIdBtn = document.getElementById('gdrive-save-client-id-btn');
  const clientIdInput = document.getElementById('gdrive-client-id-input');
  if (saveClientIdBtn && clientIdInput) {
    saveClientIdBtn.onclick = () => {
      const val = clientIdInput.value.trim();
      localStorage.setItem(GDRIVE_CLIENT_ID_KEY, val);
      alert(currentLang === 'zh-TW' ? 'Google OAuth Client ID 已儲存！' : 'Google OAuth Client ID saved!');
      updateDriveUI();
    };
  }

  const backupDriveBtn = document.getElementById('gdrive-backup-btn');
  if (backupDriveBtn) backupDriveBtn.onclick = () => backupToGoogleDrive(false);

  const restoreDriveBtn = document.getElementById('gdrive-restore-btn');
  if (restoreDriveBtn) restoreDriveBtn.onclick = () => restoreFromGoogleDrive();

  const autoSyncCheck = document.getElementById('gdrive-auto-sync-check');
  if (autoSyncCheck) {
    autoSyncCheck.onchange = (e) => {
      localStorage.setItem(GDRIVE_AUTO_SYNC_KEY, e.target.checked ? 'true' : 'false');
      if (e.target.checked) {
        backupToGoogleDrive(true);
      }
    };
  }

  const signoutDriveBtn = document.getElementById('gdrive-signout-btn');
  if (signoutDriveBtn) {
    signoutDriveBtn.onclick = () => {
      if (gdriveToken && typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.oauth2) {
        try { window.google.accounts.oauth2.revoke(gdriveToken, () => {}); } catch (e) {}
      }
      gdriveToken = null;
      gdriveTokenExpiresAt = 0;
      localStorage.removeItem(GDRIVE_TOKEN_KEY);
      localStorage.removeItem(GDRIVE_TOKEN_EXPIRES_KEY);
      localStorage.removeItem(GDRIVE_USER_EMAIL_KEY);
      localStorage.removeItem(GDRIVE_CONNECTED_KEY);
      updateDriveUI();
      alert(currentLang === 'zh-TW' ? '已登出 Google 帳號' : 'Signed out of Google account');
    };
  }
}

// --- 20. INITIALIZATION & BINDINGS ---
function init() {
  loadState();
  applyTheme(currentTheme);
  applyPalette(currentPalette);

  document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
    applyLanguage(currentLang === 'zh-TW' ? 'en' : 'zh-TW');
  });

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  // Top Notification Banner State & Controls
  const bannerEl = document.getElementById('demo-mode-banner');
  if (localStorage.getItem(BANNER_KEY) === 'true' && bannerEl) {
    bannerEl.classList.add('hidden');
  }

  document.getElementById('close-banner-btn')?.addEventListener('click', () => {
    if (bannerEl) bannerEl.classList.add('hidden');
    localStorage.setItem(BANNER_KEY, 'true');
  });

  document.getElementById('restore-banner-btn')?.addEventListener('click', () => {
    if (bannerEl) bannerEl.classList.remove('hidden');
    localStorage.removeItem(BANNER_KEY);
    alert(currentLang === 'zh-TW' ? '已恢復顯示頂部提醒橫條。' : 'Top notification banner restored.');
  });

  document.getElementById('banner-reset-month-btn')?.addEventListener('click', resetCurrentMonth);
  document.getElementById('settings-reset-month-btn')?.addEventListener('click', resetCurrentMonth);

  document.getElementById('nav-btn-credits')?.addEventListener('click', () => switchSubView('credits'));
  document.getElementById('nav-btn-cards')?.addEventListener('click', () => switchSubView('cards'));
  document.getElementById('nav-btn-loyalty')?.addEventListener('click', () => switchSubView('loyalty'));
  document.getElementById('nav-btn-advisor')?.addEventListener('click', () => switchSubView('advisor'));

  document.getElementById('mob-nav-credits')?.addEventListener('click', () => switchSubView('credits'));
  document.getElementById('mob-nav-cards')?.addEventListener('click', () => switchSubView('cards'));
  document.getElementById('mob-nav-loyalty')?.addEventListener('click', () => switchSubView('loyalty'));
  document.getElementById('mob-nav-advisor')?.addEventListener('click', () => switchSubView('advisor'));

  ['all', 'monthly', 'semiannual', 'annual'].forEach(p => {
    const btn = document.getElementById(`period-${p}-btn`);
    if (btn) {
      btn.addEventListener('click', () => setPeriodFilter(p));
    }
  });

  ['all', 'amex', 'chase', 'c1'].forEach(iss => {
    const btn = document.getElementById(`issuer-${iss}-btn`);
    if (btn) {
      btn.addEventListener('click', () => {
        currentIssuerFilter = iss === 'all' ? 'all' : iss === 'amex' ? 'Amex' : iss === 'chase' ? 'Chase' : 'CapitalOne';
        document.querySelectorAll('.issuer-filter-btn').forEach(b => {
          b.className = 'issuer-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0';
        });
        btn.className = 'issuer-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shrink-0';
        renderCards();
      });
    }
  });

  document.getElementById('cards-search-input')?.addEventListener('input', renderCards);

  initFoldScreenObserver();
  setupModals();
  applyLanguage(currentLang);

  // Restore active subview from URL hash or session
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('hashchange', () => {
      const hash = (window.location && window.location.hash) ? window.location.hash.slice(1) : '';
      if (VALID_SUBVIEWS.includes(hash)) {
        switchSubView(hash, false);
      }
    });
  }

  const initialHash = (typeof window !== 'undefined' && window.location && window.location.hash)
    ? window.location.hash.slice(1)
    : '';
  const initialTab = getActiveTab();
  const shouldUpdateHash = !initialHash && initialTab !== 'credits';
  switchSubView(initialTab, shouldUpdateHash);
}

document.addEventListener('DOMContentLoaded', init);

// --- 21. SERVICE WORKER & PWA AUTO-UPDATE (POCKETFLOW PARITY) ---
if ('serviceWorker' in navigator) {
  let hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;

  function triggerPwaReload() {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  }

  function showPwaUpdateBanner() {
    const banner = document.getElementById('pwa-update-banner');
    if (banner) {
      banner.classList.remove('hidden');
    }
  }

  // When SW claims control, reload immediately if idle, or prompt user
  if (typeof navigator.serviceWorker.addEventListener === 'function') {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) {
        hadController = true;
        return;
      }
      // Check if user is actively entering an unsaved certificate
      const fncModal = document.getElementById('fnc-modal');
      const isFncModalOpen = fncModal && !fncModal.classList.contains('hidden');
      const fncName = document.getElementById('fnc-name-input') ? document.getElementById('fnc-name-input').value.trim() : '';
      const isDirty = isFncModalOpen && Boolean(fncName);

      if (isDirty) {
        showPwaUpdateBanner();
      } else {
        triggerPwaReload();
      }
    });
  }

  window.addEventListener('load', () => {
    // updateViaCache: 'none' bypasses HTTP caching for sw.js byte checks
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((reg) => {
      // Actively check for SW updates when page loads
      reg.update().catch(() => {});

      // If an update is downloaded & ready
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showPwaUpdateBanner();
            }
          });
        }
      });

      // Re-check for updates whenever user returns to the app tab or focuses window
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          reg.update().catch(() => {});
        }
      });
      window.addEventListener('focus', () => {
        reg.update().catch(() => {});
      });
    }).catch(err => {
      console.log('SW registration note:', err);
    });
  });

  // Bind update button
  document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('pwa-update-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', triggerPwaReload);
    }
  });
}
