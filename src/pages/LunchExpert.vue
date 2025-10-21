<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
    <!-- 返回按鈕 -->
    <div class="container mx-auto px-4 pt-6">
      <button 
        @click="goBack"
        class="back-button group"
      >
        <ArrowLeft class="w-5 h-5 mr-2" />
        返回首頁
      </button>
    </div>

    <!-- 網站標題 -->
    <header class="text-center py-8 px-4">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-nunito">
        午餐專家
        <span class="text-5xl">🍽️</span>
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        不知道午餐吃什麼？讓我們為您推薦美味選擇，解決每日的選擇困難！
      </p>
    </header>

    <!-- 主要功能區域 -->
    <main class="container mx-auto px-4 pb-12">
      <!-- 隨機推薦 -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Shuffle class="w-8 h-8 mr-3 text-orange-500" />
          今日推薦
        </h2>
        
        <div class="text-center">
          <div v-if="!currentRecommendation" class="py-12">
            <div class="text-6xl mb-4">🤔</div>
            <p class="text-gray-600 text-lg">點擊下方按鈕獲取今日推薦！</p>
          </div>
          
          <div v-else class="py-8">
            <div class="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 mb-6">
              <div class="text-4xl mb-4">{{ currentRecommendation.emoji }}</div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ currentRecommendation.name }}</h3>
              <p class="text-gray-600 mb-4">{{ currentRecommendation.description }}</p>
              <div class="flex justify-center space-x-4">
                <span class="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {{ currentRecommendation.category }}
                </span>
                <span class="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                  ${{ currentRecommendation.price }}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            @click="getRandomRecommendation"
            class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Shuffle class="w-6 h-6 inline mr-2" />
            給我一個推薦！
          </button>
        </div>
      </div>

      <!-- 分類選擇 -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Filter class="w-8 h-8 mr-3 text-blue-500" />
          按分類選擇
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="getRecommendationByCategory(category)"
            class="category-button"
            :class="{ 'active': selectedCategory === category }"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 餐廳清單 -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <MapPin class="w-8 h-8 mr-3 text-red-500" />
          附近餐廳
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="restaurant in restaurants" 
            :key="restaurant.id"
            class="restaurant-card"
          >
            <div class="text-3xl mb-3">{{ restaurant.emoji }}</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">{{ restaurant.name }}</h3>
            <p class="text-gray-600 text-sm mb-3">{{ restaurant.description }}</p>
            <div class="flex justify-between items-center">
              <span class="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">
                {{ restaurant.category }}
              </span>
              <span class="text-green-600 font-semibold">${{ restaurant.price }}</span>
            </div>
            <div class="mt-3 text-xs text-gray-500">
              <MapPin class="w-4 h-4 inline mr-1" />
              {{ restaurant.location }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 可愛裝飾 -->
    <div class="fixed top-10 left-10 text-2xl animate-pulse">🍜</div>
    <div class="fixed top-20 right-20 text-xl animate-bounce">🍕</div>
    <div class="fixed bottom-20 left-20 text-2xl animate-pulse">🍱</div>
    <div class="fixed bottom-10 right-10 text-xl animate-bounce">🥘</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Shuffle, Filter, MapPin } from 'lucide-vue-next'

const router = useRouter()

// 資料
const currentRecommendation = ref<any>(null)
const selectedCategory = ref('')

const categories = ['中式', '西式', '日式', '韓式', '泰式', '義式', '美式', '素食']

const restaurants = ref([
  {
    id: 1,
    name: '老王牛肉麵',
    emoji: '🍜',
    category: '中式',
    description: '傳統台灣牛肉麵，湯頭濃郁',
    price: '120-180',
    location: '步行5分鐘'
  },
  {
    id: 2,
    name: '麥當勞',
    emoji: '🍔',
    category: '美式',
    description: '經典美式速食，快速方便',
    price: '80-150',
    location: '步行3分鐘'
  },
  {
    id: 3,
    name: '壽司郎',
    emoji: '🍣',
    category: '日式',
    description: '新鮮壽司，迴轉壽司體驗',
    price: '200-400',
    location: '步行8分鐘'
  },
  {
    id: 4,
    name: '韓式烤肉',
    emoji: '🥩',
    category: '韓式',
    description: '正宗韓式烤肉，小菜豐富',
    price: '300-500',
    location: '步行10分鐘'
  },
  {
    id: 5,
    name: '義大利麵',
    emoji: '🍝',
    category: '義式',
    description: '手工義大利麵，醬汁濃郁',
    price: '150-250',
    location: '步行6分鐘'
  },
  {
    id: 6,
    name: '素食餐廳',
    emoji: '🥗',
    category: '素食',
    description: '健康素食，營養均衡',
    price: '100-200',
    location: '步行7分鐘'
  }
])

const recommendations = [
  {
    name: '老王牛肉麵',
    emoji: '🍜',
    category: '中式',
    description: '傳統台灣牛肉麵，湯頭濃郁，麵條Q彈',
    price: '120-180'
  },
  {
    name: '麥當勞',
    emoji: '🍔',
    category: '美式',
    description: '經典美式速食，快速方便，選擇多樣',
    price: '80-150'
  },
  {
    name: '壽司郎',
    emoji: '🍣',
    category: '日式',
    description: '新鮮壽司，迴轉壽司體驗，品質保證',
    price: '200-400'
  },
  {
    name: '韓式烤肉',
    emoji: '🥩',
    category: '韓式',
    description: '正宗韓式烤肉，小菜豐富，氣氛熱鬧',
    price: '300-500'
  },
  {
    name: '義大利麵',
    emoji: '🍝',
    category: '義式',
    description: '手工義大利麵，醬汁濃郁，口感豐富',
    price: '150-250'
  },
  {
    name: '素食餐廳',
    emoji: '🥗',
    category: '素食',
    description: '健康素食，營養均衡，清爽無負擔',
    price: '100-200'
  },
  {
    name: '泰式料理',
    emoji: '🌶️',
    category: '泰式',
    description: '酸辣泰式料理，香料豐富，開胃下飯',
    price: '180-280'
  },
  {
    name: '美式漢堡',
    emoji: '🍔',
    category: '美式',
    description: '厚實美式漢堡，配料豐富，份量十足',
    price: '120-200'
  }
]

// 方法
const goBack = () => {
  router.push('/')
}

const getRandomRecommendation = () => {
  const randomIndex = Math.floor(Math.random() * recommendations.length)
  currentRecommendation.value = recommendations[randomIndex]
  selectedCategory.value = ''
}

const getRecommendationByCategory = (category: string) => {
  selectedCategory.value = category
  const categoryRecommendations = recommendations.filter(r => r.category === category)
  if (categoryRecommendations.length > 0) {
    const randomIndex = Math.floor(Math.random() * categoryRecommendations.length)
    currentRecommendation.value = categoryRecommendations[randomIndex]
  }
}

onMounted(() => {
  // 預設推薦一個
  getRandomRecommendation()
})
</script>

<style scoped>
/* 返回按鈕樣式 */
.back-button {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: linear-gradient(135deg, #fde68a, #fcd34d);
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.15);
}

.back-button:hover svg {
  transform: translateX(-4px);
}

.back-button svg {
  transition: transform 0.3s ease;
}

/* 分類按鈕 */
.category-button {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-button:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  transform: translateY(-2px);
}

.category-button.active {
  border-color: #f59e0b;
  background: #fef3c7;
  color: #92400e;
}

/* 餐廳卡片 */
.restaurant-card {
  background: linear-gradient(135deg, #fefbf3, #fef3c7);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  border-color: #f59e0b;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* 確保內容在裝飾之上 */
main {
  position: relative;
  z-index: 10;
}

header {
  position: relative;
  z-index: 10;
}
</style>
