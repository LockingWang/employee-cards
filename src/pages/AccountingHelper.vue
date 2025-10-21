<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
        記帳小幫手
        <span class="text-5xl">💰</span>
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        輕鬆管理您的財務，記錄收支，分析消費習慣，讓理財變得簡單！
      </p>
    </header>

    <!-- 主要功能區域 -->
    <main class="container mx-auto px-4 pb-12">
      <!-- 快速記帳 -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <PlusCircle class="w-8 h-8 mr-3 text-green-500" />
          快速記帳
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 收入 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-green-600">收入</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">金額</label>
                <input 
                  v-model="incomeAmount"
                  type="number"
                  placeholder="輸入金額"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">類別</label>
                <select 
                  v-model="incomeCategory"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">選擇類別</option>
                  <option value="薪資">薪資</option>
                  <option value="獎金">獎金</option>
                  <option value="投資">投資</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <input 
                  v-model="incomeNote"
                  type="text"
                  placeholder="備註說明"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button 
                @click="addIncome"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                記錄收入
              </button>
            </div>
          </div>

          <!-- 支出 -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-red-600">支出</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">金額</label>
                <input 
                  v-model="expenseAmount"
                  type="number"
                  placeholder="輸入金額"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">類別</label>
                <select 
                  v-model="expenseCategory"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">選擇類別</option>
                  <option value="餐飲">餐飲</option>
                  <option value="交通">交通</option>
                  <option value="購物">購物</option>
                  <option value="娛樂">娛樂</option>
                  <option value="醫療">醫療</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <input 
                  v-model="expenseNote"
                  type="text"
                  placeholder="備註說明"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button 
                @click="addExpense"
                class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                記錄支出
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 統計概覽 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">${{ totalIncome.toLocaleString() }}</div>
          <div class="text-gray-600">本月收入</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold text-red-600 mb-2">${{ totalExpense.toLocaleString() }}</div>
          <div class="text-gray-600">本月支出</div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
          <div class="text-3xl font-bold" :class="balance >= 0 ? 'text-green-600' : 'text-red-600'">
            ${{ balance.toLocaleString() }}
          </div>
          <div class="text-gray-600">本月結餘</div>
        </div>
      </div>

      <!-- 最近記錄 -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <History class="w-8 h-8 mr-3 text-blue-500" />
          最近記錄
        </h2>
        
        <div v-if="records.length === 0" class="text-center py-8 text-gray-500">
          還沒有任何記錄，開始記帳吧！
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="record in records.slice(0, 10)" 
            :key="record.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <div 
                class="w-3 h-3 rounded-full mr-3"
                :class="record.type === 'income' ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              <div>
                <div class="font-semibold">{{ record.category }}</div>
                <div class="text-sm text-gray-600">{{ record.note }}</div>
              </div>
            </div>
            <div class="text-right">
              <div 
                class="font-bold"
                :class="record.type === 'income' ? 'text-green-600' : 'text-red-600'"
              >
                {{ record.type === 'income' ? '+' : '-' }}${{ record.amount.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-500">{{ formatDate(record.date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 可愛裝飾 -->
    <div class="fixed top-10 left-10 text-2xl animate-pulse">💰</div>
    <div class="fixed top-20 right-20 text-xl animate-bounce">📊</div>
    <div class="fixed bottom-20 left-20 text-2xl animate-pulse">💳</div>
    <div class="fixed bottom-10 right-10 text-xl animate-bounce">📈</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, PlusCircle, History } from 'lucide-vue-next'

const router = useRouter()

// 表單資料
const incomeAmount = ref('')
const incomeCategory = ref('')
const incomeNote = ref('')
const expenseAmount = ref('')
const expenseCategory = ref('')
const expenseNote = ref('')

// 記錄資料
const records = ref<Array<{
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  note: string
  date: Date
}>>([])

// 計算屬性
const totalIncome = computed(() => {
  return records.value
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0)
})

const totalExpense = computed(() => {
  return records.value
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0)
})

const balance = computed(() => {
  return totalIncome.value - totalExpense.value
})

// 方法
const goBack = () => {
  router.push('/')
}

const addIncome = () => {
  if (!incomeAmount.value || !incomeCategory.value) return
  
  records.value.unshift({
    id: Date.now().toString(),
    type: 'income',
    amount: Number(incomeAmount.value),
    category: incomeCategory.value,
    note: incomeNote.value,
    date: new Date()
  })
  
  // 清空表單
  incomeAmount.value = ''
  incomeCategory.value = ''
  incomeNote.value = ''
}

const addExpense = () => {
  if (!expenseAmount.value || !expenseCategory.value) return
  
  records.value.unshift({
    id: Date.now().toString(),
    type: 'expense',
    amount: Number(expenseAmount.value),
    category: expenseCategory.value,
    note: expenseNote.value,
    date: new Date()
  })
  
  // 清空表單
  expenseAmount.value = ''
  expenseCategory.value = ''
  expenseNote.value = ''
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 載入範例資料
  records.value = [
    {
      id: '1',
      type: 'income',
      amount: 50000,
      category: '薪資',
      note: '月薪',
      date: new Date()
    },
    {
      id: '2',
      type: 'expense',
      amount: 1200,
      category: '餐飲',
      note: '午餐',
      date: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      type: 'expense',
      amount: 300,
      category: '交通',
      note: '捷運',
      date: new Date(Date.now() - 172800000)
    }
  ]
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
