<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6 mx-auto max-w-3xl w-full">
      <!-- Welcome Section -->
      <div class="mb-10 bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl border border-primary-100 shadow-sm animate-fade-in-up">
        <h1 class="text-2xl font-bold text-gray-900 mb-2 animate-slide-in-left" v-html="welcomeMessage"></h1>
        <p class="text-gray-600 animate-slide-in-left animation-delay-200">
          {{ $t('home.subtitle') }}
        </p>
      </div>

      <!-- Donation Banner (show occasionally) -->
      <div v-if="showDonationBanner" class="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-xl mb-6 shadow-lg animate-slide-down-fade-in animation-delay-300">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <svg class="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
              </svg>
              <h3 class="font-bold text-lg">{{ $t('home.supportTitle') }}</h3>
            </div>
            <p class="text-white/90 text-sm">{{ $t('home.supportDescription') }}</p>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <button 
              @click="openDonation"
              class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {{ $t('home.supportButton') }}
            </button>
            <button 
              @click="dismissDonationBanner"
              class="text-white/70 hover:text-white p-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-6 mb-10">
        <button 
          @click="$router.push('/app/camera')"
          class="bg-white rounded-xl p-6 shadow-md border border-primary-100 hover:shadow-xl hover:border-primary-200 transition-all transform hover:-translate-y-2 hover:scale-105 duration-300 animate-bounce-in animation-delay-400 group"
        >
          <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:rotate-3">
            <svg class="w-8 h-8 text-primary-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 text-center text-lg group-hover:text-primary-600 transition-colors duration-300">{{ $t('home.scanIngredients') }}</h3>
        </button>

        <button 
          @click="$router.push('/app/recipes')"
          class="bg-white rounded-xl p-6 shadow-md border border-green-100 hover:shadow-xl hover:border-green-200 transition-all transform hover:-translate-y-2 hover:scale-105 duration-300 animate-bounce-in animation-delay-500 group"
        >
          <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-rotate-3">
            <svg class="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 text-center text-lg group-hover:text-green-600 transition-colors duration-300">{{ $t('home.viewRecipes') }}</h3>
        </button>
      </div>

      <!-- Recent Activity -->
      <div class="mb-10 animate-fade-in-up animation-delay-600">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center animate-slide-in-left animation-delay-700">
          <span class="inline-block w-1 h-6 bg-primary-500 rounded mr-2 animate-pulse"></span>
          {{ $t('home.recentActivity') }}
        </h2>
        <div v-if="recentItems.length > 0" class="space-y-4">
          <div 
            v-for="(item, index) in recentItems" 
            :key="item.id"
            class="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-xl hover:border-primary-100 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-slide-in-right group"
            :class="`animation-delay-${800 + index * 100}`"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:rotate-6">
                <svg class="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{{ item.title }}</h3>
                <p class="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">{{ item.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in-up animation-delay-800">
          <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce-slow">
            <svg class="w-10 h-10 text-gray-400 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">{{ $t('home.noRecipesYet') }}</h3>
          <p class="text-gray-600 mb-6 max-w-sm mx-auto">{{ $t('home.noRecipesSubtitle') }}</p>
          <div class="flex justify-center">
            <BaseButton 
              variant="primary"
              @click="$router.push('/app/camera')"
              class="px-6 py-3 text-base"
            >
              {{ $t('home.getStarted') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-blue-900 mb-2 text-lg">{{ $t('home.proTip') }}</h3>
            <p class="text-blue-800">
              {{ $t('home.proTipContent') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Donation Footer -->
      <DonationFooter />
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'
import DonationFooter from '@/components/layout/DonationFooter.vue'
import { userDataService } from '@/services/api'
import { useToast } from 'vue-toastification'
import { DonationHelper } from '@/utils/donationHelper'

// Composables
const { t } = useI18n()
const authStore = useAuthStore()
const toast = useToast()

// Reactive data
const recentItems = ref([])
const loading = ref(false)
const showDonationBanner = ref(false)

// Computed
const welcomeMessage = computed(() => {
  const userName = authStore.currentUser?.name || t('auth.name')
  const highlightedName = `<span class="text-primary-600">${userName}</span>`
  return t('home.welcome', { name: highlightedName })
})

// Methods
const loadRecentActivity = async () => {
  loading.value = true
  try {
    // Load recent activity from database
    recentItems.value = await userDataService.getRecentActivity()
  } catch (error) {
    console.error('Failed to load recent activity:', error)
    // Fallback to empty array
    recentItems.value = []
  } finally {
    loading.value = false
  }
}

const checkDonationBanner = () => {
  // Show banner occasionally - every 5th visit to home
  const lastShown = localStorage.getItem('donationBannerLastShown')
  const visitCount = parseInt(localStorage.getItem('homeVisitCount') || '0') + 1
  localStorage.setItem('homeVisitCount', visitCount.toString())
  
  const daysSinceLastShown = lastShown ? (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24) : 999
  
  // Show if: never shown before OR 7+ days since last shown OR every 5th visit
  if (!lastShown || daysSinceLastShown >= 7 || visitCount % 5 === 0) {
    showDonationBanner.value = true
  }
}

const dismissDonationBanner = () => {
  showDonationBanner.value = false
  localStorage.setItem('donationBannerLastShown', Date.now().toString())
}

const openDonation = () => {
  DonationHelper.openPayPalDonation()
  dismissDonationBanner()
}

// Lifecycle
onMounted(() => {
  loadRecentActivity()
  checkDonationBanner()
})
</script>

<style scoped>
/* Custom animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-down-fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(30px);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05) translateY(-5px);
  }
  70% {
    opacity: 1;
    transform: scale(0.95) translateY(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes bounce-slow {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Animation classes */
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.6s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.6s ease-out forwards;
}

.animate-slide-down-fade-in {
  animation: slide-down-fade-in 0.5s ease-out forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.8s ease-out forwards;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Animation delays */
.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-500 {
  animation-delay: 500ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-700 {
  animation-delay: 700ms;
}

.animation-delay-800 {
  animation-delay: 800ms;
}

.animation-delay-900 {
  animation-delay: 900ms;
}

.animation-delay-1000 {
  animation-delay: 1000ms;
}

/* Initially hide animated elements */
.animate-fade-in-up,
.animate-slide-in-left,
.animate-slide-in-right,
.animate-slide-down-fade-in,
.animate-bounce-in {
  opacity: 0;
}
</style>
