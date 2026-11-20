// CardFlow Morandi Color Palettes & Category Metadata

// --- 1. MORANDI COLOR PALETTES ---
export const MORANDI_PALETTES = {
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


// --- Category Metadata for Donut Chart ---
export const CREDIT_CATEGORY_META = {
  travel: { name: { en: 'Hotels & Portals', 'zh-TW': '飯店與旅遊折抵' }, color: '#4EB896' },
  dining: { name: { en: 'Dining & Food', 'zh-TW': '餐廳外送與餐飲' }, color: '#F47B89' },
  airline: { name: { en: 'Airlines & TravelBank', 'zh-TW': '航空與機票折抵' }, color: '#5A9FE6' },
  office: { name: { en: 'Business & Office', 'zh-TW': '商業採購與徵才' }, color: '#F7C343' },
  tech: { name: { en: 'Technology & Hardware', 'zh-TW': '科技硬體採購' }, color: '#8B7EB8' },
  telecom: { name: { en: 'Wireless & Telecom', 'zh-TW': '電信通訊話費' }, color: '#48B5C4' },
  subs: { name: { en: 'Memberships & Streaming', 'zh-TW': '影音與生活會員' }, color: '#E07A5F' }
};

