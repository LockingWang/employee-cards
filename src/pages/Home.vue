<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 via-cream-50 to-mint-50">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EmployeeCard from '../components/EmployeeCard.vue'
import type { Employee } from '../data/employees'
import { createGoogleSheetsService, defaultGoogleSheetsConfig } from '../services/googleSheets'

const cardsContainer = ref<HTMLElement>()
const employees = ref<Employee[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

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
    const fetchedEmployees = await sheetsService.fetchEmployees()
    
    if (fetchedEmployees.length > 0) {
      employees.value = fetchedEmployees
    } else {
      // 如果 Google Sheets 沒有資料，使用預設資料
      const { employees: defaultEmployees } = await import('../data/employees')
      employees.value = defaultEmployees
    }
  } catch (err) {
    console.warn('無法從 Google Sheets 獲取資料，使用預設資料:', err)
    // 使用預設資料作為備案
    const { employees: defaultEmployees } = await import('../data/employees')
    employees.value = defaultEmployees
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
</style>
