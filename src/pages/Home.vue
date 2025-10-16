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
      <div 
        ref="cardsContainer"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
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
import { employees } from '../data/employees'

const cardsContainer = ref<HTMLElement>()

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  
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
