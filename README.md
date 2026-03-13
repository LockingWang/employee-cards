# Employee Cards — Static Team Directory

**A responsive, interactive static site that displays team member profile cards with a friendly, modern UI.**

|  |  |
|--|--|
| **Stack** | Vue 3, Vite, Tailwind CSS, PrimeVue, GSAP |
| **Type** | Front-end only (static, deployable anywhere) |

**Live demo:** [https://lockingwang.github.io/employee-cards/](https://lockingwang.github.io/employee-cards/)

---

## Overview

This project is a **static team directory** that presents 8 employee profiles as flip cards. It focuses on:

- **Clear UI/UX**: Consistent layout, hover/click feedback, and responsive grid
- **Modern front-end**: Vue 3 Composition API, Vite, Tailwind CSS
- **Polished interactions**: GSAP animations and card flip behavior
- **Maintainability**: Centralized data; reusable `EmployeeCard` component
- **Data source**: Employee data can be loaded from **Google Sheets** (via Sheets API or published CSV); falls back to local `employees.ts` when Sheets is unavailable

Suitable for portfolios and as a discussion piece in front-end interviews (e.g. component design, state, animations, responsive layout).

---

## Tech Stack

| Category | Choice | Notes |
|----------|--------|--------|
| **Framework** | Vue 3 (Composition API) | Component-based, `<script setup>` |
| **Build** | Vite | Fast dev server and production build |
| **Styling** | Tailwind CSS | Utility-first, responsive breakpoints |
| **Components** | PrimeVue | Pre-built UI where needed |
| **Animation** | GSAP | Staggered entrance and card flip |
| **Icons** | Lucide Icons | Lightweight, consistent icon set |
| **Fonts** | Google Fonts (Nunito, Poppins) | Readable, friendly typography |
| **Data** | Google Sheets (optional) | Employee data from a spreadsheet; fallback to `employees.ts` |

---

## Features

- **Flip cards**: Click avatar or card to reveal detailed info (likes, fears, dietary, hobbies, email).
- **Responsive grid**: 1 column (mobile), 2 (tablet), 3–4 (desktop).
- **Animations**: Fade-in, scale on hover, flip on click; GSAP for entrance/stagger.
- **Design**: Soft pink/cream/mint palette; rounded avatars and clear typography.
- **Static & portable**: No backend; can be deployed to GitHub Pages, Netlify, Vercel, or any static host.
- **Google Sheets**: Optional data source—configure a spreadsheet ID and range to load employee data from Google Sheets; otherwise uses local `employees.ts`.

---

## Project Structure

```
src/
├── components/
│   └── EmployeeCard.vue   # Reusable flip card (avatar, front/back content)
├── pages/
│   └── Home.vue           # Main page, grid layout, employee list
├── data/
│   └── employees.ts       # Local fallback employee data
├── services/
│   └── googleSheets.ts    # Google Sheets API client (fetch employees, danmaku)
├── assets/                # Images, etc.
├── App.vue
├── main.js
└── style.css              # Global styles, Tailwind imports
```

See also `GOOGLE_SHEETS_SETUP.md` for configuring the spreadsheet as data source.

Data can come from **Google Sheets** (see `src/services/googleSheets.ts` and `GOOGLE_SHEETS_SETUP.md`) or from local `src/data/employees.ts`; the app falls back to local data if Sheets is not configured or fails. Styling can be tuned via Tailwind config and `EmployeeCard.vue`.

---

## Getting Started

**Prerequisites:** Node.js (e.g. 18+), npm.

```bash
# Install dependencies
npm install

# Run dev server (e.g. http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Design & Implementation Notes

- **Color system**: Primary pink/cream (`#fff5f7`, `#ffe4ec`, `#fef6e4`), accent mint (`#f0fdf4`). Easy to change in `tailwind.config.js` and `style.css`.
- **Adding an employee**: Either edit the Google Sheet (if using Sheets as data source) or add an object to the array in `src/data/employees.ts` with `id`, `name`, `title`, `avatar`, `description`, `hobbies`, `email`, and any tags (e.g. likes, fears, dietary). See `GOOGLE_SHEETS_SETUP.md` for Sheets setup.
- **Customization**: Card layout and flip behavior in `EmployeeCard.vue`; grid and spacing in `Home.vue`; theme in `tailwind.config.js` and `src/style.css`.

These points are good to walk through in an interview (data flow, component API, styling approach).

---

## Deployment

Static output after `npm run build` (e.g. `dist/`). Deploy that folder to:

- **GitHub Pages**
- **Netlify** or **Vercel** (connect repo for automatic deploys)
- Any static hosting or CDN

No server or environment variables required for basic use.

---

## License

MIT License.

---

# 中文說明（面試用）

**線上預覽：** [https://lockingwang.github.io/employee-cards/](https://lockingwang.github.io/employee-cards/)

## 專案簡介

本專案是一個**靜態團隊資料卡網站**，以 8 位員工的個人資料卡為例，展示響應式、具互動性的前端實作。

**技術重點：**

- **前端架構**：Vue 3 Composition API、Vite、Tailwind CSS、PrimeVue、GSAP
- **資料來源**：可選用 **Google 試算表** 作為員工資料來源（透過 Google Sheets API）；未設定或無法連線時會使用本地的 `employees.ts`
- **互動**：點擊頭像或卡片可翻轉顯示詳細資訊（喜好、害怕的事物、飲食、興趣、Email）
- **響應式**：手機 1 欄、平板 2 欄、桌機 3–4 欄
- **設計**：粉色／米色／薄荷綠配色，圓形頭像與清晰排版

## 面試可討論的面向

1. **元件設計**：`EmployeeCard` 如何接收資料、處理翻轉狀態與動畫。
2. **資料層**：支援從 Google 試算表讀取員工資料，失敗時 fallback 至本地 `employees.ts`；可談串接設計與 `GOOGLE_SHEETS_SETUP.md` 設定流程。
3. **動畫與體驗**：GSAP 進場動畫與卡片翻轉的實作方式。
4. **響應式與樣式**：Tailwind 斷點與版面規劃。
5. **部署**：純靜態建置，可部署至 GitHub Pages、Netlify、Vercel 等。

## 快速開始（中文）

```bash
npm install
npm run dev
```

建置：`npm run build`；預覽建置結果：`npm run preview`。

---
