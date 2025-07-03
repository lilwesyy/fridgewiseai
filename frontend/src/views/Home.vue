<template>
  <AuthenticatedLayout>
    <div class="px-4 py-6 mx-auto max-w-3xl w-full">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ $t('home.welcome', { name: authStore.currentUser?.name || $t('auth.name') }) }}
        </h1>
        <p class="text-gray-600">
          {{ $t('home.subtitle') }}
        </p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <button 
          @click="$router.push('/app/camera')"
          class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 class="font-medium text-gray-900 text-center">{{ $t('home.scanIngredients') }}</h3>
        </button>

        <button 
          @click="$router.push('/app/recipes')"
          class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="font-medium text-gray-900 text-center">{{ $t('home.viewRecipes') }}</h3>
        </button>
      </div>

      <!-- Recent Activity -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('home.recentActivity') }}</h2>
        <div v-if="recentItems.length > 0" class="space-y-3">
          <div 
            v-for="item in recentItems" 
            :key="item.id"
            class="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
                <p class="text-sm text-gray-500">{{ item.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('home.noRecipesYet') }}</h3>
          <p class="text-gray-500 mb-4">{{ $t('home.noRecipesSubtitle') }}</p>
          <div class="flex justify-center">
            <BaseButton 
              variant="primary"
              @click="$router.push('/app/camera')"
            >
              {{ $t('home.getStarted') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-blue-900 mb-1">{{ $t('home.proTip') }}</h3>
            <p class="text-sm text-blue-800">
              {{ $t('home.proTipContent') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import BaseButton from '@/components/ui/Button.vue'
import { userDataService } from '@/services/api'

export default {
  name: 'HomePage',
  components: {
    AuthenticatedLayout,
    BaseButton
  },
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  data() {
    return {
      recentItems: [],
      loading: false
    }
  },
  mounted() {
    this.loadRecentActivity()
  },
  methods: {
    async loadRecentActivity() {
      this.loading = true
      try {
        // Load recent activity from database
        this.recentItems = await userDataService.getRecentActivity()
      } catch (error) {
        console.error('Failed to load recent activity:', error)
        // Fallback to empty array
        this.recentItems = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
