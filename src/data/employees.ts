export interface Employee {
  id: string
  name: string
  title: string
  avatar: string
  description: string
  hobbies?: string[]
  email?: string
  likes?: string[]      // 喜歡的東西
  fears?: string[]      // 害怕的東西
  dislikes?: string[]   // 不吃的東西
}

// 預設頭像函數
const getDefaultAvatar = (seed: string = 'default') => {
  // 使用不同的隨機頭像
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
  ]
  // 使用 seed 來確保每個員工有固定的頭像
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const index = Math.abs(hash) % avatars.length
  return avatars[index]
}

export const employees: Employee[] = [
  {
    id: "e1",
    name: "蘇小",
    title: "設計師",
    avatar: getDefaultAvatar("蘇小"),
    description: "熱愛插畫與貓咪，總是帶來溫暖的色彩靈感。",
    hobbies: ["畫畫", "貓奴", "下午茶"],
    email: "su@example.com",
    likes: ["貓咪", "插畫", "下午茶", "粉色"],
    fears: ["蛇", "德腸"],
    dislikes: ["苦瓜", "茄子", "榴槤"]
  },
  {
    id: "e2",
    name: "許",
    title: "前端工程師",
    avatar: getDefaultAvatar("許"),
    description: "專精於 Vue.js 和動畫效果，讓網站活起來！",
    hobbies: ["程式設計", "電玩", "咖啡"],
    email: "xu@example.com",
    likes: ["程式碼", "電玩", "咖啡", "新技術"],
    fears: ["鴿子", "鸚鵡"],
    dislikes: ["香菜", "內臟", "生魚片"]
  },
  {
    id: "e3",
    name: "王琮仁",
    title: "產品經理",
    avatar: getDefaultAvatar("王琮仁"),
    description: "善於傾聽用戶需求，打造最棒的產品體驗。",
    hobbies: ["閱讀", "瑜珈", "旅行"],
    email: "wang@example.com",
    likes: ["書籍", "瑜珈", "旅行", "用戶反饋"],
    fears: ["喇芽"],
    dislikes: ["辛辣食物", "酒精", "垃圾食物"]
  },
  {
    id: "e4",
    name: "國民媳婦_小媛",
    title: "後端工程師",
    avatar: getDefaultAvatar("國民媳婦_小媛"),
    description: "負責系統架構設計，確保服務穩定運行。",
    hobbies: ["攝影", "爬山", "音樂"],
    email: "xiaoyuan@example.com",
    likes: ["攝影", "大自然", "古典音樂", "穩定系統"],
    fears: ["狗", "八家將"],
    dislikes: ["速食", "碳酸飲料", "過甜食物"]
  },
  {
    id: "e5",
    name: "吉八賢",
    title: "UI/UX 設計師",
    avatar: getDefaultAvatar("吉八賢"),
    description: "專注於用戶體驗設計，讓每個介面都美觀易用。",
    hobbies: ["設計", "烘焙", "電影"],
    email: "jibaxian@example.com",
    likes: ["設計", "烘焙", "電影", "美的事物"],
    fears: ["餛飩"],
    dislikes: ["油膩食物", "太鹹", "生食"]
  },
  {
    id: "e6",
    name: "Ace 車車",
    title: "測試工程師",
    avatar: getDefaultAvatar("Ace 車車"),
    description: "細心測試每個功能，確保產品品質無虞。",
    hobbies: ["桌遊", "健身", "料理"],
    email: "ace@example.com",
    likes: ["桌遊", "健身", "料理", "完美品質"],
    fears: ["鳥"],
    dislikes: ["生菜", "海鮮", "太辣"]
  },
  {
    id: "e7",
    name: "Kimmy",
    title: "行銷專員",
    avatar: getDefaultAvatar("Kimmy"),
    description: "創意行銷策略，讓更多人認識我們的產品。",
    hobbies: ["寫作", "舞蹈", "美食"],
    email: "kimmy@example.com",
    likes: ["寫作", "舞蹈", "美食", "創意"],
    fears: ["蟑螂"],
    dislikes: ["苦味", "太酸", "過甜"]
  },
  {
    id: "e8",
    name: "小綠",
    title: "專案經理",
    avatar: getDefaultAvatar("小綠"),
    description: "協調團隊合作，確保專案順利進行。",
    hobbies: ["管理", "高爾夫", "品酒"],
    email: "xiaolv@example.com",
    likes: ["團隊合作", "高爾夫", "品酒", "成功"],
    fears: ["小惠"],
    dislikes: ["速食", "太甜", "太鹹"]
  }
]
