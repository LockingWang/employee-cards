<template>
  <div class="warroom-container">
    <!-- 返回按鈕 -->
    <div class="container">
      <button 
        @click="goBack"
        class="back-button"
      >
        <ArrowLeft class="icon-sm" />
        返回首頁
      </button>
    </div>

    <!-- 網站標題 -->
    <header class="header">
      <h1 class="main-title">
        戰情室
        <span class="title-emoji">🎯</span>
      </h1>
      <p class="subtitle">
        即時監控伺服器狀態，確保系統穩定運行
      </p>
    </header>

    <!-- 主要功能區域 -->
    <main class="main-content">
      <!-- 總覽儀表板 -->
      <div class="stats-grid">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">✅</div>
          <div class="stat-value stat-value-green">{{ onlineCount }}</div>
          <div class="stat-label stat-label-green">正常運行</div>
        </div>
        <div class="stat-card stat-card-red">
          <div class="stat-icon">❌</div>
          <div class="stat-value stat-value-red">{{ offlineCount }}</div>
          <div class="stat-label stat-label-red">異常停止</div>
        </div>
        <div class="stat-card stat-card-yellow">
          <div class="stat-icon">⏱️</div>
          <div class="stat-value stat-value-yellow">{{ averageResponseTime }}ms</div>
          <div class="stat-label stat-label-yellow">平均回應時間</div>
        </div>
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">🔄</div>
          <div class="stat-value stat-value-blue">{{ servers.length }}</div>
          <div class="stat-label stat-label-blue">監控伺服器數</div>
        </div>
      </div>

      <!-- 監控設定 -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <Settings class="icon-md icon-blue" />
            監控設定
          </h2>
          <div class="button-group">
            <button 
              @click="toggleAutoRefresh"
              :class="['toggle-button', autoRefresh ? 'toggle-active' : 'toggle-inactive']"
            >
              <RefreshCw :class="['icon-sm', autoRefresh && 'spin-animation']" />
              {{ autoRefresh ? '自動刷新中' : '手動模式' }}
            </button>
            <button 
              @click="toggleSound"
              :class="['toggle-button', soundEnabled ? 'toggle-active' : 'toggle-inactive']"
              :title="soundEnabled ? '點擊關閉錯誤提示音' : '點擊開啟錯誤提示音'"
            >
              <Volume2 v-if="soundEnabled" class="icon-sm" />
              <VolumeX v-else class="icon-sm" />
              {{ soundEnabled ? '音效開啟' : '音效關閉' }}
            </button>
            <button 
              @click="checkAllServers"
              :disabled="isChecking"
              class="check-button"
            >
              <Activity class="icon-sm" />
              立即檢查
            </button>
            <button 
              @click="testWriteLog"
              class="test-log-button"
              title="測試寫入 LOG 到 Google Sheets"
            >
              <Server class="icon-sm" />
              測試 LOG
            </button>
            <button 
              @click="openLogSheet"
              class="open-log-button"
              title="在新視窗開啟 Google Sheets LOG"
            >
              <ExternalLink class="icon-sm" />
              前往 LOG
            </button>
          </div>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              刷新間隔（秒）
            </label>
            <input 
              v-model.number="refreshInterval"
              type="number"
              min="5"
              max="300"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">
              超時時間（毫秒）
            </label>
            <input 
              v-model.number="timeout"
              type="number"
              min="1000"
              max="30000"
              step="1000"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- 伺服器狀態列表 -->
      <div class="section-card">
        <h2 class="section-title section-title-large">
          <Server class="icon-md icon-purple" />
          伺服器狀態監控
        </h2>
        
        <div class="server-list">
          <div 
            v-for="server in servers" 
            :key="server.id"
            :class="['server-card', getServerCardClass(server)]"
          >
            <div class="server-info-row">
              <div class="server-info-content">
                <div class="status-indicator" :class="getStatusClass(server)">
                  <div v-if="server.status === 'online'" class="status-emoji">✅</div>
                  <div v-else-if="server.status === 'offline'" class="status-emoji">❌</div>
                  <div v-else class="status-emoji">⏳</div>
                </div>
                
                <div class="server-details">
                  <div class="server-header">
                    <h3 class="server-name">{{ server.name }}</h3>
                    <div class="server-actions">
                      <span v-if="server.responseTime" class="response-time">
                        <Clock class="icon-xs" />
                        {{ server.responseTime }}ms
                      </span>
                      <button 
                        @click="removeServer(server.id)"
                        class="delete-button"
                        title="刪除"
                      >
                        <Trash2 class="icon-xs" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="server-url-row">
                    <span class="method-badge" :class="server.method === 'POST' ? 'method-post' : 'method-get'">
                      {{ server.method || 'GET' }}
                    </span>
                    <p class="server-url">{{ server.url }}</p>
                  </div>
                  
                  <div class="server-meta">
                    <span class="meta-text">
                      最後檢查：{{ formatTime(server.lastCheck) }}
                    </span>
                    <span v-if="server.uptime !== undefined" class="meta-text">
                      可用率：{{ server.uptime.toFixed(1) }}%
                    </span>
                  </div>
                  
                  <div v-if="server.error" class="error-message">
                    錯誤：{{ server.error }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 狀態歷史圖表 -->
            <div class="history-section">
              <div class="history-container">
                <span class="history-label">歷史紀錄：</span>
                <div 
                  v-for="(history, index) in server.history" 
                  :key="index"
                  :class="['history-bar', history ? 'history-online' : 'history-offline']"
                  :title="history ? '正常' : '異常'"
                ></div>
              </div>
            </div>
          </div>
          
          <div v-if="servers.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <p class="empty-title">沒有監控伺服器</p>
            <p class="empty-subtitle">請聯繫管理員新增監控端點</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 可愛裝飾 -->
    <div class="decoration decoration-1">🖥️</div>
    <div class="decoration decoration-2">⚡</div>
    <div class="decoration decoration-3">📊</div>
    <div class="decoration decoration-4">🔔</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, Settings, RefreshCw, Activity, Server, 
  Clock, Trash2, ExternalLink, Volume2, VolumeX
} from 'lucide-vue-next'
import { createGoogleSheetsService, defaultGoogleSheetsConfig, type ApiLog } from '../services/googleSheets'

const router = useRouter()

// 初始化 Google Sheets 服務（用於寫入 LOG）
const googleSheetsService = createGoogleSheetsService(defaultGoogleSheetsConfig)

interface ServerStatus {
  id: number
  name: string
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: string
  status: 'online' | 'offline' | 'checking'
  responseTime: number | null
  lastCheck: Date | null
  error: string | null
  uptime: number
  history: boolean[] // true = online, false = offline
}

// 資料
const servers = ref<ServerStatus[]>([
  {
    id: 1,
    name: 'CC API 伺服器',
    url: 'https://ccserversq.cloudxurf.com.tw/CCAPI.ashx?TaskKindID=1&OrderID=001&ShopInfo={"HWInfo": "F00B744E-708A-43CE-BB9E-7C2E78EA9436"}',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'Data=[{"GroupID":"001","Data":{"Orders":[],"Checks":[],"Orders_Day":[],"Invoice_Day":[],"Invoice":[],"Items":[],"Agio":[],"Items_Day":[],"Checks_Day":[],"InvoiceIDValues":[]}}]',
    status: 'checking',
    responseTime: null,
    lastCheck: null,
    error: null,
    uptime: 100,
    history: []
  },
  {
    id: 2,
    name: 'APP Member API',
    url: 'https://appsq.cloudxurf.com.tw/Public/APPMember.ashx',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'act=GetOrderList&EnterPriseID=xurf&ShopID=A002&srow=1&erow=10000&BTakeWayTime2=20251023&ETakeWayTime2=20251023',
    status: 'checking',
    responseTime: null,
    lastCheck: null,
    error: null,
    uptime: 100,
    history: []
  }
])

const autoRefresh = ref(true)
const refreshInterval = ref(30) // 秒
const timeout = ref(5000) // 毫秒
const isChecking = ref(false)
const soundEnabled = ref(true) // 音效開關
let intervalId: number | null = null

// 計算屬性
const onlineCount = computed(() => 
  servers.value.filter(s => s.status === 'online').length
)

const offlineCount = computed(() => 
  servers.value.filter(s => s.status === 'offline').length
)

const averageResponseTime = computed(() => {
  const onlineServers = servers.value.filter(s => s.status === 'online' && s.responseTime)
  if (onlineServers.length === 0) return 0
  const sum = onlineServers.reduce((acc, s) => acc + (s.responseTime || 0), 0)
  return Math.round(sum / onlineServers.length)
})

// 方法
const goBack = () => {
  router.push('/')
}

const checkServer = async (server: ServerStatus) => {
  server.status = 'checking'
  server.error = null
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout.value)
    
    // 準備請求選項
    const fetchOptions: RequestInit = {
      method: server.method || 'GET',
      signal: controller.signal,
      mode: 'cors'
    }
    
    // 添加 headers
    if (server.headers) {
      fetchOptions.headers = server.headers
    }
    
    // 添加 body（僅適用於 POST 請求）
    if (server.method === 'POST' && server.body) {
      fetchOptions.body = server.body
    }
    
    const response = await fetch(server.url, fetchOptions)
    
    clearTimeout(timeoutId)
    
    const responseTime = Date.now() - startTime
    
    if (response.ok) {
      server.status = 'online'
      server.responseTime = responseTime
      server.lastCheck = new Date()
      server.history.push(true)
    } else {
      // 處理 HTTP 錯誤狀態碼
      const statusMessages: Record<number, string> = {
        400: '錯誤的請求',
        401: '未經授權',
        403: '禁止存取',
        404: '找不到資源',
        500: '伺服器內部錯誤',
        502: '閘道錯誤',
        503: '服務無法使用',
        504: '閘道超時'
      }
      const message = statusMessages[response.status] || response.statusText
      const errorMsg = `HTTP ${response.status}: ${message}`
      
      // 寫入錯誤 LOG
      writeErrorLog(server, response.status, errorMsg, responseTime)
      
      throw new Error(errorMsg)
    }
  } catch (error: any) {
    server.status = 'offline'
    server.responseTime = null
    server.lastCheck = new Date()
    server.history.push(false)
    
    let errorMessage = ''
    if (error.name === 'AbortError') {
      errorMessage = '請求超時（客戶端）'
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'CORS 錯誤或網路問題'
    } else {
      errorMessage = error.message
    }
    
    server.error = errorMessage
    
    // 寫入錯誤 LOG（如果還沒寫入的話）
    if (!error.message.startsWith('HTTP')) {
      writeErrorLog(server, undefined, errorMessage, null)
    }
  }
  
  // 保留最近 30 筆歷史紀錄
  if (server.history.length > 30) {
    server.history.shift()
  }
  
  // 計算可用率
  if (server.history.length > 0) {
    const onlineCount = server.history.filter(h => h).length
    server.uptime = (onlineCount / server.history.length) * 100
  }
}

const checkAllServers = async () => {
  isChecking.value = true
  await Promise.all(servers.value.map(server => checkServer(server)))
  isChecking.value = false
}

const removeServer = (id: number) => {
  if (confirm('確定要刪除這個伺服器監控嗎？')) {
    servers.value = servers.value.filter(s => s.id !== id)
  }
}

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  if (autoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value
  // 測試播放一次提示音
  if (soundEnabled.value) {
    playErrorSound()
  }
}

const startAutoRefresh = () => {
  stopAutoRefresh()
  intervalId = window.setInterval(() => {
    checkAllServers()
  }, refreshInterval.value * 1000)
}

const stopAutoRefresh = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const getStatusClass = (server: ServerStatus) => {
  switch (server.status) {
    case 'online':
      return 'status-online'
    case 'offline':
      return 'status-offline'
    default:
      return 'status-checking'
  }
}

const getServerCardClass = (server: ServerStatus) => {
  switch (server.status) {
    case 'online':
      return 'server-card-online'
    case 'offline':
      return 'server-card-offline'
    default:
      return 'server-card-checking'
  }
}

const formatTime = (date: Date | null) => {
  if (!date) return '尚未檢查'
  return date.toLocaleTimeString('zh-TW')
}

/**
 * 播放錯誤提示音
 */
const playErrorSound = () => {
  if (!soundEnabled.value) return
  
  try {
    // 使用 Web Audio API 生成簡單的提示音
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // 設定音效參數
    oscillator.frequency.value = 800 // 頻率 (Hz)
    oscillator.type = 'sine' // 音波類型
    
    // 音量淡出效果
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    // 播放音效
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
    
    // 清理資源
    setTimeout(() => {
      audioContext.close()
    }, 1000)
  } catch (error) {
    console.error('播放音效失敗:', error)
  }
}

/**
 * 寫入錯誤 LOG 到 Google Sheets
 */
const writeErrorLog = (server: ServerStatus, httpStatus: number | undefined, errorMessage: string, responseTime: number | null) => {
  const log: ApiLog = {
    timestamp: new Date().toLocaleString('zh-TW', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }),
    apiName: server.name,
    method: server.method || 'GET',
    url: server.url,
    status: 'error',
    httpStatus: httpStatus,
    responseTime: responseTime || undefined,
    errorMessage: errorMessage
  }
  
  // 播放錯誤提示音
  playErrorSound()
  
  // 非同步寫入 LOG，不影響主流程
  googleSheetsService.writeApiLog(log).catch(err => {
    console.error('Failed to write log:', err)
  })
}

/**
 * 測試寫入 LOG 功能
 */
const testWriteLog = () => {
  const testLog: ApiLog = {
    timestamp: new Date().toLocaleString('zh-TW', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }),
    apiName: '測試 API',
    method: 'POST',
    url: 'https://test.example.com/api/endpoint',
    status: 'error',
    httpStatus: 500,
    responseTime: 1234,
    errorMessage: 'HTTP 500: 伺服器內部錯誤（這是測試記錄）'
  }
  
  googleSheetsService.writeApiLog(testLog)
    .then(() => {
      alert('✅ 測試 LOG 已寫入！請檢查 Google Sheets 的 API_LOG 工作表')
    })
    .catch(err => {
      console.error('測試 LOG 寫入失敗:', err)
      alert('❌ 測試 LOG 寫入失敗，請檢查 Console')
    })
}

/**
 * 開啟 Google Sheets LOG 工作表
 */
const openLogSheet = () => {
  const logSheetUrl = 'https://docs.google.com/spreadsheets/d/1yfnfScBaWhpXhWdpNEcOSPA77SDwJjHqxFfpsmx-4aY/edit?gid=1144159058#gid=1144159058'
  window.open(logSheetUrl, '_blank')
}

// 監聽刷新間隔變化
watch(refreshInterval, () => {
  // 如果自動刷新是開啟的，重新啟動定時器以使用新的間隔時間
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

// 生命週期
onMounted(() => {
  checkAllServers()
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
/* 主容器 */
.warroom-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem 0;
}

/* 標題區域 */
.header {
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
  z-index: 10;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  font-family: 'Nunito', sans-serif;
}

.title-emoji {
  font-size: 3rem;
  margin-left: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #475569;
  max-width: 42rem;
  margin: 0 auto;
}

/* 主要內容區域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 3rem;
  position: relative;
  z-index: 10;
}

/* 返回按鈕樣式 */
.back-button {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: #334155;
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
  background: linear-gradient(135deg, #cbd5e1, #94a3b8);
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.15);
}

.back-button:hover .icon-sm {
  transform: translateX(-4px);
}

/* 圖標尺寸 */
.icon-xs {
  width: 1rem;
  height: 1rem;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.25rem;
}

.icon-sm {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;
  transition: transform 0.3s ease;
}

.icon-md {
  width: 2rem;
  height: 2rem;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.75rem;
}

.icon-blue {
  color: #3b82f6;
}

.icon-green {
  color: #22c55e;
}

.icon-purple {
  color: #a855f7;
}

/* 統計卡片網格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

/* 統計卡片 */
.stat-card {
  background: white;
  border: 2px solid;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stat-card-green {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.stat-card-red {
  background: #fef2f2;
  border-color: #fecaca;
}

.stat-card-yellow {
  background: #fefce8;
  border-color: #fde047;
}

.stat-card-blue {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-value-green {
  color: #15803d;
}

.stat-value-red {
  color: #b91c1c;
}

.stat-value-yellow {
  color: #a16207;
}

.stat-value-blue {
  color: #1d4ed8;
}

.stat-label {
  font-size: 0.875rem;
}

.stat-label-green {
  color: #16a34a;
}

.stat-label-red {
  color: #dc2626;
}

.stat-label-yellow {
  color: #ca8a04;
}

.stat-label-blue {
  color: #2563eb;
}

/* 區塊卡片 */
.section-card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  margin: 0;
}

.section-title-large {
  margin-bottom: 1.5rem;
}

/* 按鈕群組 */
.button-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.toggle-active {
  background: #22c55e;
  color: white;
}

.toggle-inactive {
  background: #d1d5db;
  color: #4b5563;
}

.toggle-button:hover {
  opacity: 0.9;
}

.check-button {
  background: #3b82f6;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.check-button:hover {
  background: #2563eb;
}

.check-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-log-button {
  background: #8b5cf6;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.test-log-button:hover {
  background: #7c3aed;
}

.open-log-button {
  background: #10b981;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.open-log-button:hover {
  background: #059669;
}

.spin-animation {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 表單網格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

/* 伺服器列表 */
.server-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 伺服器卡片 */
.server-card {
  background: white;
  border: 2px solid;
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.server-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.server-card-online {
  border-color: #bbf7d0;
  background: rgba(240, 253, 244, 0.5);
}

.server-card-offline {
  border-color: #fecaca;
  background: rgba(254, 242, 242, 0.5);
}

.server-card-checking {
  border-color: #fde047;
  background: rgba(254, 252, 232, 0.5);
}

.server-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.server-info-content {
  display: flex;
  align-items: center;
  flex: 1;
}

/* 狀態指示器 */
.status-indicator {
  width: 60px;
  height: 60px;
  border: 3px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-online {
  background: #dcfce7;
  border-color: #4ade80;
}

.status-offline {
  background: #fee2e2;
  border-color: #f87171;
}

.status-checking {
  background: #fef9c3;
  border-color: #facc15;
}

.status-emoji {
  font-size: 1.5rem;
}

/* 伺服器詳情 */
.server-details {
  flex: 1;
  margin-left: 1rem;
}

.server-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.server-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.server-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.response-time {
  font-size: 0.875rem;
  color: #475569;
  display: inline-flex;
  align-items: center;
}

.delete-button {
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.delete-button:hover {
  color: #b91c1c;
}

.server-url-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.method-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.method-get {
  background: #dbeafe;
  color: #1e40af;
}

.method-post {
  background: #dcfce7;
  color: #166534;
}

.server-url {
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
  word-break: break-all;
  flex: 1;
}

.server-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
}

.meta-text {
  margin: 0;
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
  background: #fef2f2;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

/* 歷史紀錄區域 */
.history-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.history-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.history-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-right: 0.5rem;
}

.history-bar {
  width: 0.5rem;
  height: 1.5rem;
  border-radius: 0.125rem;
}

.history-online {
  background: #22c55e;
}

.history-offline {
  background: #ef4444;
}

/* 空狀態 */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  color: #475569;
  font-size: 1.125rem;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

/* 裝飾元素 */
.decoration {
  position: fixed;
  font-size: 2rem;
  opacity: 0.3;
  z-index: 1;
}

.decoration-1 {
  top: 2.5rem;
  left: 2.5rem;
  animation: pulse-decoration 3s ease-in-out infinite;
}

.decoration-2 {
  top: 5rem;
  right: 5rem;
  animation: bounce-decoration 2s ease-in-out infinite;
}

.decoration-3 {
  bottom: 5rem;
  left: 5rem;
  animation: pulse-decoration 3s ease-in-out infinite 1s;
}

.decoration-4 {
  bottom: 2.5rem;
  right: 2.5rem;
  animation: bounce-decoration 2s ease-in-out infinite 0.5s;
}

@keyframes pulse-decoration {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes bounce-decoration {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }
  
  .title-emoji {
    font-size: 2.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .toggle-button,
  .check-button,
  .test-log-button,
  .open-log-button {
    width: 100%;
    justify-content: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .server-info-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .server-details {
    margin-left: 0;
    margin-top: 1rem;
    width: 100%;
  }
  
  .decoration {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.75rem;
  }
  
  .section-card {
    padding: 1rem;
  }
  
  .server-card {
    padding: 1rem;
  }
  
  .status-indicator {
    width: 50px;
    height: 50px;
  }
}
</style>

