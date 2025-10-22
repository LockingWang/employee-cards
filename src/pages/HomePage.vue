<template>
  <div class="homepage-container">
    <!-- 網站標題 -->
    <header class="header">
      <h1 class="main-title">
        歡迎來到我們的工具集
        <span class="title-emoji">🛠️</span>
      </h1>
      <p class="subtitle">
        選擇您需要的功能，讓我們一起提升工作效率！
      </p>
    </header>

    <!-- 三角形按鈕佈局 -->
    <main class="main-content">
      <div class="triangle-container">
        <!-- 員工資料卡 - 頂部 -->
        <div 
          class="feature-button employees-button"
          @click="navigateTo('/employees')"
        >
          <div class="button-icon">
            <Users class="icon" />
          </div>
          <div class="button-content">
            <h3 class="button-title">員工資料卡</h3>
            <p class="button-description">認識我們充滿活力的團隊成員</p>
          </div>
          <div class="button-arrow">
            <ArrowRight class="arrow-icon" />
          </div>
        </div>

        <!-- 記帳小幫手 - 左下 -->
        <div 
          class="feature-button accounting-button"
          @click="navigateTo('/accounting')"
        >
          <div class="coming-soon-badge">即將推出</div>
          <div class="button-icon">
            <Calculator class="icon" />
          </div>
          <div class="button-content">
            <h3 class="button-title">記帳小幫手</h3>
            <p class="button-description">輕鬆管理您的財務</p>
          </div>
          <div class="button-arrow">
            <ArrowRight class="arrow-icon" />
          </div>
        </div>

        <!-- 午餐專家 - 右下 -->
        <div 
          class="feature-button lunch-button"
          @click="navigateTo('/lunch')"
        >
          <div class="coming-soon-badge">即將推出</div>
          <div class="button-icon">
            <Utensils class="icon" />
          </div>
          <div class="button-content">
            <h3 class="button-title">午餐專家</h3>
            <p class="button-description">解決每日的選擇困難</p>
          </div>
          <div class="button-arrow">
            <ArrowRight class="arrow-icon" />
          </div>
        </div>
      </div>
    </main>

    <!-- 可愛裝飾 -->
    <div class="decoration decoration-1">🌟</div>
    <div class="decoration decoration-2">💫</div>
    <div class="decoration decoration-3">🌸</div>
    <div class="decoration decoration-4">✨</div>

    <!-- 版本資訊 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="version-info">
          <span class="version-emoji">🎉</span>
          <p class="version-text">多功能工具集 v{{ VERSION_INFO.version }}</p>
        </div>
        <p class="update-info">
          最後更新：{{ VERSION_INFO.lastUpdate }} | 建置日期：{{ VERSION_INFO.buildDate }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { Users, Calculator, Utensils, ArrowRight } from 'lucide-vue-next'
import { VERSION_INFO } from '../config/version'

const router = useRouter()

const navigateTo = (path: string) => {
  if (path === '/accounting' || path === '/lunch') {
    // 未開發的功能，顯示提示
    alert('此功能即將推出，敬請期待！')
    return
  }
  router.push(path)
}

onMounted(() => {
  // 為功能卡片添加進入動畫
  const cards = document.querySelectorAll('.feature-card')
  
  cards.forEach((card, index) => {
    gsap.fromTo(card, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.8
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.2,
        ease: "back.out(1.7)"
      }
    )
  })
})
</script>

<style scoped>
/* 主容器 */
.homepage-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef7ff 0%, #f0f9ff 50%, #f0fdf4 100%);
  position: relative;
  overflow: hidden;
}

/* 標題區域 */
.header {
  text-align: center;
  padding: 60px 20px 40px;
  position: relative;
  z-index: 10;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #4a5568;
  margin: 0 0 20px 0;
  font-family: 'Nunito', sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.title-emoji {
  font-size: 4rem;
  margin-left: 15px;
}

.subtitle {
  font-size: 1.25rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 主要內容區域 */
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  z-index: 10;
}

/* 三角形容器 */
.triangle-container {
  position: relative;
  width: 200px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

/* 功能按鈕基礎樣式 */
.feature-button {
  position: relative;
  width: 180px;
  height: 100px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid rgba(255, 255, 255, 0.8);
  overflow: visible;
}

.feature-button:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 25px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 員工資料卡 - 頂部 */
.employees-button {
  background: linear-gradient(135deg, #fdf2f8, #fce7f3);
  border-color: #f9a8d4;
}

.employees-button:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 15px 30px rgba(249, 168, 212, 0.3);
}

/* 記帳小幫手 - 中間 */
.accounting-button {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-color: #86efac;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.accounting-button:hover {
  transform: translateY(-10px) scale(0.95);
  box-shadow: 0 5px 15px rgba(134, 239, 172, 0.2);
  opacity: 0.7;
}

/* 午餐專家 - 底部 */
.lunch-button {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-color: #fcd34d;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.lunch-button:hover {
  transform: translateY(-10px) scale(0.95);
  box-shadow: 0 5px 15px rgba(252, 211, 77, 0.2);
  opacity: 0.7;
}

/* 即將推出標籤 */
.coming-soon-badge {
  position: absolute;
  top: -20px;
  right: -20px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 12px;
  z-index: 30;
  box-shadow: 0 3px 10px rgba(245, 158, 11, 0.4);
  animation: pulse-badge 2s ease-in-out infinite;
  white-space: nowrap;
  border: 2px solid white;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 按鈕圖標 */
.button-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.icon {
  width: 24px;
  height: 24px;
  color: #6b7280;
}

/* 按鈕內容 */
.button-content {
  text-align: center;
  flex: 1;
  overflow: hidden;
}

.button-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 4px 0;
  font-family: 'Nunito', sans-serif;
  line-height: 1.2;
}

.button-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 按鈕箭頭 */
.button-arrow {
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.feature-button:hover .button-arrow {
  opacity: 1;
  transform: translateX(5px);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

/* 裝飾元素 */
.decoration {
  position: fixed;
  font-size: 2rem;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}

.decoration-1 {
  top: 40px;
  left: 40px;
  animation-delay: 0s;
}

.decoration-2 {
  top: 80px;
  right: 80px;
  animation-delay: 0.5s;
}

.decoration-3 {
  bottom: 80px;
  left: 80px;
  animation-delay: 1s;
}

.decoration-4 {
  bottom: 40px;
  right: 40px;
  animation-delay: 1.5s;
}

/* 頁腳 */
.footer {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.version-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.version-emoji {
  font-size: 1.2rem;
  margin-right: 10px;
}

.version-text {
  font-size: 0.9rem;
  color: #4a5568;
  margin: 0;
  font-weight: 500;
}

.update-info {
  font-size: 0.75rem;
  color: #718096;
  margin: 0;
}

/* 動畫 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .title-emoji {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .triangle-container {
    width: 100%;
    height: 350px;
    max-width: 200px;
  }
  
  .feature-button {
    width: 160px;
    height: 90px;
    padding: 12px;
  }
  
  .button-title {
    font-size: 0.85rem;
  }
  
  .button-description {
    font-size: 0.7rem;
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .triangle-container {
    height: 320px;
  }
  
  .feature-button {
    width: 140px;
    height: 80px;
    padding: 10px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .title-emoji {
    font-size: 2.5rem;
  }
}
</style>
