<template>
  <div 
    ref="cardRef"
    class="employee-card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-2xl overflow-hidden"
    @click="toggleFlip"
  >
    <div 
      class="card-inner relative w-full h-full"
      :class="{ 'is-flipped': isFlipped }"
    >
      <!-- 正面 -->
      <div class="card-front">
        <div class="card-front-content">
          <!-- 頭像區域 - 固定高度 -->
          <div class="avatar-section">
            <div class="avatar-container" @click.stop="showDetailCard">
              <img 
                :src="employee.avatar" 
                :alt="employee.name"
                class="avatar-image"
                @error="handleImageError"
              />
            </div>
          </div>
          
          <!-- 姓名和職稱區域 - 固定高度 -->
          <div class="name-section">
            <h3 class="employee-name">{{ employee.name }}</h3>
            <p class="employee-title">{{ employee.title }}</p>
          </div>
          
          <!-- 簡介區域 - 固定高度，可滾動 -->
          <div class="description-section">
            <p class="employee-description">
              {{ employee.description }}
            </p>
          </div>
          
          <!-- 展開按鈕區域 - 固定高度 -->
          <div class="button-section">
            <button class="detail-button">
              <!-- 可愛的裝飾背景 -->
              <div class="button-decoration"></div>
              
              <!-- 閃爍的星星裝飾 -->
              <div class="sparkle sparkle-1"></div>
              <div class="sparkle sparkle-2"></div>
              <div class="sparkle sparkle-3"></div>
              <div class="sparkle sparkle-4"></div>
              
              <!-- 可愛的邊框裝飾 -->
              <div class="corner-decoration corner-1"></div>
              <div class="corner-decoration corner-2"></div>
              
              <!-- 按鈕內容 -->
              <span class="button-content">
                <span class="button-icon-left">✨</span>
                <span class="button-text">查看詳細資訊</span>
                <span class="button-icon-right">💕</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 背面 - 詳細資訊卡 -->
      <div class="card-back">
        <div class="card-back-content">
          <!-- 詳細資訊 -->
          <div class="back-header">
            <h3 class="back-name">{{ employee.name }}</h3>
            <p class="back-title">{{ employee.title }}</p>
            <p class="back-description">{{ employee.description }}</p>
          </div>
          
          <!-- 喜歡的東西 -->
          <div v-if="employee.likes && employee.likes.length" class="info-section">
            <h4 class="section-title">
              <Heart class="section-icon section-icon-red" />
              喜歡的東西
            </h4>
            <div class="tags-container">
              <span 
                v-for="like in employee.likes" 
                :key="like"
                class="tag tag-red"
              >
                {{ like }}
              </span>
            </div>
          </div>
          
          <!-- 害怕的東西 -->
          <div v-if="employee.fears && employee.fears.length" class="info-section">
            <h4 class="section-title">
              <AlertTriangle class="section-icon section-icon-orange" />
              害怕的東西
            </h4>
            <div class="tags-container">
              <span 
                v-for="fear in employee.fears" 
                :key="fear"
                class="tag tag-orange"
              >
                {{ fear }}
              </span>
            </div>
          </div>
          
          <!-- 不吃的東西 -->
          <div v-if="employee.dislikes && employee.dislikes.length" class="info-section">
            <h4 class="section-title">
              <XCircle class="section-icon section-icon-gray" />
              不吃的東西
            </h4>
            <div class="tags-container">
              <span 
                v-for="dislike in employee.dislikes" 
                :key="dislike"
                class="tag tag-gray"
              >
                {{ dislike }}
              </span>
            </div>
          </div>
          
          <!-- 興趣愛好 -->
          <div v-if="employee.hobbies && employee.hobbies.length" class="info-section">
            <h4 class="section-title">
              <Star class="section-icon section-icon-yellow" />
              興趣愛好
            </h4>
            <div class="tags-container">
              <span 
                v-for="hobby in employee.hobbies" 
                :key="hobby"
                class="tag tag-yellow"
              >
                {{ hobby }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, Heart, AlertTriangle, XCircle, Star } from 'lucide-vue-next'
import { gsap } from 'gsap'
import type { Employee } from '../data/employees'

interface Props {
  employee: Employee
}

const props = defineProps<Props>()

const cardRef = ref<HTMLElement>()
const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const showDetailCard = () => {
  isFlipped.value = true
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // 使用預設頭像
  img.src = getDefaultAvatar()
}

const getDefaultAvatar = () => {
  // 使用不同的隨機頭像，確保 1:1 比例
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face&auto=format&q=80'
  ]
  const randomIndex = Math.floor(Math.random() * avatars.length)
  return avatars[randomIndex]
}

onMounted(() => {
  if (cardRef.value) {
    // 初始動畫：淡入 + 輕微縮放
    gsap.fromTo(cardRef.value, 
      { 
        opacity: 0, 
        scale: 0.8,
        y: 50
      },
      { 
        opacity: 1, 
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }
    )
  }
})
</script>

<style scoped>
.employee-card {
  perspective: 1000px;
  height: 400px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.06);
  border-radius: 16px;
}

/* 卡片正面樣式 */
.card-front {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.card-front-content:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 頭像區域 */
.avatar-section {
  flex-shrink: 0;
  margin-top: 20px;
  margin-bottom: 16px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fce7f3;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-container:hover {
  animation: bounce 1s infinite;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1/1;
}

/* 姓名和職稱區域 */
.name-section {
  flex-shrink: 0;
  margin-bottom: 12px;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.employee-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-family: 'Nunito', sans-serif;
}

.employee-title {
  color: #db2777;
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0;
}

/* 簡介區域 */
.description-section {
  flex-shrink: 0;
  margin-bottom: 12px;
  height: 50px;
  overflow: hidden;
}

.employee-description {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.625;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 按鈕區域 */
.button-section {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-button {
  width: 80%;
  margin: 0 8px;
  background: linear-gradient(135deg, #fef3c7, #fde68a, #fcd34d);
  color: white;
  padding: 10px 0;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
}

.detail-button:hover {
  background: linear-gradient(135deg, #fde68a, #fcd34d, #fbbf24);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.05);
  animation: float 2s ease-in-out infinite;
}

/* 按鈕裝飾 */
.button-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.3), rgba(253, 230, 138, 0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-button:hover .button-decoration {
  opacity: 1;
}

/* 閃爍星星裝飾 */
.sparkle {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: sparkle 1.5s ease-in-out infinite;
}

.sparkle-1 {
  top: 4px;
  left: 12px;
  width: 6px;
  height: 6px;
}

.sparkle-2 {
  top: 4px;
  right: 16px;
  width: 4px;
  height: 4px;
  animation-delay: 0.3s;
}

.sparkle-3 {
  bottom: 4px;
  left: 16px;
  width: 4px;
  height: 4px;
  animation-delay: 0.7s;
}

.sparkle-4 {
  bottom: 4px;
  right: 8px;
  width: 6px;
  height: 6px;
  animation-delay: 0.5s;
}

/* 邊框裝飾 */
.corner-decoration {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.corner-1 {
  top: -2px;
  left: -2px;
  width: 16px;
  height: 16px;
}

.corner-2 {
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  animation-delay: 0.15s;
}

/* 按鈕內容 */
.button-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
}

.button-text {
  font-weight: 600;
}

.button-icon-left,
.button-icon-right {
  font-size: 1.125rem;
}

.detail-button:hover .button-icon-left {
  animation: bounce 1s infinite;
}

.detail-button:hover .button-icon-right {
  animation: bounce 1s infinite;
  animation-delay: 0.15s;
}

/* 卡片背面樣式 */
.card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
}

.card-back-content {
  background: linear-gradient(135deg, #fef7ed, #fed7aa);
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  gap: 10px;
}

/* 背面標題區域 */
.back-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}

.back-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-family: 'Nunito', sans-serif;
}

.back-title {
  color: #db2777;
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0 0 12px 0;
}

.back-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
  text-align: center;
}

/* 資訊區塊 */
.info-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.section-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}

.section-icon-red {
  color: #ef4444;
}

.section-icon-orange {
  color: #f97316;
}

.section-icon-gray {
  color: #6b7280;
}

.section-icon-yellow {
  color: #eab308;
}

/* 標籤容器 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

/* 標籤樣式 */
.tag {
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.tag-red {
  background-color: #fee2e2;
  color: #dc2626;
}

.tag-orange {
  background-color: #fed7aa;
  color: #ea580c;
}

.tag-gray {
  background-color: #f3f4f6;
  color: #374151;
}

.tag-yellow {
  background-color: #fef3c7;
  color: #d97706;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

/* 自定義動畫 */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}

.animate-sparkle {
  animation: sparkle 1.5s ease-in-out infinite;
}

</style>
