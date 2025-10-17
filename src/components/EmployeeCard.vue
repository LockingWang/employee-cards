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
      <div class="card-front absolute inset-0 w-full h-full backface-hidden">
        <div class="bg-white rounded-xl p-8 h-full flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl transition-all duration-300"
        style="padding: 16px;">
          <!-- 頭像 -->
          <div class="relative mb-4 w-20 h-20 rounded-full overflow-hidden border-4 border-pink-200 shadow-md group-hover:animate-bounce cursor-pointer"
               @click.stop="showDetailCard">
            <img 
              :src="employee.avatar" 
              :alt="employee.name"
              class="w-full h-full object-cover object-center"
              style="aspect-ratio: 1/1;"
              @error="handleImageError"
            />
          </div>
          
          <!-- 姓名和職稱 -->
          <h3 class="text-xl font-bold text-gray-800 mb-1 font-nunito">{{ employee.name }}</h3>
          <p class="text-pink-600 font-medium text-sm mb-3">{{ employee.title }}</p>
          
          <!-- 簡介 -->
          <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {{ employee.description }}
          </p>
          
          <!-- 展開按鈕 -->
          <button class="w-4/5 mx-2 yellow-gradient-button text-white px-6 py-5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center relative overflow-hidden group"
          :style="{ padding: '10px 0px' }">
            <!-- 可愛的裝飾背景 -->
            <div class="absolute inset-0 bg-gradient-to-r from-yellow-200/30 to-orange-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- 閃爍的星星裝飾 -->
            <div class="absolute top-1 left-3 w-1.5 h-1.5 bg-white/50 rounded-full animate-sparkle"></div>
            <div class="absolute top-1 right-4 w-1 h-1 bg-white/50 rounded-full animate-sparkle delay-300"></div>
            <div class="absolute bottom-1 left-4 w-1 h-1 bg-white/50 rounded-full animate-sparkle delay-700"></div>
            <div class="absolute bottom-1 right-2 w-1.5 h-1.5 bg-white/50 rounded-full animate-sparkle delay-500"></div>
            
            <!-- 可愛的邊框裝飾 -->
            <div class="absolute -top-0.5 -left-0.5 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-150"></div>
            
            <!-- 按鈕內容 -->
            <span class="relative z-10 flex items-center" style="gap: 10px;">
              <span class="text-lg hover-icon-left">✨</span>
              <span class="font-semibold">查看詳細資訊</span>
              <span class="text-lg hover-icon-right">💕</span>
            </span>
          </button>
        </div>
      </div>
      
      <!-- 背面 - 詳細資訊卡 -->
      <div class="card-back absolute inset-0 w-full h-full backface-hidden transform rotate-y-180">
        <div class="card-back-bg rounded-xl p-8 h-full flex flex-col shadow-lg overflow-y-auto"
        style="padding: 16px; gap: 10px;">
          <!-- 詳細資訊 -->
          <div class="flex flex-col items-center text-center mb-6">
            <h3 class="text-xl font-bold text-gray-800 mb-1 font-nunito">{{ employee.name }}</h3>
            <p class="text-pink-600 font-medium text-sm mb-4">{{ employee.title }}</p>
          </div>
          
          <!-- 喜歡的東西 -->
          <div v-if="employee.likes && employee.likes.length" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Heart class="w-4 h-4 mr-1 text-red-500" style="margin-right: 10px;" />
              喜歡的東西
            </h4>
            <div class="flex flex-wrap gap-2 justify-center">
              <span 
                v-for="like in employee.likes" 
                :key="like"
                class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
              >
                {{ like }}
              </span>
            </div>
          </div>
          
          <!-- 害怕的東西 -->
          <div v-if="employee.fears && employee.fears.length" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <AlertTriangle class="w-4 h-4 mr-1 text-orange-500" style="margin-right: 10px;" />
              害怕的東西
            </h4>
            <div class="flex flex-wrap gap-2 justify-center">
              <span 
                v-for="fear in employee.fears" 
                :key="fear"
                class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
              >
                {{ fear }}
              </span>
            </div>
          </div>
          
          <!-- 不吃的東西 -->
          <div v-if="employee.dislikes && employee.dislikes.length" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <XCircle class="w-4 h-4 mr-1 text-gray-500" style="margin-right: 10px;" />
              不吃的東西
            </h4>
            <div class="flex flex-wrap gap-2 justify-center">
              <span 
                v-for="dislike in employee.dislikes" 
                :key="dislike"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {{ dislike }}
              </span>
            </div>
          </div>
          
          <!-- 興趣愛好 -->
          <div v-if="employee.hobbies && employee.hobbies.length" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Star class="w-4 h-4 mr-1 text-yellow-500" style="margin-right: 10px;" />
              興趣愛好
            </h4>
            <div class="flex flex-wrap gap-2 justify-center">
              <span 
                v-for="hobby in employee.hobbies" 
                :key="hobby"
                class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"
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

.card-back-bg {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
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

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* 粉黃色系漸層按鈕 */
.yellow-gradient-button {
  background: linear-gradient(135deg, #fef3c7, #fde68a, #fcd34d);
  box-shadow: 0 4px 15px rgba(254, 243, 199, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: none;
}

.yellow-gradient-button:hover {
  background: linear-gradient(135deg, #fde68a, #fcd34d, #fbbf24);
  box-shadow: 0 6px 20px rgba(254, 243, 199, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Hover 時按鈕浮動動畫 */
.yellow-gradient-button:hover {
  animation: float 2s ease-in-out infinite;
}

/* Hover 時 icon 動畫 */
.yellow-gradient-button:hover .hover-icon-left {
  animation: bounce 1s infinite;
}

.yellow-gradient-button:hover .hover-icon-right {
  animation: bounce 1s infinite;
  animation-delay: 0.15s;
}
</style>
