<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- 網站標題 -->
    <header class="text-center py-12 px-4">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-nunito">
        我們的可愛夥伴們 
        <span class="text-5xl">🩷</span>
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        認識我們充滿活力的團隊成員，每個人都帶著獨特的才華和熱情！
      </p>
    </header>

    <!-- 員工卡片網格 -->
    <main class="container mx-auto px-4 pb-12">
      <!-- 載入狀態 -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p class="text-gray-600">載入員工資料中...</p>
        </div>
      </div>

      <!-- 錯誤訊息 -->
      <div v-else-if="error" class="text-center py-8">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p class="text-yellow-800">{{ error }}</p>
        </div>
      </div>

      <!-- 員工卡片 -->
      <div 
        v-else
        ref="cardsContainer"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
        style="gap: 10px;"
      >
        <EmployeeCard
          v-for="(employee, index) in employees"
          :key="employee.id"
          :employee="employee"
          :data-index="index"
          class="opacity-0"
        />
      </div>
    </main>

    <!-- 可愛裝飾 -->
    <div class="fixed top-10 left-10 text-2xl animate-pulse">🌟</div>
    <div class="fixed top-20 right-20 text-xl animate-bounce">💫</div>
    <div class="fixed bottom-20 left-20 text-2xl animate-pulse">🌸</div>
    <div class="fixed bottom-10 right-10 text-xl animate-bounce">✨</div>

    <!-- 彈幕效果 -->
    <div class="danmaku-container">
      <div 
        v-for="(item, index) in danmakuItems" 
        :key="index"
        :class="`danmaku-item danmaku-${(index % 9) + 1}`"
        :style="`top: ${(index * 10) + 10}%; animation-delay: ${index * 2}s;`"
      >
        {{ item }}
      </div>
    </div>

    <!-- 版本資訊 -->
    <footer class="text-center py-6 px-4 bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-center mb-3">
          <span class="text-lg mr-2">🎉</span>
          <p class="text-sm text-gray-600 font-medium">
            員工卡片系統 v{{ VERSION_INFO.version }}
          </p>
        </div>
        <p class="text-xs text-gray-500 mb-3">
          最後更新：{{ VERSION_INFO.lastUpdate }} | 建置日期：{{ VERSION_INFO.buildDate }}
        </p>
      </div>
    </footer>

    <!-- 客服小幫手按鈕 -->
    <div class="customer-service-button" @click="openGoogleSheets">
      <div class="cs-avatar">
        <div class="cs-face">
          <div class="cs-eyes">
            <div class="cs-eye"></div>
            <div class="cs-eye"></div>
          </div>
          <div class="cs-mouth"></div>
        </div>
      </div>
      <div class="cs-tooltip">
        <span class="cs-tooltip-text">編輯 Google Sheets</span>
        <div class="cs-tooltip-arrow"></div>
      </div>
      <div class="cs-pulse"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EmployeeCard from '../components/EmployeeCard.vue'
import type { Employee } from '../data/employees'
import { createGoogleSheetsService, defaultGoogleSheetsConfig } from '../services/googleSheets'
import { VERSION_INFO } from '../config/version'

const cardsContainer = ref<HTMLElement>()
const employees = ref<Employee[]>([])
const danmakuItems = ref<string[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// 開啟 Google Sheets 編輯頁面
const openGoogleSheets = () => {
  const spreadsheetId = sheetsConfig.spreadsheetId
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  window.open(url, '_blank')
}

// Google Sheets 配置
const sheetsConfig = {
  // 請替換為您的 Google Sheets ID
  spreadsheetId: '1yfnfScBaWhpXhWdpNEcOSPA77SDwJjHqxFfpsmx-4aY',
  // 請替換為您的資料範圍（修正格式）
  range: '工作表1!A1:H100',
  // 可選：如果您有 Google API Key
  apiKey: 'AIzaSyDdqkHgjCWaYDVDnj5_hKyiBKFjaCvj1FA'
}

onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger)
  
  try {
    // 嘗試從 Google Sheets 獲取資料
    const sheetsService = createGoogleSheetsService(sheetsConfig)
    
    // 同時獲取員工資料和彈幕資料
    const [fetchedEmployees, fetchedDanmaku] = await Promise.all([
      sheetsService.fetchEmployees(),
      sheetsService.fetchDanmaku()
    ])
    
    if (fetchedEmployees.length > 0) {
      employees.value = fetchedEmployees
    } else {
      // 如果 Google Sheets 沒有員工資料，使用預設資料
      const { employees: defaultEmployees } = await import('../data/employees')
      employees.value = defaultEmployees
    }
    
    if (fetchedDanmaku.length > 0) {
      danmakuItems.value = fetchedDanmaku
    } else {
      // 如果 Google Sheets 沒有彈幕資料，使用預設彈幕
      danmakuItems.value = [
        'John !!!',
        '貴哥~',
        '交給Cursor',
        '蔡喬',
        '麥味登',
        '小蔡',
        '享受晨間',
        '品味生活',
        '西式早午餐'
      ]
    }
  } catch (err) {
    console.warn('無法從 Google Sheets 獲取資料，使用預設資料:', err)
    // 使用預設資料作為備案
    const { employees: defaultEmployees } = await import('../data/employees')
    employees.value = defaultEmployees
    danmakuItems.value = [
      'John !!!',
      '貴哥~',
      '交給Cursor',
      '蔡喬',
      '麥味登',
      '小蔡',
      '享受晨間',
      '品味生活',
      '西式早午餐'
    ]
    error.value = '無法連接到 Google Sheets，顯示預設資料'
  } finally {
    isLoading.value = false
    
    // 等待 DOM 更新後執行動畫
    setTimeout(() => {
      if (cardsContainer.value) {
        // 為每個卡片設置滾動動畫
        const cards = cardsContainer.value.querySelectorAll('.employee-card')
        
        cards.forEach((card, index) => {
          gsap.fromTo(card, 
            { 
              opacity: 0, 
              y: 100,
              scale: 0.8
            },
            { 
              opacity: 1, 
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          )
        })
      }
    }, 100)
  }
})
</script>

<style scoped>
/* 確保卡片容器有適當的間距 */
.container {
  max-width: 1200px;
}

/* 響應式網格調整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1281px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 彈幕效果 */
.danmaku-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.danmaku-item {
  position: absolute;
  left: -200px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: danmaku-move 15s linear infinite;
}

/* 不同彈幕的不同動畫效果 */
.danmaku-1 {
  animation: danmaku-move-1 18s ease-in-out infinite;
  color: rgba(255, 107, 107, 0.9);
}

.danmaku-2 {
  animation: danmaku-move-2 16s ease-out infinite;
  color: rgba(107, 255, 107, 0.9);
}

.danmaku-3 {
  animation: danmaku-move-3 20s ease-in-out infinite;
  color: rgba(107, 107, 255, 0.9);
}

.danmaku-4 {
  animation: danmaku-move-4 14s ease-out infinite;
  color: rgba(255, 255, 107, 0.9);
}

.danmaku-5 {
  animation: danmaku-move-5 22s ease-in-out infinite;
  color: rgba(255, 107, 255, 0.9);
}

.danmaku-6 {
  animation: danmaku-move-6 17s ease-out infinite;
  color: rgba(107, 255, 255, 0.9);
}

.danmaku-7 {
  animation: danmaku-move-7 19s ease-in-out infinite;
  color: rgba(255, 165, 0, 0.9);
}

.danmaku-8 {
  animation: danmaku-move-8 21s ease-out infinite;
  color: rgba(255, 192, 203, 0.9);
}

.danmaku-9 {
  animation: danmaku-move-9 15s ease-in-out infinite;
  color: rgba(144, 238, 144, 0.9);
}

/* 各種不同的移動動畫 */
@keyframes danmaku-move-1 {
  0% { left: -200px; opacity: 0; transform: translateY(0px); }
  10% { opacity: 1; }
  30% { transform: translateY(-20px); }
  60% { transform: translateY(15px); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px); }
}

@keyframes danmaku-move-2 {
  0% { left: -200px; opacity: 0; transform: translateY(0px) rotate(0deg); }
  15% { opacity: 1; }
  40% { transform: translateY(-30px) rotate(5deg); }
  70% { transform: translateY(20px) rotate(-3deg); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px) rotate(0deg); }
}

@keyframes danmaku-move-3 {
  0% { left: -200px; opacity: 0; transform: translateY(0px) scale(1); }
  20% { opacity: 1; }
  50% { transform: translateY(-25px) scale(1.1); }
  80% { transform: translateY(10px) scale(0.9); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px) scale(1); }
}

@keyframes danmaku-move-4 {
  0% { left: -200px; opacity: 0; transform: translateY(0px); }
  5% { opacity: 1; }
  25% { transform: translateY(-15px); }
  45% { transform: translateY(25px); }
  75% { transform: translateY(-10px); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px); }
}

@keyframes danmaku-move-5 {
  0% { left: -200px; opacity: 0; transform: translateY(0px) rotate(0deg); }
  12% { opacity: 1; }
  35% { transform: translateY(-35px) rotate(-5deg); }
  55% { transform: translateY(20px) rotate(8deg); }
  85% { transform: translateY(-5px) rotate(-2deg); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px) rotate(0deg); }
}

@keyframes danmaku-move-6 {
  0% { left: -200px; opacity: 0; transform: translateY(0px) scale(1); }
  8% { opacity: 1; }
  30% { transform: translateY(-20px) scale(1.2); }
  60% { transform: translateY(30px) scale(0.8); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px) scale(1); }
}

@keyframes danmaku-move-7 {
  0% { left: -200px; opacity: 0; transform: translateY(0px); }
  18% { opacity: 1; }
  40% { transform: translateY(-25px); }
  65% { transform: translateY(15px); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px); }
}

@keyframes danmaku-move-8 {
  0% { left: -200px; opacity: 0; transform: translateY(0px) rotate(0deg); }
  22% { opacity: 1; }
  45% { transform: translateY(-30px) rotate(6deg); }
  70% { transform: translateY(25px) rotate(-4deg); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px) rotate(0deg); }
}

@keyframes danmaku-move-9 {
  0% { left: -200px; opacity: 0; transform: translateY(0px) scale(1); }
  15% { opacity: 1; }
  35% { transform: translateY(-20px) scale(1.1); }
  55% { transform: translateY(20px) scale(0.9); }
  80% { transform: translateY(-10px) scale(1.05); }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; transform: translateY(0px) scale(1); }
}

/* 確保內容在彈幕之上 */
main {
  position: relative;
  z-index: 10;
}

header {
  position: relative;
  z-index: 10;
}

footer {
  position: relative;
  z-index: 10;
}

/* 客服小幫手按鈕 */
.customer-service-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.customer-service-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.customer-service-button:hover .cs-tooltip {
  opacity: 1;
  transform: translateY(-10px);
}

.customer-service-button:hover .cs-pulse {
  animation: pulse-scale 1.5s ease-in-out infinite;
}

/* 客服頭像 */
.cs-avatar {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.cs-face {
  width: 30px;
  height: 30px;
  position: relative;
}

.cs-eyes {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}

.cs-eye {
  width: 4px;
  height: 4px;
  background: #333;
  border-radius: 50%;
  animation: blink 3s infinite;
}

.cs-mouth {
  width: 8px;
  height: 4px;
  background: #333;
  border-radius: 0 0 8px 8px;
  margin: 4px auto 0;
  animation: smile 2s ease-in-out infinite;
}

/* 提示框 */
.cs-tooltip {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(0);
  transition: all 0.3s ease;
  pointer-events: none;
}

.cs-tooltip-arrow {
  position: absolute;
  top: 100%;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.8);
}

/* 脈衝效果 */
.cs-pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.3);
  animation: pulse-ring 2s ease-out infinite;
}

/* 動畫效果 */
@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes smile {
  0%, 100% { transform: scaleX(1); }
  50% { transform: scaleX(1.2); }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
