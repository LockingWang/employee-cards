# 員工資料卡靜態網站 🩷

一個以可愛風格、具互動性為主題的靜態網站，用來展示公司 8 位員工的個人資料卡。

## ✨ 特色功能

- 🎨 **可愛風格設計**：柔和的粉色、米色、薄荷綠漸層背景
- 🃏 **互動式卡片**：點擊頭像或卡片可翻轉查看詳細資訊
- 👤 **詳細個人資訊**：包含姓名、職稱、喜歡的東西、害怕的東西、不吃的東西
- 📱 **響應式設計**：完美適配桌機與手機
- ✨ **豐富動畫**：GSAP 動畫效果，包含淡入、縮放、翻轉等
- 🎯 **現代化 UI**：使用 Tailwind CSS 和 Lucide Icons

## 🛠️ 技術棧

- **前端框架**：Vue 3 (Composition API)
- **開發工具**：Vite
- **UI 元件庫**：PrimeVue
- **動畫庫**：GSAP
- **圖標庫**：Lucide Icons
- **樣式框架**：Tailwind CSS
- **字型**：Google Fonts (Nunito, Poppins)

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 📁 專案結構

```
src/
├── components/
│   └── EmployeeCard.vue    # 員工卡片元件
├── pages/
│   └── Home.vue           # 首頁
├── data/
│   └── employees.ts       # 員工資料
├── assets/                # 靜態資源
├── App.vue               # 根元件
├── main.js              # 入口檔案
└── style.css            # 全域樣式
```

## 🎨 設計特色

### 色彩方案
- **主色調**：粉色系 (#fff5f7, #ffe4ec)
- **輔助色**：米色系 (#fef6e4)
- **點綴色**：薄荷綠系 (#f0fdf4)

### 動畫效果
- 卡片淡入動畫
- Hover 放大效果
- 點擊翻轉動畫
- 滾動觸發動畫

### 響應式設計
- 手機：1 列
- 平板：2 列
- 桌機：3-4 列

## 👥 員工資料

網站展示 8 位員工的詳細資料，包含：
- **基本資訊**：姓名與職稱
- **個人頭像**：圓形頭像設計
- **簡介描述**：個人特色介紹
- **喜歡的東西**：個人喜好（紅色標籤）
- **害怕的東西**：個人恐懼（橙色標籤）
- **不吃的東西**：飲食偏好（灰色標籤）
- **興趣愛好**：個人興趣（黃色標籤）
- **聯絡方式**：Email 聯絡資訊

## 🌐 部署

此專案為純前端靜態網站，可部署至：
- GitHub Pages
- Netlify
- Vercel
- 任何靜態網站託管服務

## 📝 開發說明

### 新增員工
在 `src/data/employees.ts` 中新增員工資料：

```typescript
{
  id: "e9",
  name: "新員工",
  title: "職稱",
  avatar: "頭像 URL",
  description: "個人簡介",
  hobbies: ["興趣1", "興趣2"],
  email: "email@example.com"
}
```

### 自定義樣式
- 修改 `tailwind.config.js` 調整色彩方案
- 編輯 `src/style.css` 自定義動畫效果
- 更新 `src/components/EmployeeCard.vue` 調整卡片樣式

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License