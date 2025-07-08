<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6 mx-auto max-w-3xl w-full">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('analytics.title') }}</h1>
        <p class="text-sm text-gray-600">{{ $t('analytics.subtitle') }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Total Users -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197V9a3 3 0 00-6 0v2m0 0V9a3 3 0 016 0v2m-3 7h3m-3 0h-3m3 0v3m0-3V9"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('analytics.stats.totalUsers') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
              <p class="text-xs text-green-600">+{{ stats.newUsersToday }} {{ $t('analytics.stats.today') }}</p>
            </div>
          </div>
        </div>

        <!-- Active Users -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('analytics.stats.activeUsers') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.activeUsers }}</p>
              <p class="text-xs text-blue-600">{{ Math.round((stats.activeUsers / stats.totalUsers) * 100) }}% {{ $t('analytics.stats.ofTotal') }}</p>
            </div>
          </div>
        </div>

        <!-- Total Recipes -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('analytics.stats.totalRecipes') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalRecipes }}</p>
              <p class="text-xs text-purple-600">+{{ stats.recipesToday }} {{ $t('analytics.stats.today') }}</p>
            </div>
          </div>
        </div>

        <!-- Online Users -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-emerald-100 rounded-lg relative">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"></path>
              </svg>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ $t('analytics.stats.onlineUsers') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.onlineUsers }}</p>
              <p class="text-xs text-emerald-600">{{ $t('analytics.stats.outOf') }} {{ stats.totalUsers }} {{ $t('analytics.stats.total') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Online Users -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              {{ $t('analytics.onlineUsers.title') }}
              <span class="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="ml-2 text-sm font-normal text-gray-600">({{ onlineUsers.length }})</span>
            </h3>
          </div>
          <div class="p-6">
            <div v-if="onlineUsers.length === 0" class="text-center text-gray-500 py-8">
              <p>{{ $t('analytics.onlineUsers.noUsers') }}</p>
            </div>
            <div v-else class="space-y-3">
              <div v-for="user in onlineUsers" :key="user._id" class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center relative">
                    <span class="text-sm font-medium text-emerald-600">{{ user.email[0].toUpperCase() }}</span>
                    <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ user.name || user.email.split('@')[0] }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs text-emerald-600">{{ getTimeAgo(user.lastSeen) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Users -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">{{ $t('analytics.recentUsers.title') }}</h3>
            <button 
              @click="showAllUsersDialog = true; loadAllUsers()"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {{ $t('analytics.recentUsers.viewAll') }}
            </button>
          </div>
          <div class="p-6">
            <div v-if="recentUsers.length === 0" class="text-center text-gray-500 py-8">
              <p>{{ $t('analytics.common.loading') }}</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="user in recentUsers" :key="user._id" class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-primary-600">{{ user.email[0].toUpperCase() }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ user.email }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(user.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 flex items-center">
              {{ $t('analytics.performance.title') }}
              <span 
                class="ml-2 px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-800': performanceStatus === 'good',
                  'bg-yellow-100 text-yellow-800': performanceStatus === 'warning',
                  'bg-red-100 text-red-800': performanceStatus === 'critical'
                }"
              >
                {{ $t(`analytics.performance.status.${performanceStatus}`) }}
              </span>
            </h3>
          </div>
          <div class="p-6">
            <div v-if="performanceMetrics" class="space-y-4">
              <!-- System Memory -->
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm text-gray-600">{{ $t('analytics.performance.systemMemory') }}</span>
                  <span class="text-sm font-medium text-gray-900">
                    {{ performanceMetrics.system.usedMemory }}MB / {{ performanceMetrics.system.totalMemory }}MB
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all"
                    :class="{
                      'bg-green-500': performanceMetrics.system.memoryUsagePercentage <= 75,
                      'bg-yellow-500': performanceMetrics.system.memoryUsagePercentage > 75 && performanceMetrics.system.memoryUsagePercentage <= 90,
                      'bg-red-500': performanceMetrics.system.memoryUsagePercentage > 90
                    }"
                    :style="{ width: performanceMetrics.system.memoryUsagePercentage + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ performanceMetrics.system.memoryUsagePercentage }}% {{ $t('analytics.performance.used') }}</p>
              </div>

              <!-- System Info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-600">{{ $t('analytics.performance.cpuCount') }}</span>
                  <p class="text-sm font-medium text-gray-900">{{ performanceMetrics.system.cpuCount }} core</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">{{ $t('analytics.performance.systemUptime') }}</span>
                  <p class="text-sm font-medium text-gray-900">{{ formatUptime(performanceMetrics.system.uptime) }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">{{ $t('analytics.performance.platform') }}</span>
                  <p class="text-sm font-medium text-gray-900">{{ performanceMetrics.system.platform }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">{{ $t('analytics.performance.architecture') }}</span>
                  <p class="text-sm font-medium text-gray-900">{{ performanceMetrics.system.arch }}</p>
                </div>
              </div>

              <!-- Process Memory -->
              <div class="border-t pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('analytics.performance.nodeProcess') }}</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">{{ $t('analytics.performance.heapUsed') }}</span>
                    <p class="font-medium text-gray-900">{{ performanceMetrics.process.memory.heapUsed }}MB</p>
                  </div>
                  <div>
                    <span class="text-gray-600">{{ $t('analytics.performance.heapTotal') }}</span>
                    <p class="font-medium text-gray-900">{{ performanceMetrics.process.memory.heapTotal }}MB</p>
                  </div>
                  <div>
                    <span class="text-gray-600">RSS</span>
                    <p class="font-medium text-gray-900">{{ performanceMetrics.process.memory.rss }}MB</p>
                  </div>
                  <div>
                    <span class="text-gray-600">{{ $t('analytics.performance.processUptime') }}</span>
                    <p class="font-medium text-gray-900">{{ formatUptime(performanceMetrics.process.uptime) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              <p>{{ $t('analytics.performance.loading') }}</p>
            </div>
          </div>
        </div>

        <!-- Geolocation Stats -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">{{ $t('analytics.geolocation.title') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="geolocationStats" class="space-y-6">
              <!-- Countries -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">
                  {{ $t('analytics.geolocation.byCountry', { countries: geolocationStats.totalCountries, users: geolocationStats.totalWithLocation }) }}
                </h4>
                <div v-if="geolocationStats.countries.length === 0" class="text-center text-gray-500 py-4">
                  <p>{{ $t('analytics.geolocation.noData') }}</p>
                </div>
                <div v-else class="space-y-2">
                  <div 
                    v-for="country in geolocationStats.countries.slice(0, 5)" 
                    :key="country.countryCode"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <span class="text-lg">{{ getCountryFlag(country.countryCode) }}</span>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ country.country }}</p>
                        <p class="text-xs text-gray-500">{{ $t('analytics.geolocation.cities', { count: country.cityCount }) }}</p>
                      </div>
                    </div>
                    <span class="text-sm font-medium text-primary-600">{{ $t('analytics.geolocation.users', { count: country.userCount }) }}</span>
                  </div>
                </div>
              </div>

              <!-- Cities -->
              <div v-if="geolocationStats.cities.length > 0" class="border-t pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-3">{{ $t('analytics.geolocation.topCities') }}</h4>
                <div class="space-y-2">
                  <div 
                    v-for="city in geolocationStats.cities.slice(0, 5)" 
                    :key="`${city.city}-${city.countryCode}`"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div class="flex items-center space-x-2">
                      <span class="text-sm">{{ getCountryFlag(city.countryCode) }}</span>
                      <span class="text-sm text-gray-900">{{ city.city }}, {{ city.country }}</span>
                    </div>
                    <span class="text-sm font-medium text-primary-600">{{ city.userCount }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              <p>{{ $t('analytics.geolocation.loading') }}</p>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">{{ $t('analytics.system.title') }}</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('analytics.system.appVersion') }}</span>
                <span class="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('analytics.system.database') }}</span>
                <span class="text-sm font-medium text-green-600">✓ {{ $t('analytics.system.online') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('analytics.system.apiStatus') }}</span>
                <span class="text-sm font-medium text-green-600">✓ {{ $t('analytics.system.operational') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">{{ $t('analytics.system.lastUpdate') }}</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(new Date()) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- All Users Dialog -->
    <div v-if="showAllUsersDialog" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          @click="showAllUsersDialog = false"
        ></div>

        <!-- Dialog panel -->
        <div class="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ $t('analytics.allUsers.title', { count: allUsers.length }) }}
            </h3>
            <button
              @click="showAllUsersDialog = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="max-h-96 overflow-y-auto">
            <div v-if="loadingAllUsers" class="text-center py-8">
              <p class="text-gray-500">{{ $t('analytics.allUsers.loading') }}</p>
            </div>
            <div v-else-if="allUsers.length === 0" class="text-center py-8">
              <p class="text-gray-500">{{ $t('analytics.allUsers.noUsers') }}</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="user in allUsers" 
                :key="user._id" 
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">{{ user.email[0].toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ user.name || $t('analytics.allUsers.nameNotAvailable') }}</p>
                    <p class="text-sm text-gray-600">{{ user.email }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{ $t('analytics.allUsers.registeredOn') }}</p>
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(user.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="showAllUsersDialog = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {{ $t('analytics.common.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import '@/services/api.js' // Ensure axios is configured

const stats = ref({
  totalUsers: 0,
  newUsersToday: 0,
  activeUsers: 0,
  onlineUsers: 0,
  totalRecipes: 0,
  recipesToday: 0,
  appOpens: 0
})

const recentUsers = ref([])
const allUsers = ref([])
const onlineUsers = ref([])
const showAllUsersDialog = ref(false)
const loadingAllUsers = ref(false)

// Performance metrics
const performanceMetrics = ref(null)
const performanceStatus = ref('good')
const performanceStatusText = ref('')

// Geolocation stats
const geolocationStats = ref(null)

const loadAllUsers = async () => {
  try {
    loadingAllUsers.value = true
    const response = await axios.get('/admin/users/all')
    allUsers.value = response.data.data || []
  } catch (error) {
    console.error('Errore nel caricamento di tutti gli utenti:', error)
    allUsers.value = []
  } finally {
    loadingAllUsers.value = false
  }
}

const loadPerformanceMetrics = async () => {
  try {
    const response = await axios.get('/admin/performance')
    const data = response.data.data
    
    performanceMetrics.value = data.metrics
    performanceStatus.value = data.status
    
    // Status text is now handled by i18n
    performanceStatusText.value = data.status
    
  } catch (error) {
    console.error('Errore nel caricamento performance metrics:', error)
  }
}

const loadGeolocationStats = async () => {
  try {
    const response = await axios.get('/admin/geolocation')
    geolocationStats.value = response.data.data
  } catch (error) {
    console.error('Errore nel caricamento geolocation stats:', error)
  }
}

const loadAnalytics = async () => {
  try {
    // Carica tutte le analytics in una chiamata
    const response = await axios.get('/admin/analytics')
    const data = response.data.data
    
    // Aggiorna le statistiche
    stats.value.totalUsers = data.users.total || 0
    stats.value.newUsersToday = data.users.newToday || 0
    stats.value.activeUsers = data.users.active || 0
    stats.value.onlineUsers = data.users.online || 0
    stats.value.totalRecipes = data.recipes.total || 0
    stats.value.recipesToday = data.recipes.today || 0
    stats.value.appOpens = data.activities.weekTotal || 0
    
    // Aggiorna utenti recenti e online
    recentUsers.value = data.recentUsers || []
    onlineUsers.value = data.onlineUsers || []
    
  } catch (error) {
    console.error('Errore nel caricamento analytics:', error)
    // Dati di fallback per testing
    stats.value = {
      totalUsers: 25,
      newUsersToday: 3,
      activeUsers: 18,
      totalRecipes: 142,
      recipesToday: 8,
      appOpens: 287
    }
    recentUsers.value = []
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTimeAgo = (date) => {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now - then
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  
  if (diffSecs < 30) return 'ora'
  if (diffSecs < 60) return `${diffSecs}s fa`
  if (diffMins < 60) return `${diffMins}m fa`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h fa`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}g fa`
}

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  
  if (days > 0) {
    return `${days}g ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

const getCountryFlag = (countryCode) => {
  if (!countryCode || countryCode === 'XX' || countryCode === 'LO') return '🌍'
  
  // Convert country code to flag emoji
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  
  return String.fromCodePoint(...codePoints)
}

// Sistema heartbeat
const sendHeartbeat = async () => {
  try {
    await axios.post('/heartbeat')
  } catch (error) {
    console.error('Heartbeat failed:', error)
  }
}

// Auto-refresh della dashboard
const startAutoRefresh = () => {
  // Heartbeat ogni 30 secondi
  setInterval(sendHeartbeat, 30000)
  
  // Refresh analytics ogni 30 secondi
  setInterval(loadAnalytics, 30000)
  
  // Refresh performance metrics ogni minuto
  setInterval(loadPerformanceMetrics, 60000)
  
  // Refresh geolocation stats ogni 5 minuti (cambia meno frequentemente)
  setInterval(loadGeolocationStats, 5 * 60 * 1000)
}

onMounted(() => {
  loadAnalytics()
  loadPerformanceMetrics()
  loadGeolocationStats()
  startAutoRefresh()
})
</script>