<template>
  <div 
    ref="cardRef"
    class="employee-card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    @click="toggleFlip"
  >
    <div 
      class="card-inner relative w-full h-full"
      :class="{ 'is-flipped': isFlipped }"
    >
      <!-- 正面 -->
      <div class="card-front absolute inset-0 w-full h-full backface-hidden">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl transition-all duration-300">
          <!-- 頭像 -->
          <div class="relative mb-4">
            <img 
              :src="employee.avatar" 
              :alt="employee.name"
              class="w-20 h-20 rounded-full object-cover border-4 border-pink-200 shadow-md group-hover:animate-bounce cursor-pointer"
              @click.stop="showDetailCard"
            />
            <div class="absolute -top-1 -right-1 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center">
              <span class="text-white text-xs">💖</span>
            </div>
          </div>
          
          <!-- 姓名和職稱 -->
          <h3 class="text-xl font-bold text-gray-800 mb-1 font-nunito">{{ employee.name }}</h3>
          <p class="text-pink-600 font-medium text-sm mb-3">{{ employee.title }}</p>
          
          <!-- 簡介 -->
          <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {{ employee.description }}
          </p>
          
          <!-- 展開按鈕 -->
          <button class="w-full mx-2 bg-gradient-to-r from-pink-300 via-pink-400 to-purple-400 hover:from-pink-400 hover:via-pink-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 relative overflow-hidden group animate-float">
            <!-- 可愛的裝飾背景 -->
            <div class="absolute inset-0 bg-gradient-to-r from-pink-200/30 to-purple-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <!-- 閃爍的星星裝飾 -->
            <div class="absolute top-1 left-3 w-1.5 h-1.5 bg-white/50 rounded-full animate-sparkle"></div>
            <div class="absolute top-1 right-4 w-1 h-1 bg-white/50 rounded-full animate-sparkle delay-300"></div>
            <div class="absolute bottom-1 left-4 w-1 h-1 bg-white/50 rounded-full animate-sparkle delay-700"></div>
            <div class="absolute bottom-1 right-2 w-1.5 h-1.5 bg-white/50 rounded-full animate-sparkle delay-500"></div>
            
            <!-- 可愛的邊框裝飾 -->
            <div class="absolute -top-0.5 -left-0.5 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white/30 rounded-full animate-pulse delay-150"></div>
            
            <!-- 按鈕內容 -->
            <span class="relative z-10 flex items-center gap-1.5">
              <span class="text-lg animate-bounce">✨</span>
              <span class="font-semibold">查看詳細資訊</span>
              <span class="text-lg animate-bounce delay-150">💕</span>
            </span>
          </button>
        </div>
      </div>
      
      <!-- 背面 - 詳細資訊卡 -->
      <div class="card-back absolute inset-0 w-full h-full backface-hidden transform rotate-y-180">
        <div class="bg-gradient-to-br from-pink-100 to-mint-100 rounded-2xl p-6 h-full flex flex-col shadow-lg overflow-y-auto">
          <!-- 返回按鈕 -->
          <button 
            @click.stop="toggleFlip"
            class="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10 group"
          >
            <X class="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
          </button>
          
          <!-- 詳細資訊 -->
          <div class="flex flex-col items-center text-center mb-6">
            <img 
              :src="employee.avatar" 
              :alt="employee.name"
              class="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md mb-3"
            />
            <h3 class="text-xl font-bold text-gray-800 mb-1 font-nunito">{{ employee.name }}</h3>
            <p class="text-pink-600 font-medium text-sm mb-4">{{ employee.title }}</p>
          </div>
          
          <!-- 喜歡的東西 -->
          <div v-if="employee.likes && employee.likes.length" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Heart class="w-4 h-4 mr-1 text-red-500" />
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
              <AlertTriangle class="w-4 h-4 mr-1 text-orange-500" />
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
              <XCircle class="w-4 h-4 mr-1 text-gray-500" />
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
              <Star class="w-4 h-4 mr-1 text-yellow-500" />
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
          
          <!-- Email -->
          <div v-if="employee.email" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center justify-center">
              <Mail class="w-4 h-4 mr-1 text-blue-500" />
              聯絡方式
            </h4>
            <a 
              :href="`mailto:${employee.email}`"
              class="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
            >
              {{ employee.email }}
            </a>
          </div>
          
          <!-- 可愛裝飾 -->
          <div class="flex justify-center space-x-2 text-2xl mt-auto">
            <span>✨</span>
            <span>💕</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, Heart, AlertTriangle, XCircle, Star, Mail } from 'lucide-vue-next'
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
</style>
